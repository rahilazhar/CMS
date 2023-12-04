const express = require('express')
const dbconnection = require('./Config/Db')
const colors = require('colors')
const cors = require('cors')
const dotenv = require('dotenv')
const router = require('./Router/Authroutes')



const app = express()
app.use(express.json())
require('dotenv').config();
app.use(cors())


dbconnection()

app.use("/api/v1/auth", router);

// app.get('/', (req, res) => {
//     return res.send({ Message: "Hellow World" })
// })



PORT = process.env.PORT || 3000


app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`.bgGreen)
})