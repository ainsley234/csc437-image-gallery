import express from "express";
import { getEnvVar } from "./getEnvVar.js";
import { SHARED_TEST } from "./shared/example.js";
import { VALID_ROUTES } from "./shared/ValidRoutes.js";
import { ImageProvider } from "./ImageProvider.js"
import { connectMongo } from "./connectMongo.js"
import { registerImageRoutes } from "./routes/imageRoutes.js"
import { registerAuthRoutes } from "./routes/authRoutes.js"
import { CredentialsProvider } from "./CredentialsProvider.js"


const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const STATIC_DIR = getEnvVar("STATIC_DIR") || "public";
const app = express();
app.use(express.static(STATIC_DIR));
app.use("/uploads", express.static(getEnvVar("IMAGE_UPLOAD_DIR")))

//get images
const mongo = connectMongo()
await mongo.connect()
const imageProvider = new ImageProvider(mongo);
const credentialsProvider = new CredentialsProvider(mongo);

registerImageRoutes(app, imageProvider)
registerAuthRoutes(app, credentialsProvider)

app.get(Object.values(VALID_ROUTES), (req, res) => {
    res.sendFile("index.html", { root: STATIC_DIR });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}.  CTRL+C to stop.`);
});


