const express = require('express')
const Author = require('../models/authorModel')

const router = new express.Router()

router.post('/admin/add_author', async (req, res) => {
    const book = new Author(req.body)
    try {
        await book.save()
        res.send(book)
    } catch (error) {
        res.status(400).send({
            status: 400,
            message: error.message
        })
    }
})

// i guess you cant have two routers working for same request. the one on bookRouter takes priority
// router.post('/admin/add_book', async (req, res) => {
//     // const book = new Book(req.body)
//     // try {
//     //     await book.save()
//     //     res.send(book)
//     // } catch (error) {
//     //     res.status(400).send({
//     //         status: 400,
//     //         message: error.message
//     //     })
//     // }

//     console.log(req.body.author);
//     try {
//         let author = await Author.findOne({ name: req.body.author })
//         if (author) {
//             res.send(author)
//             return author
//         }
//         author = new Author({ name: req.body.author })
//         console.log(author);
//         await author.save()
//         res.send(author)
//     } catch (error) {
//         res.status(400).send({
//             status: 400,
//             message: error.message
//         })
//     }

// })


const populateBooks = async () => {
    const author = await Author.findById('626da064ad5296252f6e1b6a')

    await author.populate('books')
}

// populateBooks().then()

module.exports = router