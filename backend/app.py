from flask import Flask, request
from flask_restx import Resource, Api, reqparse
from flask_cors import CORS, cross_origin

from pymongo import MongoClient
from bson.objectid import ObjectId

from yt_dlp import YoutubeDL

import bcrypt
import jwt
from datetime import datetime, timedelta

app = Flask(__name__)
cors = CORS(app)
api = Api(app)

ydl_opts = {"get-url": True, "format": "m4a/bestaudio/best"}
ydl = YoutubeDL(ydl_opts)

client = MongoClient(
    "mongodb+srv://danelynnn:D4G7rdZTmvAdxE6z@freeplay.x99zxts.mongodb.net/?retryWrites=true&w=majority&appName=freeplay",
    27017,
)
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


auth_parser = reqparse.RequestParser()
auth_parser.add_argument(
    "username", type=str, required=True, help="you already know what it is"
)
auth_parser.add_argument(
    "email", type=str, required=False, help="you already know what it is"
)
auth_parser.add_argument(
    "password", type=str, required=False, help="you already know what it is"
)


@api.route("/auth")
@api.expect(auth_parser)
class Auth(Resource):
    # log user in
    def get(self):
        args = auth_parser.parse_args()
        user = args.get("username")
        pw = args.get("password")

        users_collection = db.users
        query = users_collection.find_one({"user": user})
        if query:
            check = bcrypt.checkpw(pw.encode("utf-8"), query.get("pass"))

            if check:
                iat = datetime.now()
                exp = iat + timedelta(weeks=3)

                header = {"alg": "HS256", "typ": "JWT"}
                payload = {
                    "sub": str(query.get("_id")),
                    "user": user,
                    "iat": iat.timestamp(),
                    "exp": exp.timestamp(),
                }
                secret = "uwu"
                access = jwt.encode(
                    payload=payload, key=secret, algorithm="HS256", headers=header
                )
                return {"success": True, "response": access, "expiry": exp.timestamp()}
            else:
                return {"success": False, "response": "password is incorrect"}
        else:
            return {"success": False, "response": "user not found"}

    # register user
    def post(self):
        args = auth_parser.parse_args()

        user = args.get("username")
        email = args.get("email")
        pw = args.get("password")

        users_collection = db.users
        query = users_collection.find_one({"$or": [{"user": user}, {"email": email}]})
        if query:
            return {"success": False, "response": "user already exists"}

        pw_hash = bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt(12))
        users_collection.insert_one(
            {
                "user": user,
                "pass": pw_hash,
                "email": email,
                "pfp": "https://i.ytimg.com/img/no_thumbnail.jpg",
                "connections": {"yt_url": None},
            }
        )

        return {"success": True, "response": f"user {user} has been created!"}


user_parser = reqparse.RequestParser()
user_parser.add_argument(
    "jwt_auth", type=str, required=True, help="you already know what it is"
)
user_parser.add_argument(
    "user_data", type=dict, required=False, help="you already know what it is"
)


@api.route("/user")
@api.expect(user_parser)
class User(Resource):
    def get(self):
        args = user_parser.parse_args()
        jwt_auth = args.get("jwt_auth")
        secret = "uwu"
        payload = jwt.decode(jwt_auth, key=secret, algorithms="HS256")

        users_collection = db.users
        query = users_collection.find_one({"user": payload["user"]})

        if query:
            return {
                "success": True,
                "response": {k: query[k] for k in query if k not in ["_id", "pass"]},
            }
        else:
            return {"success": False, "response": "user not found somehow wtf"}

    def post(self):
        args = user_parser.parse_args()
        jwt_auth = args.get("jwt_auth")
        secret = "uwu"
        payload = jwt.decode(jwt_auth, key=secret, algorithms="HS256")

        user_data = request.json
        users_collection = db.users
        query = users_collection.update_one(
            {"user": payload["user"]}, {"$set": user_data}
        )

        if query:
            return {
                "success": True,
                "response": f"{query.modified_count} results modified",
            }
        else:
            return {"success": False, "response": "user not found somehow wtf"}


playthroughsList_parser = reqparse.RequestParser()
playthroughsList_parser.add_argument(
    "jwt_auth", type=str, required=True, help="you already know what it is"
)
playthroughsList_parser.add_argument(
    "playlistId", type=str, required=False, help="filter by specific playlist id"
)
playthroughsList_parser.add_argument(
    "playthrough_data", type=dict, required=False, help="playthrough details"
)


@api.route("/playthroughs")
@api.expect(playthroughsList_parser)
class PlaythroughsList(Resource):
    def get(self):
        args = playthroughsList_parser.parse_args()
        jwt_auth = args.get("jwt_auth")
        secret = "uwu"
        payload = jwt.decode(jwt_auth, key=secret, algorithms="HS256")

        playthroughs_collection = db.playthroughs
        if args.get("playlistId"):
            query = list(
                playthroughs_collection.find(
                    {
                        "$and": [
                            {"user": payload["user"]},
                            {"playlistId": args.get("playlistId")},
                        ]
                    }
                )
            )
        else:
            query = list(playthroughs_collection.find({"user": payload["user"]}))

        for obj in query:
            obj["_id"] = str(obj["_id"])

        print(query)

        if query:
            return {"success": True, "response": query}
        else:
            return {"success": False, "response": "user does not exist"}

    def post(self):
        args = playthroughsList_parser.parse_args()
        jwt_auth = args.get("jwt_auth")
        secret = "uwu"
        payload = jwt.decode(jwt_auth, key=secret, algorithms="HS256")
        playthrough_data = request.json

        playthroughs_collection = db.playthroughs
        playthrough = playthroughs_collection.insert_one(
            {"user": payload["user"], **playthrough_data}
        )

        return {"success": True, "response": str(playthrough.inserted_id)}


playthroughs_parser = reqparse.RequestParser()
playthroughs_parser.add_argument(
    "playthrough_data", type=dict, required=False, help="playthrough details"
)


@api.route("/playthroughs/<string:playthrough_id>")
@api.expect(playthroughs_parser)
class Playthroughs(Resource):
    def get(self, playthrough_id):
        args = playthroughs_parser.parse_args()

        playthroughs_collection = db.playthroughs
        query = playthroughs_collection.find_one({"_id": ObjectId(playthrough_id)})
        if query:
            return {
                "success": True,
                "response": {k: query[k] for k in query if k != "_id"},
            }
        else:
            return {"success": False, "response": "playthrough does not exist"}

    def post(self, playthrough_id):
        args = playthroughs_parser.parse_args()
        playthrough_data = request.json

        playthroughs_collection = db.playthroughs
        update = playthroughs_collection.update_one(
            {"_id": ObjectId(playthrough_id)}, {"$set": playthrough_data}
        )

        return {"success": True, "response": update.modified_count}


if __name__ == "__main__":
    app.run(debug=True)
