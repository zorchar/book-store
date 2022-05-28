const User = require('../models/userModel')
const Book = require('../models/bookModel')

const userSignOut = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenDoc) => tokenDoc.token !== req.token)
        await req.user.save()
        res.send()//maybe send user?
    } catch (error) {
        res.status(500).send(error)
    }
}

const userSignIn = async (req, res, next) => {
    try {
        const user = await User.findUserByEmailAndPassword(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.send({ user, token })
    } catch (error) {
        console.log('error found in login route: ', error.message);
        return next(error);
    }
}

const userUpdate = async (req, res, next) => {
    try {
        const user = req.user

        for (let key in req.body) {
            if (!user._doc[key])
                return res.status(400).send('illegal key entered')

            user[key] = req.body[key]
        }

        await user.save()
        res.send(user)
    }
    catch (error) {
        error.status = 403
        return next(error);
    }
}

const userCreate = async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(403).send({
            status: 403,
            message: error.message
        })
    }
}

// const routeToHomePage = async (req, res, next) => {
//     try {
//         res.render('index')
//     } catch (error) {
//         return next(error)
//     }
// }

const routeToHomePage = async (req, res, next) => {
    try {
        const skip = req.skip
        const limit = req.limit
        const books = Book.find().skip(skip).limit(limit)
        res.render('index',
            {
                books: 'hahahaha'
            }
        )
    } catch (error) {
        return next(error)
    }
}

const userRouteToCart = async (req, res, next) => {
    try {
        res.render('cart')
    } catch (error) {
        return next(error)
    }
}

const userGetCart = async (req, res, next) => {
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
}

// const userAddToCart = async (req, res, next) => {
//     try {
//         const user = req.user
//         const book = await Book.findOne({ name: req.body.bookName })
//         await user.addBookToCart(book._id)
//         await user.populate(
//             {
//                 path: 'cart.book',
//                 populate: { path: 'author' }
//             }
//         )
//         res.send(user.cart)
//     } catch (error) {
//         return next(error);
//     }
// }

const userAddToCart = async (req, res, next) => {
    try {
        const user = req.user
        const book = await Book.findOne({ name: req.body.bookName })
        await user.addBookToCart(book._id)
        res.send(user.cart)
    } catch (error) {
        return next(error);
    }
}

const userEmptyCart = async (req, res, next) => {
    try {
        const user = req.user
        user.cart = []
        user.save()
        res.send(user.cart)
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    userCreate,
    userSignIn,
    userSignOut,
    userUpdate,
    userRouteToCart,
    userGetCart,
    userAddToCart,
    userEmptyCart,
    routeToHomePage,
}