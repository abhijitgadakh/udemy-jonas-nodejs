const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router.param('id', (req, res, next, id) => {
  tourController.checkId(id);
  next();
});

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
