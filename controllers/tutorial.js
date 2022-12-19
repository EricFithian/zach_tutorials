const express = require('express')
const router = express.Router();
var fs = require('fs');
var path = require('path');
var multer = require('multer');
require('dotenv/config');
var upload = multer({ storage: storage });

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const db = require('../models/index')

router.get('/', async (req, res, next) => {
    try {
        // if(!req.session) res.redirect('/login')
        const tutorials = await db.Tutorial.find({});
        if(req.session.currentUser) {
            context = { 
                tutorials: tutorials,
                user: req.session.currentUser
            } 
        } else {
            context = {
                tutorials: tutorials,
                user: undefined
            }
        }
        // console.log(tutorials);
        console.log(context);
        // console.log(tutorials[0].user._id)
        return res.render('tutorials/index.ejs', context);
    } catch (error) {
        console.log(error);
        req.err = error;
        return next();
    }
});

router.get('/new', (req, res) => {
    
    const context = {
        user: req.session.currentUser.username,
        thisUser: req.session.currentUser
    }
    res.render('tutorials/new.ejs', context)
})

router.post('/', async (req, res, next) => {
    try {
        console.log(req)
        const myTutorial = req.body
        myTutorial.user = req.session.currentUser.id
        const createdTutorial = await db.Tutorial.create(myTutorial);
        console.log(`The created product is ${createdTutorial}`)
        res.redirect('/tutorials');
    } catch (error) {
        console.log(error);
        req.err = error;
        return next();
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const foundTutorial = await db.Tutorial.findById(req.params.id);
        const foundReviews = await db.Review.find({tutorial: foundTutorial})
        console.log(foundReviews)
        console.log(`The found tutorial is ${foundTutorial}`)
        context = {
            tutorial: foundTutorial,
            reviews: foundReviews,
        }
        if(req.session.currentUser) {
            context.user = req.session.currentUser;
        } else {
            context.user = undefined;
        }
        res.render('tutorials/show.ejs', context)
    } catch (error) {
        console.log(error);
        req.err = error;
        return next();
    }
})

router.get('/:id/edit', async (req, res, next) => {
    try {
        const foundTutorial = await db.Tutorial.findById(req.params.id);
        console.log(`The found tutorial is ${foundTutorial}`)
        context = {
            tutorial: foundTutorial
        }
        if(req.session.currentUser) {
            context.user = req.session.currentUser;
        } else {
            context.user = undefined;
        }
        res.render('tutorials/edit.ejs', context)
    } catch (error) {
        console.log(error);
        req.err = error;
        return next();
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const deletedTutorial = await db.Tutorial.findByIdAndDelete(req.params.id)
        console.log(`The found tutorial is ${deletedTutorial}`)
        res.redirect(`/tutorials`)
    } catch (error) {
        console.log(error);
        req.err = error;
        return next();
    }
})

router.put('/:id', async (req, res) => {
    try {
        let updatedTutorial = await db.Tutorial.findByIdAndUpdate(req.params.id, req.body)
        console.log(`The updated tutorial is ${updatedTutorial}`)
        res.redirect(`/tutorials/${req.params.id}`)
    } catch (error) {
        res.status(400).json(error);
    }
})

module.exports = router