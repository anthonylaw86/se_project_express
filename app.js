const express = require("express");
const mongoose = require("mongoose")
const indexRouter = require("./routes/index")

const app = express()
const {PORT = 3001} = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(() => {
  console.log("Connected to DB")
})
.catch(console.error)

const routes = require("./routes")
app.use(express.json())
app.use("/", indexRouter )
app.use((req, res, next) => {
  req.user = {
    _id: '662a81956df96f263d72b2bd'
  }
  next()
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})