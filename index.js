import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoutes from './routes/usersRoute.js'
import authRoutes from './routes/authRoute.js'
import postRoutes from './routes/postRoute.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use("/", (req, res) => {
    res.status(200).send({ message: "Welcome to Social Media Backend" })
})
//1. DB connection
const PORT = process.env.PORT
mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log(error))

//2. Middleware
app.use(express.json());
app.use(helmet())
app.use(morgan("common"))

//3. routes
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/post", postRoutes)

app.listen(PORT, () => console.log("Backend server is running"))