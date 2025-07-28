from flask import Flask, request
from flask_restx import Resource, Api, reqparse
from flask_cors import CORS, cross_origin
from aiotube import Channel, Playlist, Video

app = Flask(__name__)
cors = CORS(app)
api = Api(app)


@api.route("/playlists")
class Playlists(Resource):
    def get(self):
        args = request.args
        return Channel(args.get("channelId")).playlists()


@api.route("/playlistItems")
class PlaylistItems(Resource):
    def get(self):
        args = request.args
        return Playlist(args.get("playlistId")).metadata


@api.route("/videos")
class Videos(Resource):
    def get(self):
        args = request.args
        return Video(args.get("id")).metadata


if __name__ == "__main__":
    app.run(port=5001)
