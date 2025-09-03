function errorHandler(err, req, res, next) {
    console.error(err.stack); // Log the full error stack in console

    const statusCode = err.statusCode || 500; // Default to 500 Internal Server Error
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: message
    });
}

module.exports = errorHandler;
