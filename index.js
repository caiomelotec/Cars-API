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

// search two cars to compare
app.get("/cars/:car1/:car2", async (req, res) => {
  const input1 = req.params.car1;
  const input2 = req.params.car2;


  let query1 = !isNaN(Number(input1)) ? {year: input1} : {make: {$regex: input1, $options: "i"}};
  let query2 = !isNaN(Number(input2)) ? {year: input2} : {make: {$regex: input2, $options: "i"}};
  
  try {
    let car1 = await carModel.find(query1);
    const car2 = await carModel.find(query2);
    // If both sets of cars are not found, attempt to fetch them by model
    if(car1.length === 0 && car2.length === 0) {

      query1 = {model: {$regex: input1, $options:"i"}};
      query2 = {model: {$regex: input2, $options:"i"}};

      const car3 = await carModel.find(query1);
      const car4 = await carModel.find(query2);
     // If cars fetched by model are not found, return a response
      if(car3.length === 0 && car4.length === 0) {
      return res.send({message: "All cars were not found."});
      }
       // Return all cars fetched by model
      res.send({message: "All cars were found.", car1: car3, car2: car4});
    }else if(car1.length === 0) {
       // If the first set of cars is not found, try to fetch by model
      query1 = {model: {$regex: input1, $options:"i"}};
      const car3 = await carModel.find(query1);

      if(car3.length === 0) {
     // If the first car is still not found, return a response
      return res.send({message: "First car not found", data: car2});
      };

     return res.send({message: "All cars are found", data: {car1: car3, car2: car2}})
            
    } else if(car2.length === 0) {
       // If the second set of cars is not found, try to fetch by model
      query2 = {model: {$regex: input2, $options:"i"}};
      const car4 = await carModel.find(query2);

       // If the second car is still not found, return a response
      if(car4.length === 0) {
        return res.send({message: "Second car not found", data: car1});
      }

       // Return the first set of cars by year or make and the second set by model
     return  res.send({message: "All cars were found", car1:car1, car2:car4});
    }

    // Both sets of cars are found, return a response
    const response = {car1: car1, car2: car2};
    return res.send({message: "All cars are found", data: response})
  }catch(err){
    console.log("Error by searching cars", err);
    res.status(500).send({ message: "Error by searching cars" });
  }
})

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});
