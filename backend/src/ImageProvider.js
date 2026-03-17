import { MongoClient } from "mongodb";
import { getEnvVar } from "./getEnvVar.js";
import { ObjectId } from "mongodb"

export class ImageProvider {
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        const imgCollectionName = getEnvVar("IMAGES_COLLECTION_NAME");
        this.collection_img = this.mongoClient.db().collection(imgCollectionName);
        this.userCollectionName = getEnvVar("USERS_COLLECTION_NAME");
    }

    async getAllImages() {
        const images = this.collection_img;
        const pipeline = [];

        pipeline.push(
          {
            $lookup: {
              from: this.userCollectionName,
              localField: 'authorId',
              foreignField: 'username',
              as: 'author_mapping',
            },
          }
        );

        pipeline.push(
          {
            $set: {
              author_mapping: {
                $first: '$author_mapping'
                }
              }
          },
          {
            $set: {
              author: {
                _id:'$author_mapping._id',
                username: '$author_mapping.username',
                email:'$author_mapping.email'
              }
            }
          }
        );

        pipeline.push({ $unset: ['authorId', 'author_mapping'] });

        return images.aggregate(pipeline).toArray();
    }

    async getOneImage(imageId) {
        const imageArray = await this.getAllImages()
        // ID not in database, return HTTP 404 Not Found
        if (!ObjectId.isValid(imageId)) { return "404" }
        const givenID =  new ObjectId(imageId)
        return imageArray.filter((img) => img._id.equals(givenID))
    }

    async updateImageName(imageId, newName) {
        const MAX_NAME_LENGTH = 100;

        //check for errors
        if (!ObjectId.isValid(imageId)) { return 0 }
        if (typeof newName !== "string" || newName.trim().length === 0) { throw new Error("400") }
        if (newName.length > MAX_NAME_LENGTH) {  throw new Error("413") }

        const result = await this.collection_img.updateOne(
            { _id: new ObjectId(imageId) },
            { $set: { name: newName } }
        );

        return result.matchedCount
    }

    async createImage(file) {
        const document = {
            src = `/uploads/${req.file.filename}`,
            name = req.body.name,
            authorId = 0, ///GET THIS FROM token
            createdAt: new Date()
        }
        const result = await this.collection_img.insertOne(document);
        return result.insertedId;

    }
}

