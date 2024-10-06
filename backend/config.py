android_context = {
    "client": {
        "clientName": "ANDROID_TESTSUITE",
        "clientVersion": "1.9",
        "platform": "MOBILE",
        "osName": "Android",
        "osVersion": "14",
        "androidSdkVersion": "34",
    }
}
android_headers = {
    "User-Agent": "com.google.android.youtube/",
    "accept-language": "en-US,en",
    "Content-Type": "application/json",
    "X-Youtube-Client-Name": "30",
    "X-Youtube-Client-Version": "1.9",
}

ios_context = {
    "client": {
        "clientName": "IOS",
        "clientVersion": "19.29.1",
        "deviceMake": "Apple",
        "deviceModel": "iPhone16,2",
        "userAgent": "com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)",
        "osName": "iPhone",
        "osVersion": "17.5.1.21F90",
    }
}

ios_headers = {
    "X-YouTube-Client-Name": ios_context["client"]["clientName"],
    "X-YouTube-Client-Version": ios_context["client"]["clientVersion"],
    "Origin": "https://www.youtube.com",
    "User-Agent": ios_context["client"]["userAgent"],
    "Content-Type": "application/json",
}

web_context = {
    "client": {
        "clientName": "WEB",
        "osName": "Windows",
        "osVersion": "10.0",
        "clientVersion": "2.20240709.01.00",
        "platform": "DESKTOP",
    }
}

web_headers = {
    "User-Agent": "Mozilla/5.0",
    "X-Youtube-Client-Name": "1",
    "X-Youtube-Client-Version": "2.20240709.01.00",
    "Content-Type": "application/json",
}
