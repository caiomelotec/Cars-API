const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");

// models
const carModel = require("./models/carModel");

mongoose.connect(process.env.CONNECTION_STRING).then(() => {
  console.log("DB connected");
});
app.use(express.json());
// Add Car
app.post("/add-car", (req, res) => {
  const car = req.body;

  carModel.create(car).then((result) => {
    console.log("Car added successfully");
    res.send({message: "Car added successfully"})
  }).catch((err) => {
    console.log("Error creating car");
    res.send({message: "Error by adding a car"})
  })
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});
