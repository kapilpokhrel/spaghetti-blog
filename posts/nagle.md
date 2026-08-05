---
title: 'The 40ms Delay Hiding in a Reused Connection'
date: '2026-08-05'
desc: "A connection pool exposed a 40ms standoff between Nagle's algorithm and delayed ACK in my HTTP proxy."
keywords: ["Nagle's Algorithm", 'Delayed ACK', 'TCP_NODELAY', 'TCP_QUICKACK', 'Reverse Proxy', 'Rust']
author: 'Kapil Pokhrel'
author_links: { 'twitter': 'https://x.com/k_10p', 'github': 'https://www.github.com/kapilpokhrel' }
---

### Background

I am writing a HTTP reverse proxy. Initially I had it set up such that it opens a new connection for each request. Everything was good, fast enough as expected and was working, but there was clear overhead of trying to open a connection to the same backend on each request. So as a natural step forward, I implemented a connection pool.

<CustomImage src='nagle_images/ConnectionPool.png' alt='Basic Connection pool' w='707' h='533' />
*Basic Connection Pool*

So for each backend address, I kept a vector of opened connections (of course with some maximum cap) and when one request finishes using it, it puts back the connection reducing the need to go through the TCP handshake again. In a simplified form, it looked like this:

```rust
async fn forward_http(conn, ...) -> ... {

    let headers = reader_headers(conn, ...);
    let host = get_host(headers, ...);
    let backend_addr = resolve_backend(host, ...);
    let backend_conn = get_conn(&backend_addr).await;

    // forward the request data
    // read response from the backend_conn and write back to conn
    
    put_conn(backend_addr, backend_conn).await;
    Ok(())
}

```

### Problem

Of course, with a connection pool, it was supposed to speed things up. But, no. Each request was taking longer. And at that time, it was even behaving weirdly, that's because I had another bug too (many idle connections per thread blowing up the backend's connection queue). So initially AI also couldn't pinpoint the actual problem (my prompts were vague too cause I had no idea what was happening)

After figuring that out, it was much clearer that each request was taking almost 40ms, almost 7 times as long as the non-pooled version. And now AI was easily able to say that the 40ms was Linux's default ACK delay in TCP connection which, paired with Nagle's algorithm was causing the problem.

Given that I had no idea what [Nagle's algorithm](https://en.wikipedia.org/wiki/Nagle's_algorithm) was. I looked into it and found that it was basically this (from wikipedia):

```pascal
if there is new data to send then
    if the window size ≥ MSS and available data is ≥ MSS then
        send complete MSS segment now
    else
        if there is unconfirmed data still in the pipe then
            enqueue data in the buffer until an acknowledge is received
        else
            send data immediately
        end if
    end if
end if
```

and I also found that we can set `TCP_NODELAY` to disable Nagle's algorithm and voila, it was fast. No 40ms latency per request.

But I still had no idea why. What exactly was happening. Where exactly this 40ms delay was occurring? And why did it only show up in a pooled connection.

### Exploration

So, like any other sane person, I removed that `TCP_NODELAY` flag and opened Wireshark and captured the frames. Now I could clearly see where exactly it was blocking.

Request:
72 bytes header + 8KB body = 8264 bytes


Let's analyze the complete flow of data between proxy connection and backend to see where the delay occurs. Also, I have stripped the handshake and data transfer details between client and proxy. An http request from client to proxy means the complete request was transferred.

<CustomImage src='nagle_images/delayed.svg' alt='A delayed flowgraph' w='1200' h='1750' />
*Delayed flowgraph*

