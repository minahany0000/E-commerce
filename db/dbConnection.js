import mongoose from "mongoose";


const dbConnection = async () => {
    await mongoose.connect(process.env.DATABASE_URL_ONLINE).then(() => {
        console.log("Database connected")
    }).catch((err) => {
        console.log("failed to connect ", err)
    })
}
export default dbConnection