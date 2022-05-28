const mongoose = require('mongoose')

const bookSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Name must be provided"],
            lowercase: true,
            unique: true,
        },
        author: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, "Author name must be provided"]
        },
        image: {
            type: String,
        },
        description: {
            type: String,
            required: [true, "Must provide description"]
        },
        price: {
            type: Number,
            required: true,
            min: [0, "Price can't be negative"],
            default: 0,
        },
    },
    {
        timestamps: true
    }
)

const Book = mongoose.model("Book", bookSchema)

module.exports = Book