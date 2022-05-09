const express = require('express')
const User = require('../models/userModel')
const authUser = require('../middleware/authUser')
const Book = require('../models/bookModel')
const userController = require('../controllers/user.controller')

const router = new express.Router()

router.route('/user/me')
    .get(authUser, userController.userGet)
    .patch(authUser, userController.userUpdate)
    .delete(authUser, userController.userDelete)

router.post('/user/new_user', userController.userCreate)

router.post('/user/login', userController.userSignIn)//should be /me?

router.get('/user/logout', authUser, userController.userSignOut)

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

router.get('/user/auth_user', authUser, async (req, res, next) => {
    try {
        res.send(req.user)//just something for now
    } catch (error) {
        return next(error);
    }
})

router.post('/user/add_to_cart', authUser, async (req, res, next) => {
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

router.get('/user/cart', authUser, async (req, res, next) => {
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

    res.status(error.status).send(
        {
            status: error.status,
            error: error.message
        }
    )
})

module.exports = router

