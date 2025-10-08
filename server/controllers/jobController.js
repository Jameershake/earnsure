import Job from '../models/Job.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const { category, location, minWage, status } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (location) filter['location.city'] = new RegExp(location, 'i');
    if (minWage) filter['wage.amount'] = { $gte: Number(minWage) };

    const jobs = await Job.find(filter)
      .populate('employer', 'name email phone rating')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name email phone rating')
      .populate('applicants.worker', 'name email phone skills rating');

    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private/Employer
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      wage,
      duration,
      workersNeeded,
      requirements,
      startDate
    } = req.body;

    const job = await Job.create({
      title,
      description,
      category,
      employer: req.user._id,
      location,
      wage,
      duration,
      workersNeeded,
      requirements,
      startDate
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private/Worker
export const applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const alreadyApplied = job.applicants.find(
      (applicant) => applicant.worker.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    job.applicants.push({
      worker: req.user._id,
      status: 'pending'
    });

    await job.save();

    res.json({ message: 'Applied successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/jobs/:id/applicants/:applicantId
// @access  Private/Employer
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applicant = job.applicants.id(req.params.applicantId);

    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    applicant.status = status;
    await job.save();

    res.json({ message: 'Application status updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
