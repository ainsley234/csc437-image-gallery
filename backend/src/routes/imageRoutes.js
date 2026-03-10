import express from "express";
import { ImageProvider } from "../ImageProvider.js";

//artificially delay the response by 1 sec
function waitDuration(numMs) {
    return new Promise(resolve => setTimeout(resolve, numMs));
}

export function registerImageRoutes(app, imageProvider) {
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
        const ID = req.params["id"];
        const newName = req.query["name"];
        const MAX_NAME_LENGTH = 100;

        try {
            const matchedCount = await imageProvider.updateImageName(ID, newName);

            if (matchedCount == 0) {
                return res.status(404).send({
                    error: "Not Found",
                    message: "Image does not exist"
                });
            }
            return res.sendStatus(204); // success, no content

        } catch (err) {

            if (err.message === "400") {
                return res.status(400).send({
                    error: "Bad Request",
                    message: "Invalid or missing image name"
                });
            }

            if (err.message === "413") {
                return res.status(413).send({
                    error: "Content Too Large",
                    message: `Image name exceeds ${MAX_NAME_LENGTH} characters`
                });
            }

            return res.sendStatus(500);
        }
    });
}
