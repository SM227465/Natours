const express = require("express");
const tourController = require("../controllers/tour");
const authController = require("../controllers/auth");
// const reviewController = require("../controllers/review");
const reviewRouter = require("../routes/review");

const router = express.Router();

// router.param("id", tourController.checkID);

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin);

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

// Top 5 cheap tours route
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getTours);

// Tour stats route
router.route("/tour-stats").get(tourController.getTourStats);

router
  .route("/monthly-plan/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guid", "guide"),
    tourController.getMonthlyPlan
  );

router
  .route("/")
  .get(tourController.getTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTour
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guid"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guid"),
    tourController.deleteTour
  );

router.use("/:tourId/reviews", reviewRouter);

module.exports = router;
