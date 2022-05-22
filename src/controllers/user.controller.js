const User = require('../models/userModel')

const userSignOut = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenDoc) => tokenDoc.token !== req.token)
        await req.user.save()
        res.send()//maybe send user?
    } catch (error) {
        res.status(500).send(error)
    }
}

const userSignIn = async (req, res, next) => {
    try {
        const user = await User.findUserByEmailAndPassword(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.send({ user, token })
    } catch (error) {
        console.log('error found in login route: ', error.message);
        return next(error);
    }
}

const userDelete = async (req, res, next) => {
    try {
        const email = req.user.email
        const user = await User.findUserByEmailAndPassword(req.body.email, req.body.password)
        if (email === user.email) {
            await User.deleteOne(user)
            res.send(`deleted ${email}`)
        }
    }
    catch (error) {
        return next(error);
    }
}

const userUpdate = async (req, res, next) => {
    try {
        const user = req.user

        for (let key in req.body) {
            if (!user._doc[key])
                return res.status(400).send('illegal key entered')

            user[key] = req.body[key]
        }

        await user.save()
        res.send(user)
    }
    catch (error) {
        error.status = 403
        return next(error);
    }
}

const userGet = async (req, res, next) => {
    const _id = req.user._id
    try {
        const user = await User.findById(_id).populate(
            {
                path: 'cart.book',
                populate: { path: 'author' }
            }
        )
        if (!user) {
            const err = new Error("Something went wrong. Can't find user in database.")
            err.status = 500
            throw err
        }
        res.send(user)
    } catch (error) {
        return next(error);
    }
}

const userCreate = async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(403).send({
            status: 403,
            message: error.message
        })
    }
}

module.exports = {
    userCreate,
    userDelete,
    userGet,
    userSignIn,
    userSignOut,
    userUpdate
}
