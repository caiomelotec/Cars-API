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

  carModel
    .create(car)
    .then((result) => {
      console.log("Car added successfully");
      res.send({ message: "Car added successfully" });
    })
    .catch((err) => {
      console.log("Error creating car");
      res.status(500).send({ message: "Error by adding a car" });
    });
});

// search car by model, make or year
app.get("/car/:value", (req, res) => {
  const input = req.params.value;

  const isNumber = !isNaN(Number(input)); 

  let query;
  if (isNumber) {
    query = { year: input };
  } else {
    query = { model: { $regex: input, $options: "i" } };
  }

  carModel
    .find(query)
    .then((car) => {

      if (car.length === 0) {
        // No car found with the provided model, try searching by make
        query = { make: {$regex: input, $options: "i"} };

        carModel.find(query).then((car2) => {
          if (car2.length === 0) {
            console.log("Car not found");
            return res.status(404).send({ message: "Car not found" });
          }
          return res.send({ message: "Car was found", data: car2 });
        });

      } else {
         // Car found with the provided model or year
        res.send({ message: "Car was found", data: car });
      }

    })
    .catch((err) => {
      console.log("Error by searching car", err);
      res.status(500).send({ message: "Error by searching car" });
    });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});
