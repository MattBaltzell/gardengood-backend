/** Express app for GardenGood */

const express = require("express")
const cors = require("cors")

const morgan = require("morgan")

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))

// app.use(/**route name */)


/** Handle 404 errors -- this matches everything */
app.use(function(req,res,next){
    return next(new Error())
})


/** Generic error handler; anything unhandled goes here. */


module.exports = app;