import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { login, register, search } from './User.js';
import { authenticate } from './auth.middileware.js';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cookieParser());

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
app.post("/register",register);
app.post("/login",login);
app.get("/search",authenticate ,search);