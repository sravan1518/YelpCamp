
const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/ExpressError');

const campground=require('../models/campground');
const Review=require('../models/reviews');
const {isLoggedIn,validateCampground,isAuthor,isReviewAuthor,validateReview} = require('../middleware');
const reviewController = require('../controllers/reviews');

router.post('/',isLoggedIn,validateReview,catchAsync(reviewController.addReview));

 router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviewController.deleteReview))

 module.exports=router;