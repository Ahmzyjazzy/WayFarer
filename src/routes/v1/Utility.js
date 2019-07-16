import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Utility = {
    /**
     * Hash Password Method
     * @param {string} password
     * @returns {string} returns hashed password
     */
    hashPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
    },
    /**
     * comparePassword
     * @param {string} hashPassword 
     * @param {string} password 
     * @returns {Boolean} return True or False
     */
    comparePassword(hashPassword, password) {
        return bcrypt.compareSync(password, hashPassword);
    },
    /**
     * isValidEmail Utility method
     * @param {string} email
     * @returns {Boolean} True or False
     */
    isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    },
    /**
     * Gnerate Token
     * @param {string} id
     * @returns {string} token
     */
    async generateToken(id) {
        const token = await jwt.sign({ userId: id }, process.env.SECRET,{ expiresIn: '7d' });
        return token;
    },  
    /**
     * Gnerate Token
     * @param {string} token
     * @returns {Boolean} 
     */
    verifyToken(token) {
        jwt.verify(token, process.env.SECRET, (err, authorizedData) => {
            if(err){
                //If error send Forbidden (403)
                console.log('ERROR: Could not connect to the protected route');
                res.sendStatus(403);
            } else {
                //If token is successfully verified, we can send the autorized data 
                return authorizedData;
                console.log('SUCCESS: Connected to protected route');
            }
        })
    }
}

export default Utility;