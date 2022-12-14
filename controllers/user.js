const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const { User } = require('../models')

router.get('/register', (req, res, next) => {
    try {
        let context;
        if(req.session.currentUser) {
            context = {
                user: req.session.currentUser.username
            }
        } else {
            context = {
                user: undefined
            }
        }
        console.log("Trying to sign up")
        res.render('users/signup.ejs', context)
    } catch(err) {
        console.log(err);
        req.err = err;
        return next();
    }
});

router.get('/login', (req, res, next) => {
    try {
        console.log(req.session);
        let context;
        if(req.session.currentUser) {
            context = {
                user: req.session.currentUser.username
            }
        } else {
            context = {
                user: undefined
            }
        }
        res.render('users/login.ejs', context)
    } catch(err) {
        console.log(err);
        req.err = err;
        return next();
    }
});

router.post("/login", async function (req, res) {
    try {
        const foundUser = await User.findOne({ email: req.body.email });

        if (!foundUser) return res.json({
            response: "The password or the username is invalid"
        });
        
        const match = await bcrypt.compare(req.body.password, foundUser.password);
    
        // if not match send error
        if (!match) return res.json({
            response: "The password or the username is invalid"
        });
    
        // if match create the session and redirect to home\
        // here we have created the key card
        req.session.currentUser = {
            id: foundUser._id,
            username: foundUser.username,
        };

        console.log(req.session);
    
        console.log(`thanks for logging in, ${foundUser.username}`);
        return res.redirect('/')
    } catch (err) {
        console.log(err);
        req.err = err;
        return next();
    }
});

router.post('/register', async (req, res, next) => {
    try {
        // console.log(req.body)
        const foundUser = await User.exists({email: req.body.email})
        if (foundUser) {
            return res.redirect('login')
        }
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;

        const newUser = await User.create(req.body);
        console.log(newUser);
        return res.redirect('/')
    } catch (err) {
        console.log(err);
        req.err = err;
        return next();
    }
})

router.get("/signout", async (req, res, next) => {
    try {
        await req.session.destroy();
        console.log(req.session);
        return res.redirect("/");
    } catch (error) {
        console.log(err);
        req.err = err;
        return next();
    }
});

router.get('/users', async(req, res, next) => {
    try {
        res.json(await User.find({}))
    } catch (err) {
        console.log(err);
        req.error = err;
        return next();
    }
})

module.exports = router