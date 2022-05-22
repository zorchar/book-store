const paginatedResults = (model) => {
    return async (req, res, next) => {
        const limit = parseInt(req.query.limit)
        const page = parseInt(req.query.page)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}
        if (endIndex < await model.countDocuments())
            results.next =
            {
                page: page + 1,
                limit
            }

        if (startIndex > 0) {
            results.previous =
            {
                page: page - 1,
                limit
            }
        }

        try {
            results.results = await model.find().limit(limit).skip(startIndex).populate('author')
            res.paginatedResults = results
            next()
        } catch (error) {
            res.status(500).send(
                {
                    message: error.message
                }
            )
        }
    }
}

module.exports = paginatedResults