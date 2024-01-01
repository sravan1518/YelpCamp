const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const campground = require('../models/campground');
const expressError = require('../utils/ExpressError');
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware');
const campController = require('../controllers/campgrounds');
const multer=require('multer');
const upload=multer({dest:'uploads/'});


// router.get('/makecampground',catchAsync(async (req,res) =>{
//     const camp = new campground({ title: 'My backyard' , description : 'sample campaign'});
//     await camp.save();
//     res.send(camp);
//   }))
  
 
router.route('/')
.get(catchAsync(campController.index))
.post(isLoggedIn,validateCampground,catchAsync(campController.createCampground));
    
router.get('/new',isLoggedIn,campController.renderNewForm);

router.route('/:id')
.get(catchAsync(campController.showCampground))
.put(isLoggedIn,isAuthor,catchAsync(campController.updateCampground))
.delete(isAuthor,catchAsync(campController.deleteCampground));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campController.renderEditForm));

    module.exports=router;