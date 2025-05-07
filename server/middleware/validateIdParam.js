// Middleware to validate that a request parameter is a valid positive integer. 

module.exports = (paramName) => {
    return (req, res, next) => {
        const id = Number(req.params[paramName]);

        // Check if the id is a valid integer
        if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
            return res.status(400).json({ error: `${paramName} must be a valid positive integer within the 32-bit range.` });
        }

        next();
    };
}