import express from "express";
import { CredentialsProvider } from "../CredentialsProvider.js";
import jwt from "jsonwebtoken";
import { getEnvVar } from "../getEnvVar.js";
import { verifyAuthToken } from "./authToken.js"


/**
 * Creates a Promise for a JWT token, with a specified username embedded inside.
 *
 * @param username the username to embed in the JWT token
 * @return a Promise for a JWT
 */
function generateAuthToken(username) {
    return new Promise((resolve, reject) => {
        const payload = {
            username
        };
        jwt.sign(
            payload,
            getEnvVar("JWT_SECRET"),
            { expiresIn: "1d" },
            (error, token) => {
                if (error) reject(error);
                else resolve(token);
            }
        );
    });
}

export function registerAuthRoutes(app, credentialsProvider) {
    app.use(express.json())
    console.log("opened")
    app.post("/api/users", async (req, res) => {
        try{
            console.log(req.body)
            const { username, email , password } = req.body;
            if (!username || !email || !password) { throw new Error("400") } // invalid input

            await credentialsProvider.registerUser(username, email, password);
            const token = await generateAuthToken(username)
            return res.json({token});
        } catch (err) {
            if (err.message === "409") {
                return res.status(409).send({
                    error: "Conflict",
                    message: "Username already taken"
                });
            }
            if (err.message === "400") {
                return res.status(400).send({
                    error: "Bad request",
                    message: "Missing username, email, or password"
                });
            }
            console.log(err)
            return res.sendStatus(500);
        }
    });

    app.post("/api/auth/tokens", async (req, res) => {
        try{
            const { username, password } = req.body;
            if (!username || !password) { throw new Error("400") }

            const verifyPassword = await credentialsProvider.verifyPassword(username, password);
            if (!verifyPassword) { throw new Error("401") }

            const token = await generateAuthToken(username)
            return res.json({token});
        } catch (err) {
            if (err.message === "400") {
                return res.status(400).send({
                    error: "Bad request",
                    message: "Missing username or password"
                });
            }
            if (err.message === "401") {
                return res.status(401).send({
                    error: "Unauthorized",
                    message: "Please try a different username or password"
                });
            }
            console.log(err)
            return res.sendStatus(500)
        }
    });

}
