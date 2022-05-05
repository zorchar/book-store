const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.SECRET)
        const user = await User.findOne(
            {
                _id: data._id,
                // 'tokens.token': token // don't know why Arie added this. check in sadna
            }
        )

        if (!user) {
            const err = new Error("No user found")
            err.status = 401
            throw err
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        error.status = 401
        error.message = 'no authentication'
        next(error)

        // res.status(401).send({
        //     status: 401,
        //     message: 'no authentication'
        // })
    }
}

module.exports = auth