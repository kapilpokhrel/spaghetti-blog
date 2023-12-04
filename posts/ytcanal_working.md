---
title: 'How YtCanal used named pipes to achieve instantaneous downloads'
date: '2023-12-04'
desc: 'A blog to explain the internal working of YtCanal and how it achieved instantaneous downloads.'
keywords: ['ytcanal', 'instaneous download', 'content streaming', 'ytcanal working', 'pipes', 'named-pipes', 'ffmpeg']
author: 'Kapil Pokhrel'
author_links: { 'twitter': 'https://x.com/k_10p', 'github': 'https://www.github.com/kapilpokhrel' }
---

### Introduction
Ytcanal was the YouTube video converter/downloader site which used pipes to achieve instantaneous conversion even for longer videos. What do I mean by that? Lets imagine a 5 hours long video, while trying to download such video, the problem was that the server would take way long to download and process it and user had to wait till it was done. With YtCanal, download used to start soon after you provide a link and click download no matter how long the video was. Because of this and its ad-free environment, it gained quite a love from [Reddit](https://www.reddit.com/r/InternetIsBeautiful/comments/yzyeor/i_built_an_ad_free_minimal_and_fast_online/?rdt=47526) and as most users there asked how it worked, in this article, I will try to explain just that.

To many of you who don't know, YtCanal was a online fully-featured youtube downloader I made for myself and it ended up being loved by others too. I am using past tense here as we had to take it down because of YouTube's warning letter to cease the service. I would also like to say sorry for losing the repository with the server, but it was quite simple.

### Content
Anyways, the method I used to get instantaneous downloads was to stream the video to the user simultaneous as it was being downloaded and processed in the server.
<CustomImage src='process_high_level.png' w='1920' h='1080'/>

Now that we know that the server streamed the video in real time. Let's see in detail, how exactly it was done. To build YtCanal, I used flask and in flask, you can send real time data with [Response object](https://tedboy.github.io/flask/generated/generated/flask.Response.html).  Here's how it looks. Of course, the code shown in this article are not meant to be copied. These are just to give the basic idea.
```python
response = Response(generator(), headers=headers, mimetype=mime, content_type='video/mp4')
return response
```
What is does is that it opens the connection with a browser and calls the [generator function](https://realpython.com/introduction-to-python-generators/#example-1-reading-large-files). Every yield from the generator is directly streamed to the browser and this way, you can send the large file piece by piece.
Lets take a closer look at a generator function used for video processing and see how it download and generate new processed video in small chunks.
```python
def generator():
	# Other logic and variables
	...
	os.mkfifo(audio_named_pipe_filename)
	os.mkfifo(video_named_pipe_filename)
	
	ffmpeg_cmd = [
	'ffmpeg', '-thread_queue_size', '1048576', '-i', audio_named_pipe_filaname,
	'-thread_queue_size', '1048576', '-i', video_named_pipe_filename,
	'-c', 'copy', '-movflags', 'frag_keyframe+empty_moov',
	'-y', '-f', 'mp4', 'pipe:', '-loglevel', 'quiet'
	]
	
	# Starts the ffmpeg process
    ffmpeg_process = subprocess.Popen(
		ffmpeg_cmd, stdout=subprocess.PIPE, stdin=subprocess.PIPE
	)
	
	# audio_url and video_url are extracted using pytube
	# stop_thread is a flag, downloader thread will stop when set to True
	video_thread = Thread(
		name="Video_Downloader",
		target=get_content_from_url, 
		args=[video_url, video_named_pipe_filename, lambda: stop_thread]
	)
	audio_thread = Thread(
		name="Audio_Downloader",
		target=get_content_from_url,
		args=[audio_url, audio_named_pipe_filename, lambda: stop_thread]
	)
    # Start the thread
    video_thread.start()
    audio_thread.start()
	
	# Generator, this will 
	try:
		while True:
	        video_chunk = ffmpeg_process.stdout.read(65536)
            if ffmpeg_process.poll() is None:
	            yield video_chunk
            else:
	            break
	except GeneratorExit:
		ffmpeg_process.kill()
	
	# If finished sending the video or if cancalled, do some clean up
	stop_thread = True
	video_thread.join()
	audio_thread.join()
	os.remove(audio_named_pipe_filename)
	os.remove(video_named_pipe_filename)
	
	
```
For every video user requests, we first get the video and audio url provided by the YouTube. (YouTube provides separate URL for audio and video and we have to combine them in the end). In YtCanal, I used [pytube](https://github.com/pytube/pytube) to accomplish this. After that, we make two named pipes, also called [fifo](https://docs.python.org/3/library/os.html#os.mkfifo). With these pipes opened, we create two separate thread to download audio and video and pass them with the pipes we just created. These threads will download the content from the internet and in chunks and write that into a pipe.
<CustomImage src='process_server_level.png' w='4973' h='3473' />

Next, we start a ffmpeg process and use the audio and video pipes as the input for ffmpeg. Ffmpeg will gradually take the audio and video content from those pipes  and process and mix the audio video together (called muxing) to generate a new video. We passed the `'pipe:'` flag in ffmpeg so it will write the output of the video directly to its standard output.(You can also use stdin as a input for video instead of creating a named pipe, see more about pipes in ffmpeg [here](https://ffmpeg.org/ffmpeg-protocols.html#pipe)) Finally, we read the standard output of the ffmpeg process from our generator in 64KB chunks and yield that to be sent to the browser.

### Problem I encountered with this approach
One problem I encountered with this approach is to determine the file size. Since, we are streaming the video in real time while it is being generated, I couldn't figure out the actual file size of the processed video before hand. Due to this, I was unable to set the content-length header wile sending the response and it resulted in the downloads like this where it didn't show how much time and file is remaining to download.
<CustomImage src='download_status.png' w='590' h='66' />


 

