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

        if (!user)
            throw new Error()

        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({
            status: 401,
            message: 'no authentication'
        })
    }
}

module.exports = auth