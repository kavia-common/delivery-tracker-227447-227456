/** @typedef {import('../types/delivery').Delivery} Delivery */

const now = new Date();
const hoursFromNow = (h) => new Date(now.getTime() + h * 60 * 60 * 1000).toISOString();
const hoursAgo = (h) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();

/** @type {Delivery[]} */
export const MOCK_DELIVERIES = [
  {
    id: "ORD-10492",
    recipient: "Alex Morgan",
    address: "221B Market St, San Francisco, CA",
    courier: "OceanExpress",
    status: "in-transit",
    eta: hoursFromNow(6),
    mine: true,
    timeline: [
      { id: "e1", timestamp: hoursAgo(18), status: "in-transit", message: "Label created" },
      { id: "e2", timestamp: hoursAgo(12), status: "in-transit", message: "Picked up by courier", location: "San Jose, CA" },
      { id: "e3", timestamp: hoursAgo(4), status: "in-transit", message: "Arrived at sorting facility", location: "San Francisco, CA" },
    ],
  },
  {
    id: "ORD-10501",
    recipient: "Priya Patel",
    address: "14 Ocean Ave, Los Angeles, CA",
    courier: "SwiftShip",
    status: "delivered",
    eta: hoursAgo(3),
    mine: false,
    timeline: [
      { id: "e1", timestamp: hoursAgo(30), status: "in-transit", message: "Shipment accepted", location: "Irvine, CA" },
      { id: "e2", timestamp: hoursAgo(10), status: "in-transit", message: "Out for delivery", location: "Los Angeles, CA" },
      { id: "e3", timestamp: hoursAgo(3), status: "delivered", message: "Delivered to front desk" },
    ],
  },
  {
    id: "ORD-10577",
    recipient: "Chen Wei",
    address: "77 Bayview Rd, Seattle, WA",
    courier: "OceanExpress",
    status: "delayed",
    eta: hoursFromNow(18),
    mine: true,
    timeline: [
      { id: "e1", timestamp: hoursAgo(40), status: "in-transit", message: "Departed origin facility", location: "Portland, OR" },
      { id: "e2", timestamp: hoursAgo(16), status: "delayed", message: "Weather delay reported", location: "Tacoma, WA" },
    ],
  },
  {
    id: "ORD-10602",
    recipient: "Sam Rivera",
    address: "500 Pine St, New York, NY",
    courier: "NorthStar",
    status: "in-transit",
    eta: hoursFromNow(28),
    mine: false,
    timeline: [
      { id: "e1", timestamp: hoursAgo(22), status: "in-transit", message: "Arrived at hub", location: "Newark, NJ" },
      { id: "e2", timestamp: hoursAgo(2), status: "in-transit", message: "In transit to destination", location: "New York, NY" },
    ],
  },
];

export const MOCK_COURIERS = Array.from(new Set(MOCK_DELIVERIES.map((d) => d.courier))).sort();
