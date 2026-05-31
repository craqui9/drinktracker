const express = require('express');
const { body } = require('express-validator');
const {
  getMyDrinks,
  addDrinks,
  resetMyDrinks,
  getTotals,
  getLeaderboard,
} = require('../controllers/drink.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All drink routes require authentication
router.use(protect);

router.get('/my', getMyDrinks);

router.post(
  '/add',
  [
    body('cerveza').optional().isInt({ min: 0, max: 99 }).withMessage('Cerveza: 0–99'),
    body('copa').optional().isInt({ min: 0, max: 99 }).withMessage('Copa: 0–99'),
    body('chupito').optional().isInt({ min: 0, max: 99 }).withMessage('Chupito: 0–99'),
  ],
  addDrinks
);

router.post('/reset', resetMyDrinks);

router.get('/totals', getTotals);

router.get('/leaderboard', getLeaderboard);

module.exports = router;
