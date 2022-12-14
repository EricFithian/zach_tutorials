const express = require('express')
const router = express.Router();

const db = require('../models/index')

router.post('/', async (req, res, next) => {
    try {
        const createdReview = await db.Review.create(req.body);
        console.log(`The created review is ${createdReview.tutorial}`)
        res.redirect(`/tutorials/${createdReview.tutorial}`);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const deletedReview = await db.Review.findByIdAndDelete(req.params.id)
        console.log(`The found tutorial is ${deletedReview}`)
        res.redirect(`/tutorials`)
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})

module.exports = router;