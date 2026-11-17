const express = require('express');
const mongoose = require('mongoose');
const Report = require('../models/Report');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { reportSchema, reportUpdateSchema, statusSchema } = require('../validation/schemas');

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const reports = await Report.find({ owner: req.user.id }).sort({ createdAt: -1 });
    return res.json({ data: reports });
  } catch (error) { return next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const data = reportSchema.parse(req.body);
    const report = await Report.create({ ...data, owner: req.user.id });
    return res.status(201).json({ data: report });
  } catch (error) { return next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: { message: 'Report not found.' } });
    const report = await Report.findById(req.params.id);
    if (!report || (req.user.role !== 'admin' && String(report.owner) !== req.user.id)) {
      return res.status(404).json({ error: { message: 'Report not found.' } });
    }
    return res.json({ data: report });
  } catch (error) { return next(error); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const data = reportUpdateSchema.parse(req.body);
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: { message: 'Report not found.' } });
    const report = await Report.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!report) return res.status(404).json({ error: { message: 'Report not found.' } });
    return res.json({ data: report });
  } catch (error) { return next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: { message: 'Report not found.' } });
    const report = await Report.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!report) return res.status(404).json({ error: { message: 'Report not found.' } });
    return res.status(204).send();
  } catch (error) { return next(error); }
});

router.get('/admin/all', requireAdmin, async (req, res, next) => {
  try {
    const reports = await Report.find().populate('owner', 'name email').sort({ createdAt: -1 });
    return res.json({ data: reports });
  } catch (error) { return next(error); }
});

router.patch('/admin/:id/status', requireAdmin, async (req, res, next) => {
  try {
    const { status } = statusSchema.parse(req.body);
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: { message: 'Report not found.' } });
    const report = await Report.findByIdAndUpdate(req.params.id, {
      $set: { status, statusUpdatedBy: req.user.id, statusUpdatedAt: new Date() }
    }, { new: true, runValidators: true });
    if (!report) return res.status(404).json({ error: { message: 'Report not found.' } });
    return res.json({ data: report });
  } catch (error) { return next(error); }
});

module.exports = router;
