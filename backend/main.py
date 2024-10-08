from flask import Flask
from flask_restx import Resource, Api, reqparse
from flask_cors import CORS, cross_origin
from download import get_streams, find_stream

app = Flask(__name__)
cors = CORS(app)
api = Api(app)

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
            streams = get_streams(args.get("video_id"))
            value = find_stream(streams)
            return {"success": True, "response": value}
        except Exception as e:
            return {"success": False, "response": str(e)}


if __name__ == "__main__":
    app.run(debug=True)
