const mongoose = require('mongoose')

const bookSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            lowercase: true,
            unique: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Author',
            trim: true,
            required: true
        },
        image: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

const populateAuthor = async (bookID) => {
    const book = await Book.findById(bookID)

    await book.populate('author')
}

const Book = mongoose.model("Book", bookSchema)

module.exports = Book