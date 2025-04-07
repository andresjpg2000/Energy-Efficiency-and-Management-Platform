const express = require("express")
const app = express()
const port = 3000

// Restaurant API -- exemplo

// Route
app.get("/", (req, res) => {
  res.send("Hello, Express!")
})

// middleware
app.use("/table", (req, res, next) => {
  if (req.query.dressedProperly == "true") {
    console.log("client is dressed properly!")
    next()
  } else {
    res.status(403).send("You are not dressed properly!")
  }
})

let checkClientNumber = (req, res, next) => {
  if (req.params.number < 0) {
    let err = new Error(`Number of persons cannot be negative`)
    err.statusCode = 400
    next(err)
  } else {
    next()
  }
}

app.get("/table/:number", checkClientNumber, (req, res) => {
  res.send(`Table reserved for you to ${req.params.number} person!`)
})

// error middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message || `Something broke!`)
})

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
