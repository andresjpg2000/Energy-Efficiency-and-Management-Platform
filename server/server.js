const express = require('express');

const app = express();

app.use(express.json());

// use route middleware for /posts requests
app.use('/users', require('./routes/users.routes.js'));

// error middleware (always at the end of the file)
app.use((err, req, res, next) => {
    // !Uncomment this line to log the error details to the server console!
    // console.error(err);

    // error thrown by express.json() middleware when the request body is not valid JSON
    if (err.type === 'entity.parse.failed')
        return res.status(400).json({ message: 'Invalid JSON payload! Check if your body data is a valid JSON.' });

    res.status(err.statusCode || 500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
