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

app.post("/recommendItems", async (req, res) => {
    const { documents } = req.body;
    const wardrobeJson = JSON.stringify(documents);
    
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['recommender.py']);

    let stdout = '';
    let stderr = '';

    // Send data to the Python process's stdin
    pythonProcess.stdin.write(wardrobeJson);
    pythonProcess.stdin.end();

    // Capture stdout
    pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
    });

    // Capture stderr
    pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
    });

    // Handle process exit
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python process exited with code ${code}`);
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Parse the JSON output
        try {
            const recommendations = JSON.parse(stdout);
            // Send the recommendations back to the client
            res.status(200).json({ recommendations });
        } catch (parseError) {
            console.error("Failed to parse JSON:", parseError);
            res.status(500).json({ error: 'Failed to parse recommendations' });
        }
    });
});

app.listen(5001, () => {
    console.log("server started on port 5001");
});
