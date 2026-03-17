import express from "express";
import { ImageProvider } from "../ImageProvider.js";
import {verifyAuthToken } from "./authToken.js"
import jwt from "jsonwebtoken";
import {imageMiddlewareFactory, handleImageFileErrors} from "../imageUploadMiddleware.js";

//artificially delay the response by 1 sec
function waitDuration(numMs) {
    return new Promise(resolve => setTimeout(resolve, numMs));
}

export function registerImageRoutes(app, imageProvider) {
    app.use("/api/images{/*all}", verifyAuthToken);
    app.use("/api/image{/*all}", verifyAuthToken);

    app.get("/api/images", async (req, res) => {
        const imgs = await imageProvider.getAllImages();
        await waitDuration(1000)
        res.json(imgs);
    });

    app.get("/api/image/:id", async (req, res) => {
        const ID = req.params["id"]
        const img = await imageProvider.getOneImage(ID);
        const MAX_NAME_LENGTH = 100

        // ID not in database, return HTTP 404 Not Found
        if (img=="404") {
            res.status(404).send({
                error: "Not Found",
                message: "Image does not exist"
            });
        } else {
            res.json(img);
        }
    });

    app.put("/api/image/:id/name", async (req, res) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) { return res.sendStatus(401); }
        const token = authHeader.split(" ")[1];
        let username;

        try {
            const decoded = jwt.verify(token, "JWT_SECRET");
            username = decoded.username;
        } catch (err) {
            return res.sendStatus(403);
        }

        const ID = req.params["id"];
        const newName = req.query["name"];
        const MAX_NAME_LENGTH = 100;
        const img = await imageProvider.getOneImage(ID);

        try {

            if (req.username != img.authorId) { throw new Error("403") } //authorID is the username
            const matchedCount = await imageProvider.updateImageName(ID, newName);

            if (matchedCount == 0) {
                return res.status(404).send({
                    error: "Not Found",
                    message: "Image does not exist"
                });
            }
            return res.sendStatus(204); // success, no content

        } catch (err) {

            if (err.message == "400") {
                return res.status(400).send({
                    error: "Bad Request",
                    message: "Invalid or missing image name"
                });
            }

            if (err.message == "403") {
                return res.status(403).send({
                    error: "Unauthorized",
                    message: "You do not own this image."
                });
            }

            if (err.message == "413") {
                return res.status(413).send({
                    error: "Content Too Large",
                    message: `Image name exceeds ${MAX_NAME_LENGTH} characters`
                });
            }
            console.log(err)
            return res.sendStatus(500);
        }
    });

    app.post("/api/images",
        imageMiddlewareFactory.single("image"),
        handleImageFileErrors,
        async (req, res) => {
            // Final handler function after the above two middleware functions finish running
            if (!req.file || ! req.body.name) {return res.status(400).send("Missing image or file name.");}
            const imageId = await imageProvider.createImage({
                filename: req.file.filename,
                name: req.body.name,
                authorId: payload.username,
            });
            res.status(201).send({ id: imageId });
        }
    );

}
