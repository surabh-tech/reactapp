const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose.connect('mongodb://localhost:27017/comment');

const userschema = mongoose.Schema({
    name: String,
    age: Number
});

const Usermodel = mongoose.model("comments", userschema);

app.get("/getuser", async (req, res) => {
    try {
        const users = await Usermodel.find({});
        res.json(users);
    } catch (err) {  
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});