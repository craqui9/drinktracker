const { validationResult } = require('express-validator');
const DrinkCounter = require('../models/drink.model');
const User = require('../models/user.model');

const VALID_DRINKS = ['cerveza', 'copa', 'chupito'];

// GET /api/drinks/my  — returns the current user's counters
const getMyDrinks = async (req, res) => {
  try {
    let counter = await DrinkCounter.findOne({ user: req.user._id });

    // Safety: create if missing (shouldn't happen after register, but just in case)
    if (!counter) {
      counter = await DrinkCounter.create({ user: req.user._id });
    }

    res.json({
      cerveza: counter.cerveza,
      copa: counter.copa,
      chupito: counter.chupito,
      updatedAt: counter.updatedAt,
    });
  } catch (error) {
    console.error('getMyDrinks error:', error);
    res.status(500).json({ message: 'Error al obtener los contadores.' });
  }
};

// POST /api/drinks/add  — adds amounts to the user's counters
// Body: { cerveza?: number, copa?: number, chupito?: number }
const addDrinks = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { cerveza = 0, copa = 0, chupito = 0 } = req.body;

  if (cerveza === 0 && copa === 0 && chupito === 0) {
    return res.status(400).json({ message: 'Debes indicar al menos una bebida.' });
  }

  try {
    const counter = await DrinkCounter.findOneAndUpdate(
      { user: req.user._id },
      {
        $inc: {
          cerveza: Math.max(0, Math.floor(cerveza)),
          copa: Math.max(0, Math.floor(copa)),
          chupito: Math.max(0, Math.floor(chupito)),
        },
      },
      { new: true, upsert: true }
    );

    res.json({
      message: '¡Salud! 🍺',
      cerveza: counter.cerveza,
      copa: counter.copa,
      chupito: counter.chupito,
    });
  } catch (error) {
    console.error('addDrinks error:', error);
    res.status(500).json({ message: 'Error al actualizar los contadores.' });
  }
};

// POST /api/drinks/reset  — resets the current user's counters to zero
const resetMyDrinks = async (req, res) => {
  try {
    await DrinkCounter.findOneAndUpdate(
      { user: req.user._id },
      { cerveza: 0, copa: 0, chupito: 0 },
      { upsert: true }
    );

    res.json({ message: 'Contadores reseteados.', cerveza: 0, copa: 0, chupito: 0 });
  } catch (error) {
    console.error('resetMyDrinks error:', error);
    res.status(500).json({ message: 'Error al resetear los contadores.' });
  }
};

// GET /api/drinks/totals  — returns the sum of all users' counters
const getTotals = async (req, res) => {
  try {
    const [result] = await DrinkCounter.aggregate([
      {
        $group: {
          _id: null,
          totalCerveza: { $sum: '$cerveza' },
          totalCopa: { $sum: '$copa' },
          totalChupito: { $sum: '$chupito' },
          totalUsuarios: { $sum: 1 },
        },
      },
    ]);

    res.json({
      cerveza: result?.totalCerveza ?? 0,
      copa: result?.totalCopa ?? 0,
      chupito: result?.totalChupito ?? 0,
      totalUsuarios: result?.totalUsuarios ?? 0,
    });
  } catch (error) {
    console.error('getTotals error:', error);
    res.status(500).json({ message: 'Error al obtener los totales.' });
  }
};

// GET /api/drinks/leaderboard  — top users per drink type (bonus endpoint)
const getLeaderboard = async (req, res) => {
  try {
    const counters = await DrinkCounter.find({})
      .populate('user', 'username')
      .sort({ cerveza: -1 })
      .limit(20)
      .lean();

    const leaderboard = counters.map((c) => ({
      username: c.user?.username ?? 'Usuario eliminado',
      cerveza: c.cerveza,
      copa: c.copa,
      chupito: c.chupito,
      total: c.cerveza + c.copa + c.chupito,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('getLeaderboard error:', error);
    res.status(500).json({ message: 'Error al obtener el ranking.' });
  }
};

module.exports = { getMyDrinks, addDrinks, resetMyDrinks, getTotals, getLeaderboard };
