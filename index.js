const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config();

const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const hallRouter = require("./routes/hall");
const bookingRouter = require("./routes/booking");



const port = process.env.PORT || 4000; // Use 3000 as a default if PORT is not defined
const app = express();
const DB = process.env.MONGODB_URL
app.use(cors());

// Middleware for request logging
app.use((req, res, next) => {
   const startTime = new Date();
 
   // Capture the response status code
   res.on("finish", () => {
     const endTime = new Date();
     const elapsedTime = endTime - startTime;
     console.log(`[${endTime.toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${elapsedTime} ms)`);
   });
 
   next();
 });


 
app.use(express.json());
app.use(authRouter);
app.use(adminRouter)
app.use(hallRouter);
app.use(bookingRouter);


 mongoose.connect(DB  ).then(()=> {
    console.log("connect db successfully")
 }).catch((e)=>{
    console.log(e);
 });


app.listen(port , ()=> {
    console.log(`connected at prt ${port}`);
 
})