- Initially, a client connection `54186` sends a request to proxy on port 5000. (#1) (Remember that I have stripped other details here)
- Proxy creates a new connection, `38440` with backend `8000` (#2, #3 and #4)
- `38440` pushes 8KB of data to backend `8000` (#5) and backend immediately acknowledges that (#6).
- At this point, in 38440's buffer, there is no unacknowledged data; the Nagle condition is not satisfied so it immediately sends the remaining 72 bytes of data to complete the HTTP request (#7).
- backend again immediately sends the ACK for that (#8) and 128-byte response as well (#9)
- proxy connection `38440` sends the ACK (#10) and now proxy `5000` forwards that back to client `54186` (#11).

At this point, proxy connection `38440` is pushed back to the connection pool.

- Again, a new client connection `54198` sends a request to proxy (#12).
- Proxy pulls the connection `38440` from pool and pushes the initial 8KB to backend like it previously did. (#13).

But, now we are stuck and we have reached our actual problem. Backend is now delaying the ack and this delay is causing that Nagle condition of unacknowledged pushed data to be true. So, even though proxy has written the remaining 72 bytes to the TCP buffer, it hasn't reached the wire because Nagle is holding it.
We are in a deadlock-like situation here, Nagle is expecting the backend to send the ACK for previously sent 8KB data and in the meantime, backend is hoping to piggyback the ACK in the response after it gets all the data.
In short, proxy is waiting for the backend's approval to send that 72 byte and backend is waiting for that 72 remaining bytes to send that approval.

<CustomImage src='nagle_images/delay_meme.png' alt='40ms later' w='903' h='677' />

- Backend acknowledges that data; *initial 8KB.* (#14)
- All of our sent data is now acknowledged and the condition holding that 72 byte is no longer true now, so the remaining 72 bytes is sent to complete the HTTP request. (#15)
- Backend sends ACK for the complete data (full 8264 bytes) (#16) and sends the response as well (#17)
- And as with the last request, proxy(5000) forwards that response back (#18).
Step 7 - 12 are repeated again and again, and each time there is a 40ms halt.


Now the solution is clear, we either tell the TCP to not use Nagle's algorithm or we configure the backend to not try to piggyback ACK and immediately send it. In fact, I will show you the flowgraph of both solutions.

## Solution: TCP_NODELAY or TCP_QUICKACK

| TCP_NODELAY | TCP_QUICKACK |
|-------------|--------------|
| <CustomImage src='nagle_images/no_nagle.svg' alt='TCP_NODELAY' w='1200' h='1700' /> |  <CustomImage src='nagle_images/quick_ack.svg' alt='TCP_QUICKACK' w='1200' h='1700' /> |

Up #13, it's basically the same as previously delayed flowgraph. 

- With `TCP_NODELAY` flag enabled, even though we have unacknowledged data in the buffer, we don't care. It immediately sends that remaining 72 bytes and the backend expectation to get the complete data is fulfilled.
- With `TCP_QUICKACK` , after #13, Nagle's algorithm is active and it is waiting for the previous 8KB to be acknowledged but now backend is not trying to piggyback and immediately sends the ACK for that 8KB invalidating Nagle's hold condition and we don't feel any delay.

In the particular problem, I chose `TCP_NODELAY` because of course proxy doesn't control the backend server to set `QUICKACK`. Also `TCP_QUICKACK` is only available on Linux and there is one more thing.
*`TCP_QUICKACK` is used too when receiving a request from a keepalive client connection.*


### Why did the backend not delay the ACK for the first request?

If you have noticed, in any of those 3 conditions, there is no delay in receiving an ACK from the backend for the first request. This also perfectly explains why I only saw this issue when I used the connection pool. First request in a connection faced no delayed ACK and with only one request per connection, no request faced any delay.

But why?

Well, as I said, there is a thing with `QUICKACK`, it is not like a toggle switch like `TCP_NODELAY`. It is merely a hint to a kernel not to delay the ACK in next few frames. And when we open the connection for the first time, it starts with `QUICKACK` mode and after few frames, it falls back to delayed ACK.

You can peek into the [source code for tcp in Linux kernel](https://github.com/torvalds/linux/blob/master/net/ipv4/tcp_input.c) to know exactly how it behaves. Here, I will show you tiny little segment.

```c
/* net/ipv4/tcp_input.c */
static void tcp_event_data_recv(struct sock *sk, struct sk_buff *skb)
{
	...
	if (!icsk->icsk_ack.ato) {
		/* The _first_ data packet received, initialize
		 * delayed ACK engine.
		 */
		tcp_incr_quickack(sk, TCP_MAX_QUICKACKS);
		icsk->icsk_ack.ato = TCP_ATO_MIN;
	} else {
        ...
```
When it begins to read the data for the first time, it initializes the quickack with this function below.

```c
/* net/ipv4/tcp_input.c */
static void tcp_incr_quickack(struct sock *sk, unsigned int max_quickacks)
{
	struct inet_connection_sock *icsk = inet_csk(sk);
	unsigned int quickacks = tcp_sk(sk)->rcv_wnd / (2 * icsk->icsk_ack.rcv_mss);

	if (quickacks == 0)
		quickacks = 2;
	quickacks = min(quickacks, max_quickacks);
	if (quickacks > icsk->icsk_ack.quick)
		icsk->icsk_ack.quick = quickacks;
}
```
In our case, rwnd and mss were exactly the same on localhost, so `quickacks = 2`.
And after that initial 8KB and 72 byte request tail. quickacks are exhausted and delayed ACK kicks in.

And yes, when I configured backend server to never delay the ACK, I set `TCP_QUICKACK` before every receive.
