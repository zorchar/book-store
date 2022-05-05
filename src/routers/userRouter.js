const express = require('express')
const User = require('../models/userModel')
const auth = require('../middleware/auth')

const router = new express.Router()


router.get('', auth, async (req, res, next) => {
    try {
        res.render('index',
            {
                signInOrOut: `<div id="sign-out" class="nav-item">Sign Out</div>`
            })
    } catch (error) {
        return next(error)
    }
})

router.post('/user/new_user', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.generateToken()
        res.status(201).send(user)
    } catch (error) {
        res.status(403).send({
            status: 403,
            message: error.message
        })
    }
})

router.get('/user/get_user', auth, async (req, res, next) => {
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
})

router.patch('/user/edit', auth, async (req, res, next) => {
    try {
        const user = req.user

        for (let key in req.body) {
            if (!user._doc[key])
                return res.status(400).send('illegal key entered')

            user[key] = req.body[key]
        }

        await user.save()
        // res.render('index',
        //     {
        //         signInOrOut: `<div id="sign-out" class="nav-item">Sign Out</div>`
        //     })
        res.send(user)
    }
    catch (error) {
        return next(error);
    }
})

router.delete('/user/delete', auth, async (req, res, next) => {
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
})

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findUserByEmailAndPassword(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.send({ user, token })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: 400,
            message: error.message
        })
    }
})

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenDoc) => tokenDoc.token !== req.token)
        await req.user.save()
        res.send()
        console.log('logout');
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/user/add_to_cart', async (req, res) => {
    try {
        const user = await User.findUserByEmailAndPassword(req.body.email, req.body.password)
        await user.addBookToCart(req.body.bookID)
        await user.populate(
            {
                path: 'cart.book',
                populate: { path: 'author' }
            }
        )
        res.send({ user })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: 400,
            message: error.message
        })
    }
})

router.use((error, req, res, next) => {
    console.log("hello from error handler")
    if (error.message === 'no authentication') {
        return res.render('index',
            {
                signInOrOut: `<div id="sign-up" class="nav-item">Sign Up</div><div id="sign-in" class="nav-item">Sign In</div>`
            })
    }

    res.status(error.status).send(
        {
            status: error.status,
            error: error.message
        }
    )
})

module.exports = router

