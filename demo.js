const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const app = express();

mongoose.connect('mongodb://localhost:27017/comment');

const commentSchema = mongoose.Schema({
    id: {
        type: Number,
        unique: true, // Ensure uniqueness of the ID
        index: true, // Add an index for faster lookup
        required: true // Make the ID a required field
    },
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date
}, { _id: false });

const CommentModel = mongoose.model("comments", commentSchema);

// API endpoint to initialize the database with all data from the third-party API
app.get("/initializeDatabase", async (req, res) => {
    try {
        // Fetch all data from the third-party API
        const allDataResponse = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");

        // Extract relevant data from the response
        const allData = allDataResponse.data;
        console.log(allData);
        // Clear existing data in the "comments" collection
        await CommentModel.deleteMany({});

        // Insert all data into the "comments" collection
        await CommentModel.insertMany(allData);

        res.json({ message: 'Database initialized with all data from the third-party API.' });
    } catch (err) {
        console.error(err);

        if (err.response) {
            // If there's a response from the third-party API, include its status and data
            res.status(err.response.status).json({ error: 'Error from the third-party API', details: err.response.data });
        } else {
            // If it's an internal error, provide a generic error message
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    }
});

// Endpoint to retrieve all comments
app.get("/getcomments", async (req, res) => {
    try {
        const comments = await CommentModel.find({});
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});
