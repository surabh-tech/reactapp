const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const app = express();
const PORT = 3001;

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

// Endpoint to get pie chart data for the selected month
app.get("/pieChart/:month", async (req, res) => {
    try {
        const { month } = req.params;

        const uniqueCategories = await CommentModel.distinct('category', {
            dateOfSale: { $gte: new Date(`${month}-01`), $lt: new Date(`${month}-31`) }
        });

        const pieChartData = [];

        for (const category of uniqueCategories) {
            const count = await CommentModel.countDocuments({
                category,
                dateOfSale: { $gte: new Date(`${month}-01`), $lt: new Date(`${month}-31`) }
            });

            pieChartData.push({
                category,
                count
            });
        }

        res.json(pieChartData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
