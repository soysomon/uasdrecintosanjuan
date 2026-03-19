const SecurityEvent = require('../models/SecurityEvent');

/**
 * Async audit logger.
 * Failures are silently caught — logging must never break the request pipeline.
 *
 * @param {Object} params
 * @param {string}  params.type      - SecurityEvent type enum value
 * @param {*}       params.userId    - MongoDB ObjectId or null
 * @param {string}  params.username  - Username string or null
 * @param {string}  params.ip        - Client IP
 * @param {string}  params.userAgent - User-Agent header or null
 * @param {Object}  params.details   - Extra context (reason, attempt count, etc.)
 * @param {string}  params.severity  - LOW | MEDIUM | HIGH | CRITICAL
 */
const auditLogger = {
  async log({ type, userId = null, username = null, ip, userAgent = null, details = {}, severity }) {
    try {
      await SecurityEvent.create({ type, userId, username, ip, userAgent, details, severity });
    } catch (err) {
      console.error('[AUDIT] Failed to persist security event:', err.message);
    }
  },
};

module.exports = auditLogger;
