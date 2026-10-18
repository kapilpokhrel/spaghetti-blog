---
title: 'From Markov Chains to the M/M/1 Queue'
date: '2026-10-18'
desc: 'Exploring the connection from Markov Chain to M/M/1 Queue'
keywords: ['Markov Chain', 'M/M/1 Queue', 'Queueing Theory', 'Birth-Death Process', 'Stationary Distribution', "Little's Law", "M/M/c Queue"]
author: 'Kapil Pokhrel'
author_links: { 'twitter': 'https://x.com/k_10p', 'github': 'https://www.github.com/kapilpokhrel' }
---

While I was learning about queueing systems, I was presented with the M/M/1 queue and its formulas.
I knew that the M/M/1 queue came from Markov chains, and that the M stood for a Markovian process, and I knew a little about Markov chains too — but the connection between them was never clear.

I spent some time learning about it, and this article is the result. We will go from the introduction of Markov chains all the way to the derivation of the M/M/1 queue.

## Introduction to Markov Chains

We will take one example of a service center and build up on that.

In our example, let us assume that in each time frame (say 1 minute) there is a probability $p$ that a new customer will show up, and a probability $q$ that one customer service call will be completed. (Bernoulli processes.)

And suppose our service center only has 5 computers, so we can only have that many customers at a time.
It can be represented as below. Each circle is a state showing how many customers we have in our system right now.
We have 6 states because that's all we can have with 5 computers; there can be either 0 customers at any time, or one, or two, and so on up to five customers.

<CustomImage src='markov_images/service_center_chain.svg' alt='A six-state Markov chain for the service center, with p-prime arcs forward, q-prime arcs back, and r-prime self loops' w='860' h='192' />

It also shows how we can move from one state to another.

We can only move from state $i$ to $i+1$ if a new customer arrived and no customer left in that time.
From our known probabilities, the probability of that happening is

