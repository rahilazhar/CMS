const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')


require('dotenv').config();


const dbconnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Database is Connected'.bgBlue)
    } catch (error) {
        console.log(`Error in Database connection ${error}`.bgRed)
    }
}


module.exports = dbconnection