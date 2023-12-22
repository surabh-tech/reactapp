// search.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the cors middleware
const app = express();

app.use(cors()); // Enable CORS for all routes

mongoose.connect('mongodb://localhost:27017/comment');

const commentSchema = mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date
});

const CommentModel = mongoose.model("comments", commentSchema);

app.get("/getTransactions", async (req, res) => {
    try {
        const { page = 1, perPage = 10, search } = req.query;

        let query = {};

        if (search) {
            query = {
                $or: [
                    { title: { $regex: new RegExp(search, 'i') } },
                    { description: { $regex: new RegExp(search, 'i') } },
                    { price: { $eq: parseFloat(search) } }
                ]
            };
        }

        const transactions = await CommentModel.find(query)
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});
