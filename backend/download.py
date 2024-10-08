from urllib.request import *
import config
import re
import json
from bs4 import BeautifulSoup
from utils.cipher import Cipher
from urllib.parse import parse_qs, quote, urlencode, urlparse


def extract_video_id(url):
    return re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url).group(1)


def request_json(url, data, headers) -> object:
    response = urlopen(Request(url, data=data, headers=headers))
    return json.load(response)


def request(url, data, headers) -> str:
    response = urlopen(Request(url, data=data, headers=headers))
    return response.read().decode("utf-8")


def get_streams(video_id):
    data = json.dumps(
        {
            "context": config.ios_context,
            "videoId": video_id,
            "contentCheckOk": "true",
        }
    ).encode("ascii")

    response = urlopen(
        Request(
            "https://www.youtube.com/youtubei/v1/player?prettyPrint=false",
            data=data,
            headers=config.ios_headers,
        )
    )
    response = json.load(response)
    return response["streamingData"]["adaptiveFormats"]


def sign_url(video_id, stream):
    video_id = extract_video_id(video_id)
    full_url = f"https://www.youtube.com/watch?v={video_id}"

    response = urlopen(url=full_url)
    soup = BeautifulSoup(response)

    scripts = soup.findAll("script")
    for script in scripts:
        content = script.text

        if "ytInitialPlayerResponse" in content:
            search = re.search(r"ytInitialPlayerResponse\s*=\s*(.*);", content)

            if search:
                search = search.group(1)
                ytInitialPlayerResponse = json.loads(search)
        elif "ytcfg" in content and "CLIENT_CANARY_STATE" in content:
            search = re.search(r"ytcfg.set\(({.*})\)", content)

            if search:
                search = search.group(1)
                search = search.replace("'", '"')
                ytcfg = json.loads(search)

    if not ytcfg or not ytInitialPlayerResponse:
        raise Exception()

    js_url = ytcfg["PLAYER_JS_URL"]
    response = request(
        f"https://youtube.com{js_url}",
        None,
        {"User-Agent": "Mozilla/5.0", "accept-language": "en-US,en"},
    )
    cipher = Cipher(response)
    stream["url"] = (
        "https://rr2---sn-jxou0gtapo3-qxoe.googlevideo.com/videoplayback?expire=1728045105&ei=0Yv_ZuCyHdGP2_gP6__r-QY&ip=71.33.149.220&id=o-AGpBA7NW6xVDK5GddHk1jSErA5OJhPQreLd-ROleAsfX&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=XA&mm=31%2C29&mn=sn-jxou0gtapo3-qxoe%2Csn-qxoedne7&ms=au%2Crdu&mv=m&mvi=2&pcm2cms=yes&pl=18&initcwndbps=1346250&bui=AXLXGFR4v9Pfdo7xkqpmiTeEx0Z_5eKzQUd3HJSqNJC3SILog5TP3jxz615tpFQnVGDW9sCS4uslKO38&spc=54MbxYJRHhs0j_E1jhg6N2inRIaLU7Y4LVhIBiYGhZHWnhfAc7415-7yzVsK&vprv=1&svpuc=1&mime=video%2Fmp4&ns=XHyUdl4iWNAxSgOIW43TRZEQ&rqh=1&cnr=14&ratebypass=yes&dur=162.028&lmt=1709164398670122&mt=1728023092&fvip=3&fexp=51300760&c=WEB&sefc=1&txp=4538434&n=1RUHp_wu17kYxqCXzw&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRQIgfOH8230cPkH-8VAWocZHGdqfocqu_toPg1tJsuGWNhsCIQDC13M_vibacZbHTHhre97u86wxpRGz8gNiPQTjcG4ZdA%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpcm2cms%2Cpl%2Cinitcwndbps&lsig=ACJ0pHgwRgIhAJwX9d4eUCg_wy9hOChnEInHHP77kNhvSHTLR-XSbPbDAiEA4u52tIIsw595SOI6w5WOB-sIKml0yNXLvQ0qeNCFVSU%3D"
    )
    parsed_url = urlparse(stream["url"])
    query = parse_qs(parsed_url.query)
    query = {k: v[0] for k, v in query.items()}

    if "s" in stream and not ("sig" in query.keys() or "lsig" in query.keys()):
        query["sig"] = cipher.get_signature(stream["s"])

    if "n" in query.keys():
        print("changed n from", query["n"])
        query["n"] = cipher.get_throttling(query["n"])
        print("to", query["n"])

    url = (
        f"{parsed_url.scheme}://{parsed_url.netloc}{parsed_url.path}?{urlencode(query)}"
    )
    stream["url"] = url


def find_stream(streams, prioritise_bitrate=True, include_video=False):
    filtered_streams = filter(lambda s: "audio/mp4" in s["mimeType"], streams)
    if prioritise_bitrate:
        return sorted(filtered_streams, key=lambda s: s["bitrate"], reverse=True)[0]
    else:
        return filtered_streams[0]


if __name__ == "__main__":
    pass
