const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors =require('cors');
const dotenv = require('dotenv');
const authRoute = require('./Routes/Auth')
const userRoute = require('./Routes/User')
const movieRoute=require('./Routes/Movie')
const listRoute=require('./Routes/List')

dotenv.config();

// always remember that .then alone and .catch outside the .then
mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true

    }).then(() => {
        console.log('connected')

    }).catch((err) => {
        console.log(err);
    });
 
 app.use(express.json());
 app.use(cors());

 app.use("/api/auth", authRoute);
 app.use("/api/users", userRoute);
 app.use("/api/movies", movieRoute);
 app.use('/api/list',listRoute);






app.listen(3001, () => {
    console.log('Backend is running')
})