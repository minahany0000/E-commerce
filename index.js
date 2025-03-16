import express from 'express'
import dotenv from "dotenv";
import { initApp } from './src/initApp.js';
import cors from "cors"
try {
    dotenv.config();

    const app = express()

    app.use(cors())
    initApp(app, express)
}
catch (error) {
    console.log(error)
}