$$
\boxed{p' = p(1-q)}
$$

Similarly, we can only move from state $i$ to state $i-1$ if a customer finished and no new one arrived at that time.
So the probability of that happening is

$$
\boxed{q' = q(1-p)}
$$

And to stay in the same state, either someone has to come and another one has to go, or no one can come or go. So the probability of that happening is the probability of one leaving and one coming, plus the probability of no one coming and no one going:

$$
\boxed{r' = pq + (1-p)(1-q)}
$$

Summing all of these probabilities results in 1.

This is the Markov chain that models our service center.

With all this said, let us cover some terminology, and then we will connect it back to this example.

## Analysis of a Markov Chain

What makes the above model a Markov chain? It qualifies as a Markov chain because it does not depend on the past.

You can be completely blind about your past and about how you reached your current state. All you know is that you can either go to the next state with some probability, or go back, or stay where you are.

$$
\boxed{
\begin{aligned}
P_{ij} &= P(X_{n+1} = j \mid X_n = i) \\
&= P(X_{n+1} = j \mid X_n = i, X_{n-1}, \ldots, X_0)
\end{aligned}
}
$$

What it is saying is that the conditional probability of being in state $j$ given that we are in state $i$ is the same as the conditional probability of being in $j$ given the complete path from $0$ to $i$.
This shows that all the information about your previous states is useless, and that all that determines your probability of being in the next state is your current state.

Now, we can also define the probability that you go from state $i$ to state $j$ in $n$ steps as

$$
\boxed{
\begin{aligned}
r_{ij}(n) &= P(X_n = j \mid X_0 = i) \\
&= \sum_{k=1}^m r_{ik}(n-1) P_{kj}
\end{aligned}
}
$$

Initially we are at state $i$. In $n-1$ steps we can be in any state $1$ to $m$ (given that we have $m$ states).
The probability of being in state $k$ in $n-1$ steps is $r_{ik}(n-1)$, and the probability of moving from that state $k$ to $j$ is $P_{kj}$.
Doing that for every possible $k$, we get $r_{ij}(n)$.

That's the recursive formula for $r_{ij}$, with base case

$$
r_{ij}(0) =
\begin{cases}
1, & \text{if } i = j,\\
0, & \text{if } i \neq j.
\end{cases}
$$

> If the process starts in state $i$, then after zero moves it remains in state $i$ with probability 1. Therefore the probability of being in any different state $j \neq i$ after zero moves is 0.

We can also define it the other way around:

$$
r_{ij}(n) = \sum_{k=1}^m P_{ik} \, r_{kj}(n-1)
$$

This is just the other representation of the previous result: the probability of going from $i$ to $k$ in the next move, and then the summation over all the paths that reach $j$ from $k$.

---

We will use the results above to solve a simple example.
Suppose we have a Markov chain with two states, $1$ and $2$, with the following transition probabilities.

<CustomImage src='markov_images/two_state.svg' alt='A two-state Markov chain with transition probabilities 0.5, 0.5, 0.2 and 0.8' w='330' h='180' />

The transition probability matrix is

$$
P =
\begin{pmatrix}
0.5 & 0.5 \\
0.2 & 0.8
\end{pmatrix}
$$

Let $r_{ij}(n)$ denote the probability of being in state $j$ after $n$ steps, given that the process started in state $i$.

The transition probabilities for different values of $n$ are illustrated in the following table:

|              | $n=0$ | $n=1$ | $n=2$  | $\cdots$ | $n=100$              | $n=101$              |
| ------------ | ----- | ----- | ------ | -------- | -------------------- | -------------------- |
| $r_{11}(n)$  | $1$   | $0.5$ | $0.35$ | $\cdots$ | $\approx \frac{2}{7}$ | $\approx \frac{2}{7}$ |
| $r_{12}(n)$  | $0$   | $0.5$ | $0.65$ | $\cdots$ | $\approx \frac{5}{7}$ | $\approx \frac{5}{7}$ |
| $r_{21}(n)$  | $0$   | $0.2$ | $0.30$ | $\cdots$ | $\approx \frac{2}{7}$ | $\approx \frac{2}{7}$ |
| $r_{22}(n)$  | $1$   | $0.8$ | $0.70$ | $\cdots$ | $\approx \frac{5}{7}$ | $\approx \frac{5}{7}$ |

For example, to calculate $r_{11}(2)$, we consider all possible paths that start in state $1$ and return to state $1$ after two steps. There are two such paths:

$$
1 \to 1 \to 1
\qquad \text{and} \qquad
1 \to 2 \to 1
$$

Therefore,

$$
\begin{aligned}
r_{11}(2)
&= P(1\to1\to1)+P(1\to2\to1)\\
&= (0.5)(0.5)+(0.5)(0.2)\\
&= 0.25+0.10\\
&= 0.35
\end{aligned}
$$

Similarly, the other two-step transition probabilities can be calculated by considering all possible paths of length two.

We observe a remarkable pattern: as $n$ increases, the transition probabilities converge to fixed values. In particular,

$$
\begin{aligned}
\lim_{n\to\infty} r_{11}(n)
&= \lim_{n\to\infty} r_{21}(n)
= \frac{2}{7},\\[6pt]
\lim_{n\to\infty} r_{12}(n)
&= \lim_{n\to\infty} r_{22}(n)
= \frac{5}{7}
\end{aligned}
$$

Thus, regardless of whether the process starts in state $1$ or state $2$, the probability of being in state $1$ approaches $\frac{2}{7}$, while the probability of being in state $2$ approaches $\frac{5}{7}$.

These limiting probabilities are called the **stationary probabilities**, denoted by $\pi_j$.

This observation raises a natural question.

**Does this convergence occur for every Markov chain?** In other words, is it always true that

$$
\boxed{
\lim_{n\to\infty} r_{ij}(n) = \pi_j
}
$$

for every pair of states $i$ and $j$, where the limiting probability $\pi_j$ is independent of the initial state $i$?

---

It depends. It depends on the Markov chain. If all recurrent states belong to a single recurrent class, and this class is not periodic, then the transition probabilities converge to a limiting distribution, under the usual finite-state assumptions.

> We will not discuss recurrent states, recurrent classes, or periodicity in detail here, but these concepts are not too difficult to understand.

If the transition probabilities converge, we can derive equations for the limiting probabilities.

We already know:

$$
r_{ij}(n) = \sum_{k=1}^{m} r_{ik}(n-1)P_{kj}
$$

Taking the limit as $n \to \infty$, we obtain

$$
\lim_{n\to\infty} r_{ij}(n)
=
\sum_{k=1}^{m}
\left(\lim_{n\to\infty}r_{ik}(n-1)\right)P_{kj}
$$

Since $n-1 \to \infty$ as $n \to \infty$, we have

$$
\lim_{n\to\infty}r_{ij}(n)=\pi_j
\qquad \text{and} \qquad
\lim_{n\to\infty}r_{ik}(n-1)=\pi_k
$$

Therefore,

$$
\boxed{
\pi_j = \sum_{k=1}^{m}\pi_k P_{kj},
\qquad j=1,2,\ldots,m
}
$$

These equations give us one equation for each state $j$. In addition, the probabilities must satisfy the normalization condition

$$
\boxed{
\sum_{j=1}^{m}\pi_j=1
}
$$

> since the total probability of being in any state must equal 1.

Thus, by solving this system of equations, we can determine the steady-state probabilities $\pi_1,\pi_2,\ldots,\pi_m$.

## Birth-Death Process

We will now finally return to our old customer service example and give it a name. This kind of process is called a **birth-death process**.

It is simple: either there can be one birth and we move to the next state, one death and we move to the previous state, or we stay in our current state.

<CustomImage src='markov_images/birth_death_chain.svg' alt='A general birth-death chain with birth probabilities p_i forward and death probabilities q_i backward' w='870' h='160' />

Let us analyse this birth-death process, since it will be used directly for our M/M/1 queue.

First, let us pick one section of this chain:

<CustomImage src='markov_images/local_balance.svg' alt='Two neighbouring states i and i+1, with p_i going forward and q_i+1 coming back' w='340' h='172' />

If the process runs long enough and reaches a steady state (birth-death processes satisfy the conditions on recurrent states and periodicity mentioned earlier), there must be a balance between the flow into and out of each state.

**Why?** It balances out. For example, if $p_i$ is smaller and $q_{i+1}$ is greater (just like in a stable queue), then we are more likely to find ourselves in state $i$ than in state $i+1$:

$$
\pi_i > \pi_{i+1}
$$

The probability of a transition from state $i$ to state $i+1$ is

$$
P(\text{jump from } i \text{ to } i+1)=\pi_i p_i
$$

Similarly, the probability of a transition from state $i+1$ to state $i$ is

$$
P(\text{jump from } i+1 \text{ to } i)=\pi_{i+1}q_{i+1}
$$

Now we can see that, in the first case, $\pi_i$ is greater but $p_i$ is smaller. In the second case, $\pi_{i+1}$ is smaller but $q_{i+1}$ is greater.

These balance out, and we get

$$
P(\text{jump from } i \text{ to } i+1)
=
P(\text{jump from } i+1 \text{ to } i)
$$

Therefore,

$$
\boxed{\pi_{i+1}q_{i+1}=\pi_i p_i}
$$

We can simplify our model further by assuming that $p_i=p$ and $q_i=q$ for all states. Thus,

$$
\pi_{i+1}q=\pi_i p
$$

Rearranging, we get

$$
\pi_{i+1}=\pi_i\frac{p}{q}
$$

Therefore,

$$
\pi_1=\pi_0\frac{p}{q}
$$

and

$$
\begin{aligned}
\pi_2
&=\pi_1\frac{p}{q}\\
&=\left(\pi_0\frac{p}{q}\right)\frac{p}{q}\\
&=\pi_0\left(\frac{p}{q}\right)^2
\end{aligned}
$$

So, in general, letting

$$
\boxed{\rho=\frac{p}{q}}
$$

we get

$$
\boxed{\pi_n=\pi_0\rho^n}
$$

We know that the sum of all steady-state probabilities must equal $1$:

$$
\sum_{i=0}^{m}\pi_i=1
$$

Substituting the expressions above, we obtain

$$
\pi_0(1+\rho+\rho^2+\cdots+\rho^m)=1
$$

Therefore,

$$
\boxed{
\pi_0=\frac{1}{\displaystyle\sum_{i=0}^{m}\rho^i}
}
$$

where the denominator is the sum of a geometric series.

## The M/M/1 Queue

For an M/M/1 queue, we suppose that the queue length is infinite. That is, we let $m \to \infty$.

For a stable queue we have $p<q$, and therefore

$$
\rho=\frac{p}{q}<1
$$

We know that the sum of a geometric series is

$$
\sum_{n=0}^{\infty}\rho^n=\frac{1}{1-\rho},
\qquad |\rho|<1
$$

Therefore,

$$
\pi_0
=\frac{1}{\displaystyle\sum_{n=0}^{\infty}\rho^n}
=1-\rho
$$

Recall that $\pi_n=\pi_0\rho^n$. Substituting $\pi_0=1-\rho$, we obtain

$$
\boxed{\pi_n=(1-\rho)\rho^n}
$$

Now, in an M/M/1 queue, both the arrival process and the service process are assumed to be Poisson processes. Equivalently, the interarrival times and service times follow exponential distributions.

For an exponential distribution with rate $\lambda$, the probability density function (PDF) is

$$
f(t)=\lambda e^{-\lambda t},
\qquad t\geq 0
$$

The cumulative distribution function (CDF) is

$$
F(t)=1-e^{-\lambda t},
\qquad t\geq 0
$$

The hazard rate is defined as

$$
h(t)=\frac{f(t)}{1-F(t)}
$$

Here, the hazard rate $h(t)$ represents the instantaneous rate at which the event occurs, given that it has not occurred before time $t$.

For the exponential distribution, we obtain

$$
\begin{aligned}
h(t)
&=\frac{\lambda e^{-\lambda t}}
{1-(1-e^{-\lambda t})}\\[6pt]
&=\frac{\lambda e^{-\lambda t}}{e^{-\lambda t}}\\[6pt]
&=\lambda
\end{aligned}
$$

Thus the hazard rate is constant. This is exactly the **memoryless property** of the exponential distribution: the probability of an event occurring within the next time interval does not depend on how long we have already waited.

Therefore, if arrivals follow a Poisson process with rate $\lambda$ arrivals per unit time, then over a small interval $\Delta t$ the probability of an arrival is

$$
p=\lambda\Delta t
$$

Similarly, if the service process completes services at rate $\mu$ per unit time, then the probability of a departure is

$$
q=\mu\Delta t
$$

and so $\rho = \frac{p}{q} = \frac{\lambda}{\mu}$, since the $\Delta t$ cancels.

With these probabilities, we get something like this. From state $n$, at time $\Delta t$, we can reach state $n+1$, or $n$, or state $n-1$.

<CustomImage src='markov_images/delta_t_transitions.svg' alt='From state n at time t, the chain reaches n+1, n, or n-1 at time t plus delta t' w='530' h='344' />

And in a more general view:

<CustomImage src='markov_images/mm1_flow.svg' alt='The M/M/1 chain with probability flow pi_n lambda delta t forward and pi_n mu delta t backward' w='964' h='163' />

Finally, it's time to derive the other queue parameters.

$$
\boxed{
\begin{aligned}
\overline{N}
&= \sum_{n=0}^{\infty} n\pi_n \\[6pt]
&= \sum_{n=0}^{\infty} n\rho^n(1-\rho) \\[6pt]
&= (1-\rho)\sum_{n=0}^{\infty} n\rho^n \\[6pt]
&= (1-\rho)\rho\sum_{n=0}^{\infty} n\rho^{n-1} \\[6pt]
&= (1-\rho)\rho\frac{d}{d\rho}
   \sum_{n=0}^{\infty}\rho^n \\[6pt]
&= (1-\rho)\rho\frac{d}{d\rho}
   \left(\frac{1}{1-\rho}\right) \\[6pt]
&= (1-\rho)\rho
   \left(\frac{1}{(1-\rho)^2}\right) \\[6pt]
&= \frac{\rho}{1-\rho}
 = \frac{\frac{\lambda}{\mu}}
        {1-\frac{\lambda}{\mu}}
 = \frac{\lambda}{\mu-\lambda}
\end{aligned}
}
$$

where $\overline{N}$ is the expected number of customers in the system.

$$
\boxed{
\begin{aligned}
\overline{T}
&= \frac{\overline{N}}{\lambda}
 = \frac{\lambda}{\mu-\lambda}\cdot\frac{1}{\lambda} \\[6pt]
&= \frac{1}{\mu-\lambda}
\end{aligned}
}
$$

where $\overline{T}$ is the average time a customer spends in the system.

> From Little's law, $\overline{N} = \lambda\overline{T}$.

$$
\boxed{
\begin{aligned}
\overline{T}_q
&= \overline{T}-\frac{1}{\mu} \\[6pt]
&= \frac{1}{\mu-\lambda}-\frac{1}{\mu} \\[6pt]
&= \frac{\lambda}{\mu(\mu-\lambda)}
\end{aligned}
}
$$

where $\overline{T}_q$ is the average time a customer spends waiting in the queue.

$$
\boxed{
\begin{aligned}
\overline{N}_q
&= \lambda\overline{T}_q \qquad \text{(Little's law)}\\[6pt]
&= \frac{\lambda^2}{\mu(\mu-\lambda)}
\end{aligned}
}
$$

where $\overline{N}_q$ is the expected number of customers waiting in the queue.

## Why just the M/M/1 queue? Why not others?

If you look at what we did, we used the memoryless property of the exponential distribution to define the probabilities of the birth-death process.

That property is really what made the whole thing work. Because the hazard rate is constant, every jump has a fixed probability, no matter how long the system had already been sitting in its current state.

So the method is not tied to M/M/1 at all. As long as the process stays Markovian, we can reuse it.

---

Take the M/M/3 queue, where we have 3 servers instead of 1:

<CustomImage src='markov_images/mm3_chain.svg' alt='The M/M/3 chain, where the departure rate grows as mu, 2 mu, 3 mu and then saturates at 3 mu' w='891' h='149' />

The only thing that changed is the backward probability. With more than one server, more than one customer can be served at a time, so departures get faster until every server is busy.

In state $n$, the number of busy servers is $\min(n,c)$, so the total departure rate is

$$
\mu_n=\begin{cases}n\mu,&1\le n<c,\\c\mu,&n\ge c\end{cases}
$$

The local balance equation between neighbouring states is the same one we derived before, just with $\mu_n$ in place of a constant $q$:

$$
\lambda\pi_{n-1}=\mu_n \pi_n,\qquad n\ge1
$$

Starting at state zero,

$$
\begin{aligned}
\pi_1&=\frac{\lambda}{\mu}\pi_0,\\[6pt]
\pi_2&=\frac{\lambda}{2\mu}\pi_1
=\frac{(\lambda/\mu)^2}{2!}\pi_0,\\[6pt]
\pi_3&=\frac{\lambda}{3\mu}\pi_2
=\frac{(\lambda/\mu)^3}{3!}\pi_0
\qquad\text{(when } c\ge3\text{)}
\end{aligned}
$$

In general,

$$
\boxed{\pi_n=\frac{(\lambda/\mu)^n}{n!}\pi_0,\qquad 0\le n\le c}
$$

---

Now take away the exponential service time.

If the hazard rate $h(t)$ is not constant — which is true for any general distribution — then we can't simply know whether a customer will arrive or finish just from the condition of our queue. The probability that the current service finishes in the next instant now depends on how long that service has already been running.

At that point you need a different tool. For example, in [this video](https://www.youtube.com/watch?v=Hda5tMrLJqc), he used a triangle method. (I am plugging this video here to suggest that you should watch it, it is a good talk on this subject)
