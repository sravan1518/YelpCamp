const expressError = require('./utils/ExpressError');
const {campgroundSchema,reviewSchema} = require('./schemas.js');
const campground = require('./models/campground');
const review = require('./models/reviews');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','you must be signed in');
        return res.redirect('/login');
      }
      next();
}


module.exports.validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
   if(error){
   const msg=error.details.map(el=>el.message).join(',')
   throw new expressError(msg ,400)
   }
   next();
   }

module.exports.isAuthor = async (req,res,next)=>{
  const {id} = req.params;
 const camp  = await campground.findById(id);
  if(!camp.author.equals(req.user._id)){
    req.flash('error','You do not have permission to do that!');
    return res.redirect(`/campgrounds/${camp._id}`);
  }
  next();
}


module.exports.isReviewAuthor = async (req,res,next)=>{
    const {id,reviewId} = req.params;
   const reviewVar  = await review.findById(reviewId);
    if(!reviewVar.author.equals(req.user._id)){
      req.flash('error','You do not have permission to do that!');
      return res.redirect(`/campgrounds/${id}`);
    }
    next();
  }

module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
   if(error){
   const msg=error.details.map(el=>el.message).join(',')
   throw new expressError(msg ,400)
   }
   next();
   }
