import express from 'express'
import dotenv from "dotenv";
import { initApp } from './src/initApp.js';
import cors from "cors"

app.use(cors())
dotenv.config();

const app = express()





initApp(app, express)