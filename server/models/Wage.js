import mongoose from 'mongoose';

const wageSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  location: {
    city: String,
    state: String
  },
  averageWage: {
    type: Number,
    required: true
  },
  minWage: Number,
  maxWage: Number,
  currency: {
    type: String,
    default: 'INR'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Wage = mongoose.model('Wage', wageSchema);

export default Wage;
