'use strict'
// version 1 endpoint is here

import User from './controllers/User';
import Trip from './controllers/Trip';
import Booking from './controllers/Booking';

export default (app) => {

    // auth Routes
    app.route('/api/v1/auth/signup')
        .post(User.create)

    app.route('/api/v1/auth/signin')
        .post(User.signin)

    // Trip route
    app.route('/api/v1/trips', checkToken)
        .post(Trip.create)
        .get(Trip.getAll)

    app.route('/api/v1/trips/:tripId', checkToken)
        .patch(Trip.cancel)

    // Booking route
    app.route('/api/v1/bookings', checkToken)
        .post(Booking.create)
        .get(Booking.getAll)
    
    app.route('/api/v1/bookings/:bookingId', checkToken)
        .delete(Booking.delete)


    
    // check token 
    //Check to make sure header is not undefined, if so, return Forbidden (403)
    const checkToken = (req, res, next) => {
        const header = req.headers['authorization'];

        if(typeof header !== 'undefined') {
            const bearer = header.split(' ');
            const token = bearer[1];
            req.token = token;
            next();
        } else {
            //If header is undefined return Forbidden (403)
            res.sendStatus(403)
        }
    }
    
}