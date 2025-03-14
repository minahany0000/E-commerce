import express from 'express'
import dotenv from "dotenv";
import { initApp } from './src/initApp.js';

dotenv.config();

const app = express()




initApp(app, express)