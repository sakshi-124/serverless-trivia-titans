const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));

//Routes
app.get("/", (req, res) => {
    console.log("Hello World!");
    res.status(200).send("Hello World!");
});

// Configure AWS SDK
AWS.config.update({
    accessKeyId: 'ASIARDLXMU6OGMSTREOL',
    secretAccessKey: '+ufFrqXZCmctICTIrXXVgsgdW7+M2YogbzUteh6I',
    sessionToken: 'FwoGZXIvYXdzEH0aDFzbQtap7Pv4jXdfDCK9AYCSopo/lTUdx1WJ7A6hSip3HghOR3dCcpA/ZhhzK6YvR9wUeLq81WkUGNV2XO8icyEYpvlsAydveakwrUQQll69FrzGNl108++zKmpeWgTKoPmQDbIkzf94KV21Ls8J4rXr7xGswG5hoATnN2uL3Ngp1V//nM5Pn0UloM3Qab/PFEVeJGgHlxDJyEwGRlTzHbOXuM/Kkqcjyr0VswRCRtlS0GYf+/WPNKQgaXlY+n/i/XkHYI3cM2WV/QKNxijE6b2lBjItG7xmujUEZOpGHrk+n+JVKFwycto2ORV4SnUd45LNezSa0EfLio9moZs8bqfr',
    region: 'us-east-1'
});

const s3 = new AWS.S3();
const bucketName = 'trivia-titans';

// Set up multer storage and upload middleware
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle image upload
app.post('/uploadImage', upload.single('image'), (req, res) => {
    const file = req.file;
    const key = file.originalname;

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: file.buffer
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error('Error uploading image:', err);
            res.status(500).json({ error: 'Failed to upload image' });
        } else {
            console.log('Image uploaded successfully:', data.Location);
            res.json({ imageUrl: data.Location });
        }
    });
});

app.listen(8001, () => {
    console.log('Running on http://localhost:8001');
});

exports.app = app;