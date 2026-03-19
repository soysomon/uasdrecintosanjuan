const mongoose = require('mongoose');

/**
 * Security Event (Audit Log) Model
 *
 * Immutable audit trail of security-relevant events.
 * TTL index auto-purges records older than 90 days.
 *
 * Severity levels:
 *   LOW      → routine (login success, refresh)
 *   MEDIUM   → attention needed (user created, bad password)
 *   HIGH     → investigate (account locked, user deleted, IP blocked)
 *   CRITICAL → immediate response required (token reuse = session hijack)
 */
const securityEventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'LOGIN_SUCCESS',
      'LOGIN_FAILED',
      'LOGOUT',
      'TOKEN_REFRESH',
      'TOKEN_REUSE_DETECTED',
      'USER_CREATED',
      'USER_UPDATED',
      'USER_DELETED',
      'PASSWORD_CHANGED',
      'IP_BLOCKED',
      'ACCOUNT_LOCKED',
      'UNAUTHORIZED_ACCESS',
      'INVALID_CSRF',
    ],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  username: {
    type: String,
    default: null,
  },
  ip: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    default: null,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Auto-delete after 90 days
securityEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7_776_000 });
securityEventSchema.index({ userId: 1, timestamp: -1 });
securityEventSchema.index({ type: 1, severity: 1, timestamp: -1 });

module.exports = mongoose.model('SecurityEvent', securityEventSchema);
