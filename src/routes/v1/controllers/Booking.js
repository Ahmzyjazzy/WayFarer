
import 'dotenv/config';
import moment from 'moment';
import Utility from '../Utility';
import db from '../db';

const Booking = {
    /**
     * Create A Booking
     * @param {object} req 
     * @param {object} res
     * @returns {object} booking object 
     */
    async create(req, res) {
        const { user_id, trip_id, is_admin } = req.body;
        
        // check to see if request contain token
        if (!req.token) {
            return res.status(403).send({
                status: 'error',
                error: 'Authentication failed'
            })
        }

        //verify token
        if(!Utility.verifyToken(req.token)){
            return res.status(403).send({
                status: 'error',
                error: 'Authentication failed'
            })
        }

        // first check if there is more seat capacity before accepting booking
        try{
            //get total booking on the current trip
            const res = await db.query(`SELECT COUNT(*) AS total_booked FROM Booking WHERE trip_id = $1`, [trip_id]); 
            const { total_booked } = res.rows[0]; 
            //get the capacity of bus assigned to trip
            const res2 = await db.query(`SELECT capacity FROM Bus B WHERE B.id = (SELECT bus_id FROM Booking T WHERE T.id = $1)`, [trip_id]); 
            const { capacity } = res2.rows[0]; 

            if(capacity == total_booked){
                //no more seat available
                return res.status(200).send({
                    status: 'success',
                    data: {
                        message: 'No more seat available'
                    }
                });
            }

        } catch(error) {
            console.log(error);
            return res.status(400).send({ 
                status: 'error',
                error: 'An error occurred, please try again!',
            });
        }
        
        const createQuery = `INSERT INTO Booking (trip_id, user_id, created_on)
        VALUES ($1, $2, $3, $4, $5, $6);`;
        const values = [
            trip_id,
            user_id,
            moment(new Date())
        ];

        try {
            const result = await db.query(createQuery, values);     
                 
            const { id, trip_id, user_id } = result.rows[0]; //booking response variables 

            //fetch user info -- first_name, last_name, email
            const result2 = await db.query(`SELECT email, first_name, last_name FROM Users WHERE id = $1`, [user_id]); 
            const { email, first_name, last_name } = result2.rows[0];

            //trip info -- bus_id, trip_date,
            const result3 = await db.query(`SELECT bus_id, trip_date FROM Trip WHERE id = $1`, [trip_id]); 
            const { bus_id, trip_date } = result3.rows[0]; 

            //get --seat number-- from count of all bookings
            const result4 = await db.query(`SELECT COUNT(*) AS seat_number FROM Booking WHERE trip_id = $1`, [trip_id]); 
            const { seat_number } = result4.rows[0]; 

            return res.status(201).send({ 
                status: 'success',
                data: { 
                    booking_id: id,
                    user_id,
                    trip_id,
                    bus_id,
                    trip_date,
                    seat_number,
                    first_name,
                    last_name                    
                }
             });
        } catch(error) {
            console.log(error);
            return res.status(400).send({ 
                status: 'error',
                error: 'An error occurred, please try again!',
            });
        }
    },
    /**
     * Get all Booking
     * @param {object} req 
     * @param {object} res
     * @returns {Array} booking array 
     */
    async getAll(req,res){        
        const { user_id, is_admin } = req.body;

        // check to see if request contain token
        if (!req.token) {
            return res.status(403).send({
                status: 'error',
                error: 'Authentication failed'
            })
        }

        //verify token
        if(!Utility.verifyToken(req.token)){
            return res.status(403).send({
                status: 'error',
                error: 'Authentication failed'
            })
        }

        if(is_admin){
            const text = `SELECT id AS booking_id, user_id, trip_id, 
            (SELECT email FROM User U WHERE U.id = $1) email,
            (SELECT first_name FROM User U WHERE U.id = $1) first_name,
            (SELECT last_name FROM User U WHERE U.id = $1) last_name,
            FROM Booking BK`;
            try {
                const result = await db.query(text);        
                return res.status(200).send({ 
                    status: 'success',
                    data: result.rows
                });
            } catch(error) {
                console.log(error);
                return res.status(400).send({
                    status: 'error',
                    error
                })
            }
        }else{
            //only select active 
            const text2 = `SELECT id AS booking_id, user_id, trip_id, 
            (SELECT email FROM User U WHERE U.id = $1) email,
            (SELECT first_name FROM User U WHERE U.id = $1) first_name,
            (SELECT last_name FROM User U WHERE U.id = $1) last_name,
            FROM Booking BK WHERE user_id = $1`;
            try {
                const result2 = await db.query(text2, [user_id]);
                if (!rows.length) {
                    return res.status(200).send({
                        status: 'success',
                        error: 'No record found'
                    });
                }            
                return res.status(200).send({ 
                    status: 'success',
                    data: result2.rows
                });
            } catch(error) {
                console.log(error);
                return res.status(400).send({
                    status: 'error',
                    error
                })
            }
        }
    },
    /**
   * Delete a booking
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return status code 204 
   */
    async delete(req, res) {
        const { bookingId } = req.params; //get it from params

        // check to see if request contain token
        if (!req.token) {
            return res.status(403).send({
                status: 'error',
                error: 'Authentication failed'
            })
        }

        //verify token
        if(!Utility.verifyToken(req.token)){
            return res.status(403).send({
                status: 'error',
                error: 'Authentication failed'
            })
        }

        const deleteQuery = 'DELETE FROM Booking WHERE id=$1 returning *';
        try {
            const { rows } = await db.query(deleteQuery, [bookingId]);
            if(!rows[0]) {
                return res.status(404).send({
                    status: 'error',
                    error: 'booking not found'
                });
            }
            return res.status(204).send({
                status: 'success',
                data: {
                    message: 'Booking deleted successfully'
                }
            });
        } catch(error) {
            return res.status(400).send({
                status: 'error',
                error: 'An error occurred, please try again!'
            });
        }
    }


}
  
export default Booking;