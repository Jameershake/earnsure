import Wage from '../models/Wage.js';

// @desc    Get wage benchmarks
// @route   GET /api/wages
// @access  Public
export const getWages = async (req, res) => {
  try {
    const { category, city, state } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');

    const wages = await Wage.find(filter);

    res.json(wages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update wage benchmark
// @route   POST /api/wages
// @access  Private/Admin
export const createWage = async (req, res) => {
  try {
    const { category, location, averageWage, minWage, maxWage } = req.body;

    const wage = await Wage.create({
      category,
      location,
      averageWage,
      minWage,
      maxWage
    });

    res.status(201).json(wage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
