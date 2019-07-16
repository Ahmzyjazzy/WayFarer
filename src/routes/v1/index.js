'use strict'
// version 1 endpoint is here

import User from './controllers/User';

export default (app) => {

    // auth Routes
    app.route('/api/v1/auth/signup')
        .post(User.create)
    
}