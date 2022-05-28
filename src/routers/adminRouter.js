const express = require('express')
const authAdmin = require('../middleware/authAdmin')
const adminController = require('../controllers/admin.controller')
const paginatedResults = require('../middleware/paginatedResults')

const router = new express.Router()

router.post('/admins/add-admin', adminController.adminAdd)

router.post('/admins/login', adminController.adminSignIn)

router.post('/admins/logout', authAdmin, adminController.adminSignout)

router.get('/admins/auth', authAdmin, async (req, res, next) => {
    try {
        res.send(req.admin)
    } catch (error) {
        res.render('admin-login')
    }
})

router.get('/admins', async (req, res, next) => {
    try {
        res.render('admin-login')
    } catch (error) {
        return next(error)
    }
})

router.get('/admins/:admin', paginatedResults, async (req, res, next) => {
    try {
        res.render('admin-page',
            {
                res: res.paginatedResults
            })
    } catch (error) {
        if (error.message === 'no authentication') {
        }
    }
})

module.exports = router