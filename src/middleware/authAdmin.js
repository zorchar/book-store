const jwt = require('jsonwebtoken')
const Admin = require('../models/adminModel')

const authAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.SECRET)

        const admin = await Admin.findOne(
            {
                _id: data._id,
                'tokens.token': token
            }
        )

        if (!admin)
            throw new Error()

        req.token = token
        req.admin = admin
        next()
    } catch (error) {
        res.status(401).send({
            status: 401,
            message: 'no authentication'
        })
    }
}

module.exports = authAdmin