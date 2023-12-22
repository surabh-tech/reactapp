const express = require("express");
const mongoose = require("mongoose");
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
    dateOfSale: String // Change the data type to String
});

const CommentModel = mongoose.model("comments", commentSchema);

app.get("/statistics/:month", async (req, res) => {
    try {
        const { month } = req.params;

        const totalSaleAmount = await CommentModel.aggregate([
            {
                $match: {
                    sold: true,
                    dateOfSale: {
                        $gte: new Date(`${month}-01T00:00:00.000Z`),
                        $lt: new Date(`${month}-31T23:59:59.999Z`)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$price" }
                }
            }
        ]);

        const totalSoldItems = await CommentModel.countDocuments({
            sold: true,
            dateOfSale: {
                $gte: new Date(`${month}-01T00:00:00.000Z`),
                $lt: new Date(`${month}-31T23:59:59.999Z`)
            }
        });

        const totalNotSoldItems = await CommentModel.countDocuments({
            sold: false,
            dateOfSale: {
                $gte: new Date(`${month}-01T00:00:00.000Z`),
                $lt: new Date(`${month}-31T23:59:59.999Z`)
            }
        });

        res.json({
            totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].total : 0,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
