const Review=require('../models/reviews');
const campground=require('../models/campground');

module.exports.addReview=async(req,res,next)=>{
    const camp = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
   review.author=req.user._id;
    camp.reviews.push(review);
     await review.save();
     await camp.save();
     req.flash('success','Added new Review!');
     res.redirect(`/campgrounds/${camp._id}`);
 }

 module.exports.deleteReview=async(req,res)=>{
    const {id,reviewId}= req.params;
    await campground.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success','Deleted Review!');
    res.redirect(`/campgrounds/${id}`);
   }