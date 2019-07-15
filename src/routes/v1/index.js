'use strict'
// version 1 endpoint is here


export default (app, pool) => {

    // auth Routes
    app.route('/api/v1/auth/signup')
        .get((req,res)=>{
            
        })
        .post((req,res)=>{
            const { email, first_name, last_name, password } = req.body;
            
            res.json({
                status: 'success',
                data: { email, first_name, last_name, password }
            });
        })
    
}