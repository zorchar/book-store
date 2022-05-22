const errorHandler = ((error, req, res, next) => {
    if (error.status === 401)
        return res.send(JSON.stringify('no authentication'))
    error.status = 400
    res.status(error.status).send(
        {
            status: error.status,
            error: error.message
        }
    )
})

module.exports = errorHandler