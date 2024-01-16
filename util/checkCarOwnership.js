const carModel = require("../models/carModel");

async function checkCarOwnership(req, res, next) {
  const userId = req.session.login.userId;
  const carId = req.params.carId;
  const car = await carModel.findOne({ _id: carId });


  if (!car) {
    return res.status(404).send({ message: "Car not found" });
  }

  if (userId !== car.userId.toString()) {
    return res.status(403).send({ message: "Permission denied" });
  }
  // Attach car information to the request for later use
  req.car = car;
  next();
}

module.exports = checkCarOwnership;
