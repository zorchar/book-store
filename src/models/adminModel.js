const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('invalid email')
                }
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            // minlength: 8,
            // validate(value) {
            //     const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{0,}$/
            //     if (!passRegex.test(value)) {
            //         throw new Error('password must contain...')
            //     }
            // }
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

adminSchema.pre('save', async function (next) {
    const admin = this
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }
    next()
})

// check what to change
adminSchema.statics.findAdminByEmailAndPassword = async (email, password) => {
    const admin = await Admin.findOne({ email })
    if (!admin) {
        console.log('no admin found');
        console.log(email);
        throw new Error('Unable to login.')
    }

    const isPassMatch = await bcrypt.compare(password, admin.password)
    if (!isPassMatch) {
        throw new Error('Unable to login.')
    }

    return admin
}

adminSchema.methods.generateToken = async function () {
    const admin = this
    const token = jwt.sign(
        {
            _id: admin._id
        },
        process.env.SECRET,
        {
            expiresIn: '6h'
        }
    )
    admin.tokens.push({ token })
    await admin.save()

    return token
}

adminSchema.methods.toJSON = function () {
    const admin = this
    const adminObj = admin.toObject()

    delete adminObj.password
    delete adminObj.tokens

    return adminObj
}

const Admin = mongoose.model("Admin", adminSchema)

module.exports = Admin