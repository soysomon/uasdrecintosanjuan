const mongoose = require('mongoose');

/**
 * Refresh Token Model
 *
 * Implements token family tracking for reuse detection:
 * - Each login creates a new "family" (random hex ID)
 * - Each /auth/refresh marks the previous token as `used` and issues a new one
 *   in the same family
 * - If a `used` token is presented → entire family is deleted (session hijack detected)
 *
 * TTL index auto-deletes expired documents without cron jobs.
 */
const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  // Groups tokens from the same login session; used for reuse detection
  family: {
    type: String,
    required: true,
    index: true,
  },
  // Once rotated, marked as used. Presenting a used token is a theft signal.
  used: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// MongoDB auto-deletes documents when expiresAt is reached
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
