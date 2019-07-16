
import 'dotenv/config';
import moment from 'moment';
import Utility from '../Utility';
import db from '../db';

const Trip = {
    /**
     * Create A Trip
     * @param {object} req 
     * @param {object} res
     * @returns {object} trip object 
     */
    async create(req, res) {
        const { bus_id, origin, destination, trip_date, fare } = req.body;
        
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

        const createQuery = `INSERT INTO
        Trip (bus_id, origin, destination, trip_date, fare, created_on)
        VALUES ($1, $2, $3, $4, $5, $6);`;
        const values = [
            bus_id,
            origin,
            destination,
            trip_date,
            fare,
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
     * Create all Trips
     * @param {object} req 
     * @param {object} res
     * @returns {object} trip array 
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
        const text = 'SELECT * FROM Trip';
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