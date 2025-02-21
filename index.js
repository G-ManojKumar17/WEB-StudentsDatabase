const db = require('./db/mongo')
const express = require('express')
const route = require('./routes/route')
const schema = require('./model/schema')
const jwt = require("jsonwebtoken");
const session = require("express-session");
const app = express()

// Serve static files from public directory
app.use(express.static('public'))

//session
app.use(session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: false } // Set `true` if using HTTPS
    cookie: { maxAge: 250000 }
}));

const ejs = require('ejs')

const port = 3200

app.use(route)
app.set('view engine', 'ejs')

app.listen(port, () => {
    console.log(`${port} is listening...`)
})