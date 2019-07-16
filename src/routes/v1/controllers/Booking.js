
import 'dotenv/config';
import moment from 'moment';
import Utility from '../Utility';
import db from '../db';

const Trip = {
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

        const createQuery = `INSERT INTO Booking (trip_id, user_id, created_on)
        VALUES ($1, $2, $3, $4, $5, $6);`;
        const values = [
            trip_id,
            user_id,
            moment(new Date())
        ];

        try {
            const { rows } = await db.query(createQuery, values);            
            const { id, bus_id, origin, destination, trip_date, fare } = rows[0];
            return res.status(201).send({ 
                status: 'success',
                data: { 
                    trip_id: rows[0].id,
                    bus_id, 
                    origin, 
                    destination, 
                    trip_date, 
                    fare
                }
             });
        } catch(error) {
            console.log(error);
            return res.status(400).send({ 
                status: 'error',
                error,
                hashPassword
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

        // check if user exist and set jwt token
        const text = 'SELECT * FROM Booking';
        try {
            const { rows } = await db.query(text);
            if (!rows.length) {
                return res.status(200).send({
                    status: 'success',
                    error: 'No record found'
                });
            }            
            return res.status(200).send({ 
                status: 'success',
                data: rows
            });
        } catch(error) {
            console.log(error);
            return res.status(400).send({
                status: 'error',
                error
            })
        }
    }


}
  
export default Trip;