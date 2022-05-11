const express = require('express')
const Admin = require('../models/adminModel')
const User = require('../models/userModel')
const authAdmin = require('../middleware/authAdmin')

const router = new express.Router()

router.post('/admin/add_admin', async (req, res, next) => {
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

router.get('/admin/get_admin', async (req, res) => {
    const _id = req.query.id
    try {
        const admin = await Admin.findById(_id).populate('cart')
        if (!admin) {
            return res.status(404).send({
                status: 404,
                message: 'wrong id'
            })
        }
        return res.send(admin)
    } catch (error) {
        res.status(500).send(error) // even if not 500. example - id too long
    }
})

router.get('/admin/get_all_admins', async (req, res) => {
    try {
        const admins = await Admin.find()
        if (admins.length > 0)
            res.send(admins)
        else {
            res.send('no admins found')
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error) // even if not 500. example - id too long
    }
})

router.get('/admin/get_all_users', async (req, res) => {
    try {
        const users = await User.find()
        if (users.length > 0)
            res.send(users)
        else {
            res.send('no admins found')
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error) // even if not 500. example - id too long
    }
})

router.patch('/admin/edit_user', authAdmin, async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            const err = new Error('No user found.')
            err.status = 404
            throw err
        }

        for (let key in req.body) {
            if (!user._doc[key]) {
                const err = new Error('Illegal key entered.')
                err.status = 400
                throw err
            }
            user[key] = req.body[key]
        }

        await user.save()
        res.send(user)
    }
    catch (error) {
        return next(error);
    }
})

router.delete('/admin/delete_user', authAdmin, async (req, res, next) => {
    try {
        const email = req.body.email

        if ((await User.deleteOne({ email })).deletedCount === 1)
            return res.send(`deleted ${email}`)

        const err = new Error('No user to delete found')
        err.status = 404
        throw err
    }
    catch (error) {
        return next(error);
    }
})

router.delete('/admin/delete_admin', authAdmin, async (req, res, next) => {
    try {
        const email = req.body.email

        if ((await Admin.deleteOne({ email })).deletedCount === 1)
            return res.send({ message: `deleted ${email}` })

        const err = new Error('No admin to delete found')
        err.status = 404
        next(err)

    }
    catch (error) {
        return next(error);
    }
})

router.patch('/admin/edit_admin', authAdmin, async (req, res, next) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email })
        if (!admin) {
            throw new Error('No admin found.')
        }

        for (let key in req.body) {
            if (!admin._doc[key])
                return res.status(400).send('illegal key entered')

            admin[key] = req.body[key]
        }

        await admin.save()
        res.send(admin)
    }
    catch (error) {
        return next(error);
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

router.post('/admin/logout_all', async (req, res) => {
    try {
        const email = req.header('Authorization')
        const admin = await Admin.findOne({ email })
        admin.tokens = []//admin.tokens.filter((tokenDoc) => { })
        await admin.save()
        res.send()
        console.log('logout all');
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/admin/auth_admin', authAdmin, async (req, res, next) => {
    try {
        res.send(req.admin)//just something for now
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