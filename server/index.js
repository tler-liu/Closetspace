const express = require("express");
require("dotenv").config();
const cloudinary = require("cloudinary");
const app = express();
app.use(express.json());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/", (req, res) => {
    res.send("Hello, World!"); // Send a basic response
    console.log("hello world!");
});

app.post("/deleteItem", async (req, res) => {
    const { public_id } = req.body;
    console.log("public_id", public_id);

    if (!public_id) {
        return res.status(400).send({ error: "Public ID is required" });
    }

    try {
        const result = cloudinary.v2.api
            .delete_resources([public_id], {
                type: "upload",
                resource_type: "image",
            })
            .then(console.log);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({
            error: "Failed to delete resource",
            details: error,
        });
    }
});

app.listen(5001, () => {
    console.log("server started on port 5001");
});
