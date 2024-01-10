const express = require("express");
const app = express()
const port = 8080
const mongoose = require("mongoose");

mongoose.connect(process.env.CONNECTION_STRING).then(() => {
  console.log("DB connected");
});

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.listen(port, () =>{
    console.log("Listening on port " + port)
});
