const jwt = require('jsonwebtoken')
const Admin = require('../models/adminModel')

const authAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.SECRET)

        const admin = await Admin.findOne(
            {
                _id: data._id,
                // 'tokens.token': token // maybe keep for further verification
            }
        )

        if (!admin) {
            const err = new Error("No admin found")
            err.status = 401
            throw err
        }

        req.token = token
        req.admin = admin
        next()
    } catch (error) {
        console.log('error should appear');
        error.status = 401
        error.message = 'no authentication'
        next(error)
    }
}

module.exports = authAdmin