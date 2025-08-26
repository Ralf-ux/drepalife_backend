const express = require('express');
const mongoose = require("mongoose");


const connect = mongoose.connect("mongodb://localhost:27017/drepa"); 
   if (!connect) {
    console.log("Connection to MongoDB failed");
};
const app = express();
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});