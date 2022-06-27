import os
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
from mongo_client import mongo_client

# create "gallery" database
gallery = mongo_client.gallery
# create "images_collection" collection in the "gallery" database
images_collection = gallery.images

load_dotenv(dotenv_path="./.env.local")

UNSPLASH_URL = "https://api.unsplash.com/photos/random"
UNSPLASH_KEY = os.environ.get("UNSPLASH_KEY", "")
DEBUG = bool(os.environ.get("DEBUG", True))

if not UNSPLASH_KEY:
    raise EnvironmentError(
        "Please create .env.local file and insert there UNSPLASH_KEY"
    )

app = Flask(__name__)
CORS(app)

app.config["DEBUG"] = DEBUG


@app.route("/new-image")
def new_image():
    # get search word
    word = request.args.get("query")
    headers = {"Accept-Version": "v1", "Authorization": "Client-ID " + UNSPLASH_KEY}
    params = {"query": word}
    # get image from UnSplash
    response = requests.get(url=UNSPLASH_URL, headers=headers, params=params)
    # into json
    data = response.json()
    return data


# allows retrieval of images in the db and posting of new images to the db
@app.route("/images", methods=["GET", "POST"])
def image():
    if request.method == "GET":
        # read images from database
        # no filter -> all images retrieved
        images = images_collection.find({})
        # return the json for all images
        return jsonify([img for img in images])
    if request.method == "POST":
        # save image in the database
        # get the json for the image to be added to the db
        image = request.get_json()
        # set the image id to the UnSplash id
        image["_id"] = image.get("id")
        # add the image json to the db
        result = images_collection.insert_one(image)
        # (?)
        inserted_id = result.inserted_id
        # return the id of the image
        return {"inserted_id": inserted_id}


@app.route("/images/<image_id>", methods=["DELETE"])
def delete_image(image_id):
    if request.method == "DELETE":
        # delete image from the database
        # remove image from the db
        res = images_collection.delete_one({"id": image_id})
    # print(res.deleted_count)
    if not res:
        return {"error": "Image was not deleted. Please try again"}, 500
    if res and not res.deleted_count:
        return{"error": "Image not found"}, 404
    return {"deleted_id": image_id}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
