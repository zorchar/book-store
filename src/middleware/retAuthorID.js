const Author = require('../models/authorModel')

const retAuthorID = async (req, res, next) => {
    try {
        let author = await Author.findOne({ name: req.body.author })
        if (!author) {
            author = new Author({ name: req.body.author })
            console.log('new author created');
            await author.save()
            console.log('author saved');
        }
        req.body.author = author._id
        next()
    } catch (error) {
        res.status(400).send({
            status: 400,
            message: error.message
        })
    }
}

module.exports = retAuthorID