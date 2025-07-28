from flask import Flask, request
from flask_restx import Resource, Api, reqparse
from flask_cors import CORS, cross_origin
import bcrypt
from pymongo import MongoClient
from yt_dlp import YoutubeDL

app = Flask(__name__)
cors = CORS(app)
api = Api(app)

ydl_opts = {"get-url": True, "format": "m4a/bestaudio/best"}
ydl = YoutubeDL(ydl_opts)

client = MongoClient("localhost", 27017)
db = client.freeplay

song_parser = reqparse.RequestParser()
song_parser.add_argument(
    "video_id", type=str, required=True, help="you already know what it is"
)


@api.route("/load_song")
@api.expect(song_parser)
class Song(Resource):
    def get(self):
        args = song_parser.parse_args()

        try:
            dic = ydl.extract_info(args.get("video_id"), download=False)
            audio = [fmt for fmt in dic["formats"] if fmt["ext"] == "webm"][0]["url"]
            return {"success": True, "response": audio}
        except Exception as e:
            return {"success": False, "response": str(e)}


user_parser = reqparse.RequestParser()
user_parser.add_argument(
    "username", type=str, required=True, help="you already know what it is"
)
user_parser.add_argument(
    "password", type=str, required=False, help="you already know what it is"
)


@api.route("/users/")
@api.expect(user_parser)
class Auth(Resource):
    # log user in
    def get(self):
        args = user_parser.parse_args()
        user = args.get("username")
        pw = args.get("password")

        users_collection = db.users
        query = users_collection.find_one({"user": user})
        if query:
            check = bcrypt.checkpw(pw.encode("utf-8"), query.get("pass"))

            if check:
                return {"success": True, "response": f"user {user} has been logged in!"}
            else:
                return {"success": False, "response": "password is incorrect"}
        else:
            return {"success": False, "response": "user not found"}

    # register user
    def post(self):
        args = user_parser.parse_args()

        user = args.get("username")
        pw = args.get("password")

        users_collection = db.users
        query = users_collection.find_one({"user": user})
        if query:
            return {"success": False, "response": "user already exists"}

        pw_hash = bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt(12))
        users_collection.insert_one({"user": user, "pass": pw_hash, "playlists": {}})

        return {"success": True, "response": f"user {user} has been created!"}


@api.route("/users/playlists/<string:playlist_id>")
@api.expect(user_parser)
class Playlists(Resource):
    def get(self, playlist_id):
        args = user_parser.parse_args()
        user = args.get("username")

        users_collection = db.users
        query = users_collection.find_one({"user": user})
        if query:
            playlists = query.get("playlists")
            return {"success": True, "response": playlists.get(playlist_id, [])}
        else:
            return {"success": False, "response": "user does not exist"}

    def post(self, playlist_id):
        args = user_parser.parse_args()
        user = args.get("username")
        data = request.json

        users_collection = db.users
        query = users_collection.find_one({"user": user})
        if query:
            playlists = query.get("playlists")
            playlists[playlist_id] = data[playlist_id]

            users_collection.update_one(
                {"user": user}, {"$set": {"playlists": playlists}}
            )


if __name__ == "__main__":
    app.run(debug=True)
