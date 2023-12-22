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

// Endpoint to get bar chart data for the selected month
app.get("/barChart/:month", async (req, res) => {
    try {
        const { month } = req.params;

        const priceRanges = [
            { min: 0, max: 100 },
            { min: 101, max: 200 },
            { min: 201, max: 300 },
            { min: 301, max: 400 },
            { min: 401, max: 500 },
            { min: 501, max: 600 },
            { min: 601, max: 700 },
            { min: 701, max: 800 },
            { min: 801, max: 900 },
            { min: 901, max: Number.MAX_VALUE }
        ];

        const barChartData = [];

        for (const range of priceRanges) {
            const count = await CommentModel.countDocuments({
                price: { $gte: range.min, $lte: range.max },
                dateOfSale: { $gte: new Date(`${month}-01`), $lt: new Date(`${month}-31`) }
            });

            barChartData.push({
                range: `${range.min}-${range.max === Number.MAX_VALUE ? 'above' : range.max}`,
                count
            });
        }

        res.json(barChartData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
