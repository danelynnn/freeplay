from flask import Flask
from flask_restx import Resource, Api

app = Flask(__name__)
api = Api(app)

@api.route('/')
class Test(Resource):
    def get(self):
        return {'response': 'success'}

if __name__ == '__main__':
    app.run(debug=True)
    