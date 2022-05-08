const express = require('express')
const User = require('../models/userModel')
const auth = require('../middleware/auth')
const async = require('hbs/lib/async')
const Book = require('../models/bookModel')

const router = new express.Router()

router.get('', async (req, res, next) => {
    try {
        res.render('index',
            {
                signInOrOut: `<div id="sign-in" class="nav-item">Sign In</div><div id="sign-up" class="nav-item">Sign Up</div>`
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

router.get('/user/auth_user', auth, async (req, res, next) => {
    try {
        res.send(req.user)//just something for now
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

router.post('/user/login', async (req, res, next) => {
    try {
        const user = await User.findUserByEmailAndPassword(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.send({ user, token })
    } catch (error) {
        // error.status = 400
        console.log('error found in login route');
        console.log(error.message);
        // res.send(error)
        return next(error);
    }
})

router.get('/user/login2', async (req, res) => {
    try {
        res.render('index3',
            {
                signInOrOut: `<div id="sign-out" class="nav-item">Sign Out</div>`
            })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: 400,
            message: error.message
        })
    }
})

router.get('/user/login3', auth, async (req, res) => {
    try {
        res.render('index3',
            {
                signInOrOut: `<div id="sign-out" class="nav-item">Sign Out</div>`
            })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: 400,
            message: error.message
        })
    }
})

router.get('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenDoc) => tokenDoc.token !== req.token)
        await req.user.save()
        res.send()//maybe send user?
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/user/add_to_cart', auth, async (req, res, next) => {
    try {
        const user = req.user
        const book = await Book.findOne({ name: req.body.bookName })
        await user.addBookToCart(book._id)
        await user.populate(
            {
                path: 'cart.book',
                populate: { path: 'author' }
            }
        )
        res.send(user.cart)
    } catch (error) {
        return next(error);
    }
})

router.get('/user/cart', auth, async (req, res, next) => {
    try {
        const user = req.user
        await user.populate(
            {
                path: 'cart.book',
                populate: {
                    path: 'author',
                    select: 'name'
                }
            }
        )
        res.send(user.cart)
    } catch (error) {
        return next(error);
    }
})

router.get('/user/:userName', async (req, res, next) => {
    try {
        res.render('index3',
            {
                signInOrOut: `<div id="sign-out" class="nav-item">Sign Out</div>`
            })
    } catch (error) {
        return next(error)
    }
})

router.use((error, req, res, next) => {
    console.log("hello from error handler")
    // if (error.message === 'no authentication') {

    // }

    res.status(error.status).send(
        {
            status: error.status,
            error: error.message
        }
    )
})

module.exports = router

