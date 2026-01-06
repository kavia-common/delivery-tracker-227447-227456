/**
 * Delivery domain "types" via JSDoc (CRA JS project; no TS).
 */

/**
 * @typedef {"in-transit"|"delivered"|"delayed"} DeliveryStatus
 */

/**
 * @typedef {Object} DeliveryEvent
 * @property {string} id
 * @property {string} timestamp ISO timestamp
 * @property {DeliveryStatus} status
 * @property {string} message Human readable status message
 * @property {string=} location Optional scan/location
 */

/**
 * @typedef {Object} Delivery
 * @property {string} id Order/Tracking ID
 * @property {string} recipient
 * @property {string} address
 * @property {string} courier
 * @property {DeliveryStatus} status
 * @property {string} eta ISO timestamp (estimated delivery)
 * @property {boolean} mine Whether this belongs to the current user (for "My deliveries" filter)
 * @property {DeliveryEvent[]} timeline
 */
export {};
