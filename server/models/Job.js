import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['construction', 'agriculture', 'domestic', 'delivery', 'manufacturing', 'other']
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    city: String,
    state: String,
    address: String
  },
  wage: {
    amount: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'fixed'],
      default: 'daily'
    }
  },
  duration: {
    type: String,
    required: true
  },
  workersNeeded: {
    type: Number,
    default: 1
  },
  applicants: [{
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  status: {
    type: String,
    enum: ['open', 'closed', 'in-progress', 'completed'],
    default: 'open'
  },
  requirements: [String],
  startDate: Date,
  endDate: Date
}, {
  timestamps: true
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
