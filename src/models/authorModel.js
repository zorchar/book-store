const mongoose = require('mongoose')

const authorSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            lowercase: true,
            unique: true,
        }
    }
)

authorSchema.virtual('books', {
    ref: 'Book',
    localField: '_id',
    foreignField: 'author'
})

const Author = mongoose.model('Author', authorSchema)

module.exports = Author
