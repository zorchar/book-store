const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const authUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.SECRET)
        const user = await User.findOne(
            {
                _id: data._id,
                'tokens.token': token
            }
        )

        if (!user) {
            const err = new Error("No user found")
            err.status = 401
            throw err
        }
        req.token = token
        req.user = user
        return next()
    } catch (error) {
        console.log('error should appear');
        error.status = 401
        error.message = 'no authentication'
        return next(error)
    }
}

module.exports = authUser