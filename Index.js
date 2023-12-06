const express = require('express')
const dbconnection = require('./Config/Db')
const colors = require('colors')
const cors = require('cors')
const dotenv = require('dotenv')
const router = require('./Router/Authroutes')
const path = require("path");



const app = express()
app.use(express.json())
require('dotenv').config();
app.use(cors())



dbconnection()

app.use("/api/v1/auth", router);

app.use(express.static(path.join(__dirname, "public")))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


PORT = process.env.PORT || 3000


app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`.bgGreen)
})