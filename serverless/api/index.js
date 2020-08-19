const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()
app.use(bodyParser.json())
app.use(cors())
const meals = require("./routes/meals")
const orders = require("./routes/orders")
const auth = require("./routes/auth")

mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true , useUnifiedTopology: true , useFindAndModify: false})

// SEGUN LA RUTA QUE INGRESE EL USUARIO ES DONDE LO DERIVAMOS 
app.use("/api/auth", auth)
app.use("/api/meals", meals)
app.use("/api/orders", orders)

module.exports = app