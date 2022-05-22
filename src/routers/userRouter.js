const express = require('express')
const authUser = require('../middleware/authUser')
const Book = require('../models/bookModel')
const userController = require('../controllers/user.controller')

const router = new express.Router()

router.get('', userController.routeToHomePage)

router.route('/users/me')
    .patch(authUser, userController.userUpdate)

router.post('/users/new', userController.userCreate)

router.post('/users/login', userController.userSignIn)

router.get('/users/logout', authUser, userController.userSignOut)

router.get('/users/:user/cart', userController.userRouteToCart)

router.get('/cart', userController.userRouteToCart)

router.post('/users/add-to-cart', authUser, userController.userAddToCart)

router.get('/users/send-cart', authUser, userController.userGetCart)

router.get('/users/auth-user', authUser, async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (error) {
        return next(error);
    }
})

router.get('/users/:user', async (req, res, next) => {
    try {
        res.render('user')
    } catch (error) {
        return next(error)
    }
})

module.exports = router