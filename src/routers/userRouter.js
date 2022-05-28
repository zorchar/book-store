const express = require('express')
const authUser = require('../middleware/authUser')
const userController = require('../controllers/user.controller')
const paginatedResults = require('../middleware/paginatedResults')
const res = require('express/lib/response')

const router = new express.Router()

router.get('', paginatedResults, (req, res, next) => {
    res.render('index',
        {
            res: res.paginatedResults
        })
})

router.route('/users/me')
    .patch(authUser, userController.userUpdate)

router.post('/users/new', userController.userCreate)

router.post('/users/login', userController.userSignIn)

router.get('/users/logout', authUser, userController.userSignOut)

router.get('/users/:user/cart', userController.userRouteToCart)

router.get('/cart', userController.userRouteToCart)

router.post('/users/add-to-cart', authUser, userController.userAddToCart)

router.delete('/users/empty-cart', authUser, userController.userEmptyCart)

router.get('/users/send-cart', authUser, userController.userGetCart)

router.get('/users/auth-user', authUser, async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (error) {
        return next(error);
    }
})

router.get('/users/:user', paginatedResults, async (req, res, next) => {
    res.render('user',
        {
            res: res.paginatedResults
        })
})

module.exports = router