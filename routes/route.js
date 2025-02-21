const logic = require('../controller/logic')
const express = require('express')
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: true });


const app = express()


const isAuthenticated = (req, res, next) => {
    if (req.session.ss) {
        next(); // User is logged in, proceed
    } else {
        res.redirect("/login");
    }
};



app.get('/',logic.loadLoginPage) // load login page
app.get('/login',logic.loadLoginPage)  // load login page
app.get('/signup',logic.loadSignupPage) // load signup page
app.get('/dashboard',isAuthenticated,logic.dashboard)   // dashboard
app.get('/dataform',isAuthenticated, logic.addDataForm)  //Load data form page
app.get('/getID',isAuthenticated, logic.getUserId)   //to get login id
app.get('/updateData/:id',isAuthenticated, logic.loadUpdateForm) //Load update form page
app.get('/search',jsonParser,urlencodedParser,logic.searchData) 
// app.get('/searchDashboard',logic.searchDashboard)
app.get('/logout',logic.logout)


app.post('/login',jsonParser,urlencodedParser,logic.login) // login
app.post('/adddata', jsonParser,urlencodedParser, logic.addData) //addData
app.post('/signup',jsonParser,urlencodedParser, logic.signup) // signup
app.post('/updateData/:id',jsonParser,urlencodedParser, logic.updateData) //updateData

app.post('/delete/:id', logic.deleteData)
module.exports = app
