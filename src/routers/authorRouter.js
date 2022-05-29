// const express = require('express')
// const Author = require('../models/authorModel')

// const router = new express.Router()

// router.post('/admins/add_author', async (req, res) => {
//     const author = new Author(req.body)
//     try {
//         await author.save()
//         res.send(author)
//     } catch (error) {
//         res.status(400).send({
//             status: 400,
//             message: error.message
//         })
//     }
// })

// module.exports = router