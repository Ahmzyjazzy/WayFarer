
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

        //check if bus has been assigned to an active trip
        try{
            const text = `SELECT bus_id FROM Trip WHERE bus_id = $1 AND status = 'Active'`;
            const res = await db.query(text, [bus_id]);
            if (res.rows[0]) {
                return res.status(400).send({
                    status: 'error',
                    error: 'This Bus has already been assigned to an active trip'
                });
            }
        }catch(error){
            console.log(error);
            return res.status(400).send({ 
                status: 'error',
                error: 'An error occurred, please try again!',
            });
        }

        const createQuery = `INSERT INTO
        Trip (bus_id, origin, destination, trip_date, fare, status)
        VALUES ($1, $2, $3, $4, $5, $6);`;
        const values = [
            bus_id,
            origin,
            destination,
            trip_date,
            fare,
            'Active'
        ];

        try {
            const { rows } = await db.query(createQuery, values);            
            const { id, bus_id, origin, destination, trip_date, fare, status } = rows[0];
            return res.status(201).send({ 
                status: 'success',
                data: { 
                    trip_id: rows[0].id,
                    bus_id, 
                    origin, 
                    destination, 
                    trip_date, 
                    fare,
                    status
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

        // check if user exist and 64set jwt token
        const text = `SELECT * FROM Trip WHERE status = 'Active' `;
        try {
            const { rows } = await db.query(text);
            return res.status(200).send({ 
                status: 'success',
                data: rows
            });
        } catch(error) {
            console.log(error);
            return res.status(400).send({
                status: 'error',
                error: 'An error occurred, please try again!'
            })
        }
    },
    /**
     * Create A User
     * @param {object} req 
     * @param {object} res
     * @returns {object} message object 
     */
    async cancel(req, res) {
        const { tripId } = req.params; //get it from params

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

        const cancelQuery = `UPDATE Trip SET status = 'Cancel' WHERE id=$1 returning *`;
        try {
            const { rows } = await db.query(cancelQuery, [tripId]);
            if(!rows[0]) {
                return res.status(404).send({
                    status: 'error',
                    error: 'trip not found'
                });
            }
            return res.status(204).send({
                status: 'success',
                data: {
                    message: 'Trip cancelled successfully'
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
  
export default Trip;