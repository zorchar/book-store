const express = require('express')
const Admin = require('../models/adminModel')
const authAdmin = require('../middleware/authAdmin')

const router = new express.Router()

router.post('/admin/add-admin', async (req, res, next) => {
    const admin = new Admin(req.body)
    try {
        await admin.generateToken()
        return res.send(admin)
    } catch (error) {
        res.status(400).send({
            status: 400,
            message: error.message
        })
    }
})

router.post('/admin/login', async (req, res, next) => {
    try {
        const admin = await Admin.findAdminByEmailAndPassword(req.body.email, req.body.password)
        const token = await admin.generateToken()
        res.send({ admin, token })
    } catch (error) {
        console.log('error found in login route');
        console.log(error.message);
        return next(error);
    }
})

router.post('/admin/logout', authAdmin, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((tokenDoc) => tokenDoc.token !== req.token)
        await req.admin.save()
        res.send()
        console.log('logout');
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/admin/auth-admin', authAdmin, async (req, res, next) => {
    try {
        res.send(req.admin)
    } catch (error) {
        return next(error);
    }
})

router.get('/admin/:adminName', async (req, res, next) => {
    try {
        res.render('admin-page')
    } catch (error) {
        return next(error)
    }
})

module.exports = router