const express  = require('express')
const dbconnection = require('./Config/Db')
const colors = require('colors')
const cors = require('cors')
const dotenv = require('dotenv')
const router = require('./Router/Authroutes')



const app  = express()
app.use(express.json())
app.use(cors())
require('dotenv').config();

dbconnection()

app.use("/api/v1/auth", router);



PORT = process.env.PORT || 3000


app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`.bgGreen)
})