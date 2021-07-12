const express = require('express');
const bookingRouter = express.Router();
const bookClass = require('./controllers/book_class');
const getBookingDetails = require('./controllers/get_booking_details');
const initBookingSession = require('./controllers/init_booking_session');
const getBookingDetailsFromSession = require('./controllers/get_booking_details_from_session');
const wait = require('../../middleware/async');

bookingRouter.post('/book', wait(bookClass));
bookingRouter.post('/init-session', initBookingSession);
bookingRouter.post('/:bookingId', wait(getBookingDetails));
bookingRouter.get('/details-from-session', getBookingDetailsFromSession);

module.exports = bookingRouter;