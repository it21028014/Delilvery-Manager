// Imports packages
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

// Initialize express app
const app = express();

// Configurations
dotenv.config();

const PORT = 5000;

// Connect DB
mongoose.connect(
  process.env.MONGO_CON_STRING,
  {  }, //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
  (err) => {
      if (err) throw err;
      console.log("Connected to the mongodb");
  }
);

// Middlewares
app.use(express.json());
app.use(cors());

// Import routes
const DeliveryPartner = require("./Routes/DeliveryPartner")

// Config routes
app.use("/api/deliveryPartner", DeliveryPartner);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `✅ Server is up and running port ${PORT}`
  );
});

