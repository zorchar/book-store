const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
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
        cart: [
            {
                book: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Book',

                },
                quantity: {
                    type: Number,
                    default: 1,
                    min: 1
                }
            }
        ],
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

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.statics.findUserByEmailAndPassword = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        const err = new Error('Unable to login.')
        err.status = 400
        throw err
    }

    const isPassMatch = await bcrypt.compare(password, user.password)
    if (!isPassMatch) {
        const err = new Error('Unable to login.')
        err.status = 400
        throw err
    }

    return user
}

userSchema.methods.generateToken = async function () {
    const user = this
    const token = jwt.sign(
        {
            _id: user._id
        },
        process.env.SECRET,
        {
            expiresIn: '6h'
        }
    )
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.methods.addBookToCart = async function (bookID) {
    const user = this
    const cartMatchingEls = user.cart.filter(e => e.book._id.toString() === bookID.toString())

    if (cartMatchingEls.length > 0) {
        cartMatchingEls[0].quantity = parseInt(cartMatchingEls[0].quantity) + 1
    }
    else
        user.cart.push({ book: bookID })
    await user.save()

    // return { book }
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens

    return userObj
}

const User = mongoose.model("User", userSchema)

module.exports = User