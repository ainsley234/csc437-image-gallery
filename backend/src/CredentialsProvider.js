import { MongoClient } from "mongodb";
import { getEnvVar } from "./getEnvVar.js";
import { ObjectId } from "mongodb"
import { verifyAuthToken } from "./routes/authToken.js"
import bcrypt from "bcrypt";

export class CredentialsProvider{
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        const credCollectionName = getEnvVar("CREDS_COLLECTION_NAME");
        this.collection = this.mongoClient.db().collection(credCollectionName);
    }

    async verifyPassword(username, password) {
        const account = await this.collection.findOne({ username: username });
        return bcrypt.compare(password, account.password)
    }

    async registerUser(username, email, password) {
        const existing = await this.collection.findOne({ username: username });
        if (existing) { throw new Error("401") } // username already exists

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        this.collection.insertOne({
           username: username,
           password: hashedPassword
        })
        return true
    }
}