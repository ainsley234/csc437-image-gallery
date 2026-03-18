import { MongoClient } from "mongodb";
import { getEnvVar } from "./getEnvVar.js";
import { ObjectId } from "mongodb"
import { verifyAuthToken } from "./routes/authToken.js"
import bcrypt from "bcrypt";

export class CredentialsProvider{
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        const credsCollectionName = getEnvVar("CREDS_COLLECTION_NAME");
        const usersCollectionName = getEnvVar("USERS_COLLECTION_NAME");
        this.credsCollection = this.mongoClient.db().collection(credsCollectionName);
        this.usersCollection = this.mongoClient.db().collection(usersCollectionName);
    }

    async verifyPassword(username, password) {
        const account = await this.credsCollection.findOne({ username: username });
        if (!account) {return false}
        return bcrypt.compare(password, account.password)
    }

    async registerUser(username, email, password) {
        const existingCred = await this.credsCollection.findOne({ username: username });
        if (existingCred) { throw new Error("409") } // username already exists in creds
        const existingUser = await this.usersCollection.findOne({ username: username });
        if (existingUser) { throw new Error("409") } // username already exists in users

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        await this.credsCollection.insertOne({
           username: username,
           password: hashedPassword
        })

        await this.usersCollection.insertOne({
           username: username,
           email: email
        })

        return true
    }
}