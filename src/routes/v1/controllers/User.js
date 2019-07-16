
import 'dotenv/config';
import moment from 'moment';
import Utility from '../Utility';
import db from '../db';

const User = {
    /**
     * Create A User
     * @param {object} req 
     * @param {object} res
     * @returns {object} user object 
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
                    last_name,
                    token
                }
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
    /**
     * Create A User
     * @param {object} req 
     * @param {object} res
     * @returns {object} user object 
     */
    async signin(req, res){
        const { email, password } = req.body;

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

        // check if user exist and set jwt token
        const text = 'SELECT * FROM Users WHERE email = $1';
        try {
            const { rows } = await db.query(text, [email]);
            if (!rows[0]) {
                return res.status(400).send({
                    status: 'error',
                    error: 'The credentials you provided is incorrect'
                });
            }
            if(!Helper.comparePassword(rows[0].password, password)) {
                return res.status(400).send({ 
                    status: 'error',
                    error: 'The credentials you provided is incorrect' 
                });
            }
            const token = Helper.generateToken(rows[0].id);
            const { id, is_admin } = row[0];
            return res.status(200).send({ 
                status: 'success',
                data: {
                    user_id: id,
                    is_admin,
                    token
                }               
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
  
export default User;