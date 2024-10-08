import config
import json
from download import *
from urllib import request


# import yt_dlp

# URLS = ['https://www.youtube.com/watch?v=BaW_jenozKc']

# ydl_opts = {
#     'format': 'm4a/bestaudio/best',
#     # ℹ️ See help(yt_dlp.postprocessor) for a list of available Postprocessors and their arguments
#     'postprocessors': [{  # Extract audio using ffmpeg
#         'key': 'FFmpegExtractAudio',
#         'preferredcodec': 'm4a',
#     }]
# }

# with yt_dlp.YoutubeDL(ydl_opts) as ydl:
#     error_code = ydl.download(URLS)

# import youtube_dl

# ydl_opts = {}
# with youtube_dl.YoutubeDL(ydl_opts) as ydl:
#     ydl.download(['https://www.youtube.com/watch?v=BaW_jenozKc'])

# from pytubefix import YouTube

# yt = YouTube("https://youtu.be/_UlDlkQcHTM", use_po_token=False, client="WEB")
# ys = yt.streams.get_highest_resolution()
# ys.download()


video_id = extract_video_id("https://youtu.be/_UlDlkQcHTM")
streams = get_streams(video_id)
stream = find_stream(streams)
# sign_url("https://youtu.be/_UlDlkQcHTM", stream)
url = stream["url"]

print(stream)
