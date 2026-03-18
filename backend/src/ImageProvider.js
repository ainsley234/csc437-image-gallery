import { MongoClient } from "mongodb";
import { getEnvVar } from "./getEnvVar.js";
import { ObjectId } from "mongodb"

export class ImageProvider {
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        const imgCollectionName = getEnvVar("IMAGES_COLLECTION_NAME");
        this.collection_img = this.mongoClient.db().collection(imgCollectionName);
        this.userCollectionName = getEnvVar("USERS_COLLECTION_NAME");
        this.collection_users = this.mongoClient.db().collection(this.userCollectionName);
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

        pipeline.push({ $unset: ['author_mapping'] });

        return images.aggregate(pipeline).toArray();
    }

    async getOneImage(imageId) {
        const imageArray = await this.getAllImages();
        if (!ObjectId.isValid(imageId)) { return "404"; }

        const givenID = new ObjectId(imageId);
        const image = imageArray.find((img) => img._id.equals(givenID));

        return image || "404";
    }

    async updateImageName(imageId, newName) {

        //check for errors
        if (!ObjectId.isValid(imageId)) { return 0 }
        if (typeof newName !== "string" || newName.trim().length === 0) { throw new Error("400") }
        if (newName.length > getEnvVar("MAX_NAME_LENGTH")) {  throw new Error("413") }

        const result = await this.collection_img.updateOne(
            { _id: new ObjectId(imageId) },
            { $set: { name: newName } }
        );

        return result.matchedCount
    }

    async getUserByUsername(username) {
        const allUsers = await this.collection_users.find({}).toArray();
        const user = await this.collection_users.findOne({ username: username });
        return user;
    }

    async createImage({ filename, name,  authorId }) {
        const document = {
            src: `/uploads/${filename}`,
            name: name,
            authorId: authorId,
            createdAt: new Date()
        }

        const result = await this.collection_img.insertOne(document);
        return result.insertedId;
    }
}

