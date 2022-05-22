const express = require('express')
const authUser = require('../middleware/authUser')
const Book = require('../models/bookModel')
const userController = require('../controllers/user.controller')

const router = new express.Router()

router.get('', userController.routeToHomePage)

router.route('/user/me')
    // .get(authUser, userController.userGet)
    .patch(authUser, userController.userUpdate)
// .delete(authUser, userController.userDelete)

router.post('/user/new', userController.userCreate)

router.post('/user/login', userController.userSignIn)//should be /me?

router.get('/user/logout', authUser, userController.userSignOut)

router.get('/user/:user/cart', userController.userRouteToCart)

router.get('/user/cart', userController.userRouteToCart)

router.post('/user/add-to-cart', authUser, userController.userAddToCart)

router.get('/user/get-cart', authUser, async (req, res, next) => {
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

router.get('/user/auth-user', authUser, async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (error) {
        return next(error);
    }
})

router.get('/user/:userName', async (req, res, next) => {
    try {
        res.render('user',
            {
                signInOrOut: `<div id="sign-out" class="nav-item">Sign Out</div>`
            })
    } catch (error) {
        return next(error)
    }
})

module.exports = router