from pytubefix import YouTube, streams
import config
import json
from download import *
from urllib import request

# video = YouTube('https://youtu.be/_UlDlkQcHTM', lambda a, b, c: print(a, b, c), lambda a, b, c: print('completed callback'))


def progress_func(a, b, c):
    pass


def complete_func(a, b, c):
    pass


streams = get_streams("https://youtu.be/_UlDlkQcHTM")
request.urlretrieve


print(find_stream(streams))

# yt = YouTube(
#         'http://youtube.com/watch?v=2lAe1cqCOXo',
#         on_progress_callback=progress_func,
#         on_complete_callback=complete_func,
#         proxies=None,
#         use_oauth=False,
#         allow_oauth_cache=True
#     )
# print(yt.streams)
