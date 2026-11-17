const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(10).max(128)
}).strict();

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128)
}).strict();

const reportSchema = z.object({
  title: z.string().trim().min(4).max(120),
  description: z.string().trim().min(10).max(5000),
  category: z.enum(['corruption', 'infrastructure', 'environment', 'public-safety', 'other']),
  location: z.string().trim().min(2).max(160)
}).strict();

const reportUpdateSchema = reportSchema.partial().refine(value => Object.keys(value).length > 0, {
  message: 'At least one field must be supplied.'
});

const statusSchema = z.object({
  status: z.enum(['submitted', 'under-investigation', 'resolved', 'rejected'])
}).strict();

module.exports = { registerSchema, loginSchema, reportSchema, reportUpdateSchema, statusSchema };
