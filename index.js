import express from 'express';
import dotenv from "dotenv";
import { login, register, search } from './User.js';
import { authenticate } from './auth.middileware.js';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
dotenv.config();
//port
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cookieParser());

//database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database connected.');
    } catch (err) {
        console.log('Database connection failed.', err);
    }
}

connectDB();

app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})

app.get("/",(req,res)=>{
    res.send("hello world")
})
//register route
app.post("/register",register);

//login route
app.post("/login",login);

//search route
app.get("/search",authenticate ,search);