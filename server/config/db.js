const mongoose = require("mongoose")

const connectDB = async()=>{
    try{
        mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected")
    } catch(e) {
        console.log("Error connecting database "+e.message);
        process.exit(1)
    }
}

module.exports = connectDB;