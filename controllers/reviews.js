const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//@desc     Get reviews
//@route    GET /api/v1/reviews
//@route    GET /api/v1/bootcamps/:bootcampId/reviews
//@access   Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if(req.params.bootcampId) {
    const reviews = await Review.find({
      bootcamp: req.params.bootcampId,
    });
    return res.status(200).json({
      success: true,
      data: reviews,
      count: reviews.length
    })
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc     Get Single review
//@route    GET /api/v1/reviews/:id
//@access   Public
exports.getSingleReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if(!review) {
    return next(new ErrorResponse(`Review doesn't exist with the id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

//@desc     Create a review
//@route    POST /api/v1/bootcamps/:bootcampId/reviews
//@access   Private
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if(!bootcamp) {
    return next(new ErrorResponse(`Bootcamp doesn't exist with the id ${req.params.bootcampId}`, 404));
  }

  const review =  await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

//@desc     Update a review
//@route    PUT /api/v1/reviews/:id
//@access   Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if(!review) {
    return next(new ErrorResponse(`Review doesn't exist with the id ${req.params.id}`, 404));
  }

  //Make sure review belongs to user or user is an admin
  if(review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Review doesn't belong to you with id ${req.params.id}`, 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: review
  });
});

//@desc     Delete a review
//@route    DELETE /api/v1/reviews/:id
//@access   Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if(!review) {
    return next(new ErrorResponse(`Review doesn't exist with the id ${req.params.id}`, 404));
  }

  //Make sure review belongs to user or user is an admin
  if(review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Review doesn't belong to you with id ${req.params.id}`, 401));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: 'Review has been deleted'
  });
});