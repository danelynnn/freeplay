from urllib.request import *
import config
import re
import json


def extract_video_id(url):
    return re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url).group(1)


def get_streams(url):
    video_id = extract_video_id(url)
    data = json.dumps(
        {
            "context": config.context,
            "videoId": video_id,
            "contentCheckOk": "true",
        }
    ).encode("ascii")

    response = urlopen(
        Request(
            "https://www.youtube.com/youtubei/v1/player?prettyPrint=false",
            data,
            config.base_headers,
        )
    )
    return json.load(response)["streamingData"]["adaptiveFormats"]


def find_stream(streams, prioritise_bitrate=True, include_video=False):
    filtered_streams = filter(lambda s: s["mimeType"].split("/")[0] == "audio", streams)
    if prioritise_bitrate:
        return sorted(filtered_streams, key=lambda s: s["bitrate"], reverse=True)[0]
    else:
        return filtered_streams[0]


if __name__ == "__main__":
    pass
