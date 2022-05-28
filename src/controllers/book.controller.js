const Book = require('../models/bookModel')

const bookEdit = async (req, res, next) => {
    try {
        const book = await Book.findOne({ name: req.body.currentName })
        if (!book) {
            throw new Error('No book found.')
        }

        for (let key in req.body) {
            if (!book._doc[key] && key !== 'currentName' && book._doc[key] !== "")
                return res.status(400).send('illegal key entered')
            if (key === 'currentName' || req.body[key] === "")
                continue
            book[key] = req.body[key]
        }

        await book.save()
        res.send(book)
    }
    catch (error) {
        res.status(403).send({
            status: 403,
            message: error.message
        })
    }
}

const bookDelete = async (req, res, next) => {
    try {
        const bookName = req.params.book
        const book = await Book.findOne({ name: req.body.name })
        await Book.deleteOne(book)
        res.send(JSON.stringify(`deleted ${bookName}`))
    }
    catch (error) {
        return next(error);
    }
}

// const bookAdd = async (req, res) => {
//     try {
//         let book = await Book.findOne({ name: req.body.name })
//         if (book)
//             throw new Error('Book already exists in database.')
//         book = new Book(req.body)
//         await book.save()
//         await book.populate('author')
//         res.status(201).send(book)
//     } catch (error) {
//         res.status(403).send({
//             status: 403,
//             message: error.message
//         })
//     }
// }

const bookAdd = async (req, res) => {
    try {
        let book = await Book.findOne({ name: req.body.name })
        if (book)
            throw new Error('Book already exists in database.')
        book = new Book(req.body)
        await book.save()
        res.status(201).send(book)
    } catch (error) {
        res.status(403).send({
            status: 403,
            message: error.message
        })
    }
}

// const bookGet = async (req, res, next) => {
//     const bookName = req.params.book
//     try {
//         const isFetch = req.get('Is-Fetch')
//         const book = await Book.findOne({ name: bookName }).populate('author')

//         if (isFetch === 'true') {
//             if (book !== null) {
//                 return res.status(200).send(book)
//             }
//             const err = new Error('No book found')
//             err.status = 404
//             next(err)
//         }

//         if (book !== null) {
//             return res.render('book-page')
//         }
//         res.redirect('/')

//     } catch (error) {
//         return next(error);
//     }
// }

const bookGet = async (req, res, next) => {
    const bookName = req.params.book
    try {
        const isFetch = req.get('Is-Fetch')
        const book = await Book.findOne({ name: bookName })

        if (isFetch === 'true') {
            if (book !== null) {
                return res.status(200).send(book)
            }
            const err = new Error('No book found')
            err.status = 404
            next(err)
        }

        if (book !== null) {
            return res.render('book-page')
        }
        res.redirect('/')

    } catch (error) {
        return next(error);
    }
}

// const booksGet = async (req, res) => {
//     try {
//         const books = await Book.find().populate('author')
//         res.status(200).send(books)
//     } catch (error) {
//         res.status(500).send(
//             {
//                 message: error.message
//             }
//         )
//     }
// }

// const booksGet = async (req, res) => { this is the later one
//     try {
//         const books = await Book.find().limit(req.query.limit).skip(req.query.skip)
//         res.status(200).send(books)
//     } catch (error) {
//         res.status(500).send(
//             {
//                 message: error.message
//             }
//         )
//     }
// }

const booksGet = async (req, res) => {
    try {
        const books = await Book.find()
        res.status(200).send(books)
    } catch (error) {
        res.status(500).send(
            {
                message: error.message
            }
        )
    }
}

module.exports = {
    bookDelete,
    bookEdit,
    bookAdd,
    bookGet,
    booksGet
}