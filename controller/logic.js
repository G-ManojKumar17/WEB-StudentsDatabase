const path = require('path')
const ejs = require('ejs')
const express = require('express')
const app = express()
const schema = require('../model/schema')
const { default: mongoose } = require('mongoose')
const jwt = require("jsonwebtoken");
const session = require("express-session");
const route = require('../routes/route')
const bcrypt = require('bcryptjs')

app.set('view engine', 'ejs')


//(get) load login page (Page)
const loadLoginPage = (req, res) => {
    res.render('login');
}

//(get) load signup page (Page)
const loadSignupPage = (req, res) => {
    res.render('signup');
}

//(post) add user ID (Data)
const signup = async (req, res) => {

    const data = req.body;
    const check = await schema.userID.findOne({ username: data.username })
    // console.log("username:",check.username)
    if (check) {
        res.send(`<script>alert("username already exist"); window.location.href = "/signup";</script>`);
    }
    else {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        console.log("hashed pass:", hashedPassword)
        console.log('UserID Received Data: ', data);
        try {
            const userId = new schema.userID({
                _id: new mongoose.Types.ObjectId(),
                username: data.username,
                password: hashedPassword
            })
            userId.save()
            // const token = jwt.sign({ userId: userId._id }, 'your token created')
            // console.log(token)
            res.redirect("/")
        }
        catch (err) {
            res.send(err)
        }
    }

}

//(post) login (Data)
// const login = async (req, res) => {
//     const data = req.body;
//     console.log("hi")
//     console.log('UserID Received Data: ', data);

//     const check = await schema.userID.find({ username: data.username })
//     console.log(check)
//     if (check[0].username == data.username) {
//         console.log("Username matched")
//         if (bcrypt.compare(check[0].password, data.password)) {
//             // Generate JWT Token (Optional)
//             // const token = jwt.sign({ userId: user._id }, "your-secret-key", { expiresIn: "1h" });

//             // Store session
//             req.session.check = { id: check[0]._id, username: check[0].username };
//             res.redirect('/dashboard');
//         }
//         else {
//             res.send(`<script>alert("Invalid Credentials"); window.location.href = "/";</script>`);
//         }
//     }
//     else {
//         res.send(`<script>alert("Invalid Credential"); window.location.href = "/";</script>`);
//     }

// }

const login = async (req, res) => {
    try {
        const data = req.body;
        console.log("hi");
        // console.log("UserID Received Data: ", data);

        const check = await schema.userID.find({ username: data.username });

        // Check if user exists
        if (check.length === 0) {
            return res.send(`<script>alert("Invalid Credentials"); window.location.href = "/";</script>`);
        }

        console.log("Username matched");

        // Compare passwords (fix: use await)
        const isMatch = await bcrypt.compare(data.password, check[0].password);

        if (isMatch) {
            console.log("Password matched");

            // Store session (fix: use check[0] instead of check)
            req.session.ss = { id: check[0]._id, username: check[0].username };
            // console.log(req.session.ss)
            res.redirect('/dashboard');
        } else {
            res.send(`<script>alert("Invalid Credentials"); window.location.href = "/";</script>`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

//(get) students Data (Data + Page)
const dashboard = (req, res) => {
    schema.students.find()
        .then((data) => {
            // console.log('Student Fetched Data:', data);  // Log data to verify structure
            res.render('dashboard.ejs', { data });
        })
        .catch((err) => {
            console.error('Error while fetching data:', err);  // Log the error for better visibility
            res.status(500).send('Internal Server Error');
        });
};

//(get) addDataForm page (Page)
const addDataForm = (req, res) => {
    res.render('addDataForm.ejs');
}

//(post) add Data  (Mongo)
const addData = (req, res) => {
    const data = req.body;
    console.log('Student Received data:', data);
    const student = new schema.students({
        _id: new mongoose.Types.ObjectId(),
        name: data.name,
        std: data.std,
        rank: data.rank
    })
    if (isNaN(student.std) || isNaN(student.rank)) {
        res.send(`<script>alert("Enter valid number"); window.location.href = "/dataform";</script>`);
    }
    else {
        student.save()
            .then(() => {
                res.redirect("/dashboard")
            }).catch((err) => {
                res.send(err)
            })
    }
}

//(get) load update page (page)
const loadUpdateForm = (req, res) => {
    data = req.params.id
    console.log("data", data)
    res.render('updateData', { data });
}


//(post) updatedata (page)
const updateData = async (req, res) => {
    console.log("started")
    data = req.body;
    console.log("boda data", data)        //body data
    const check = await schema.students.findById(req.params.id)
    console.log("reterived data", check)        //database data

    const updateData = await schema.students.updateOne(
        { _id: req.params.id }, {
        $set: {
            name: data.name || check.name,
            std: data.std || check.std,
            rank: data.rank || check.rank
        }
    }
    )
    console.log("updated Data:", updateData)      //updated data
    res.send(`<script>alert("Data Updated"); window.location.href = "/dashboard";</script>`);

}

//(post) delete data (mongo)
const deleteData = async (req, res) => {

    const check = await schema.students.deleteOne({ _id: req.params.id })
    res.send(`<script>alert("Data Deleted"); window.location.href = "/dashboard";</script>`);
}

//logout
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send("Error logging out");
        }
        res.send(`<script>alert("Logout Successful!"); window.location.href = "/login";</script>`);
    });
};

// get userID (Data + Page)
const getUserId = (req, res) => {
    schema.userID.find()
        .then((data) => {
            // console.log("UserID Fetched Data:", data)
            res.render('userID.ejs', { data })
        })
        .catch((err) => {
            res.send(err)
        })
}

//search
const searchData = async (req, res) => {
    const x = req.query;
    const data = await schema.students.find({ name: { $regex: new RegExp(x.name, "i") }});
    res.render('Dashboard', {data})

}


module.exports = { loadLoginPage, loadSignupPage, signup, login, dashboard, addDataForm, addData, loadUpdateForm, updateData, deleteData, getUserId, logout, searchData }