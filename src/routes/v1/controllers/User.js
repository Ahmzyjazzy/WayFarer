
import 'dotenv/config';
import moment from 'moment';
import Utility from '../Utility';
import db from '../db';

const User = {
    /**
     * Create A User
     * @param {object} req 
     * @param {object} res
     * @returns {object} reflection object 
     */
    async create(req, res) {
        const { email, first_name, last_name, password, is_admin } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                status: 'error',
                error: 'Some values are missing'
            });
        }
        if (!Utility.isValidEmail(email)) {
            return res.status(400).send({
                status: 'error',
                error: 'Please enter a valid email address' 
            });
        }

        const hashPassword = Utility.hashPassword(password);

        const createQuery = `INSERT INTO
        Users (email, first_name, last_name, password, is_admin, created_on)
        VALUES ($1, $2, $3, $4, $5, $6);`;
        const values = [
            email,
            first_name,
            last_name,
            hashPassword,
            is_admin,
            moment(new Date())
        ];

        try {
            const { rows } = await db.query(createQuery, values);
            const token = Utility.generateToken(rows[0].id);
            return res.status(201).send({ 
                status: 'success',
                data: { 
                    user_id: rows[0].id,
                    email, 
                    first_name, 
                    last_name }
             });
        } catch(error) {
            console.log(error);
            if (error.routine === '_bt_check_unique') {
                return res.status(400).send({ 
                    status: 'error',
                    error: 'User with that EMAIL already exist' 
                });
            }
            return res.status(400).send({ 
                status: 'error',
                error,
                hashPassword
            });
        }
    },


}
  
export default User;