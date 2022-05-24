const Admin = require('../models/adminModel')

const adminAdd = async (req, res, next) => {
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
}

const adminSignIn = async (req, res, next) => {
    try {
        const admin = await Admin.findAdminByEmailAndPassword(req.body.email, req.body.password)
        const token = await admin.generateToken()
        res.send({ admin, token })
    } catch (error) {
        console.log('error found in login route');
        console.log(error.message);
        return next(error);
    }
}

const adminSignout = async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((tokenDoc) => tokenDoc.token !== req.token)
        await req.admin.save()
        res.send()
        console.log('logout');
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {
    adminAdd,
    adminSignIn,
    adminSignout
}