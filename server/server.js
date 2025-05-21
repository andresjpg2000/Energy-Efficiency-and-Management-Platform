require('dotenv').config();
const express = require('express');
const db = require('./models/index.js');
const { ValidationError, UniqueConstraintError } = require('sequelize');

// const helmet = require('helmet'); security middleware
// app.use(helmet());
const cors = require('cors');
// const cookieParser = require('cookie-parser');

// Testing connection
(async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

const app = express();

// app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173', // Allow all origins (for development purposes only, restrict in production)
    credentials: true, // Allow cookies to be sent with requests
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// use route middleware for /login requests
app.use('/auth', require('./routes/auth.routes.js'));
// use route middleware for /users requests
app.use('/users', require('./routes/users.routes.js'));
// use route middleware for /given-energies requests
app.use('/given-energies', require('./routes/given-energies.routes.js'));
// use route middleware for /suppliers requests
app.use('/suppliers', require('./routes/suppliers.routes.js'));
// use route middleware for /widgets requests
app.use('/widgets', require('./routes/widgets.routes.js'));
// use route middleware for /housings requests
app.use('/housings', require('./routes/housings.routes.js'));
// use route middleware for /energy-equipments requests
app.use('/energy-equipments', require('./routes/energy-equipments.routes.js'));
// use route middleware for /energy-equipments requests
app.use('/energy-consumptions', require('./routes/energy-consumptions.routes.js'));
// use route middleware for /energy-productions requests
app.use('/energy-productions', require('./routes/energy-productions.routes.js'));
// use route middleware for /notifications requests
app.use('/notifications', require('./routes/notifications.routes.js'));

// error middleware (always at the end of the file)
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    next(err);
});

app.use((err, req, res, next) => {
    // !Uncomment this line to log the error details to the server console!
    // console.error(err);

    // error thrown by express.json() middleware when the request body is not valid JSON
    if (err.type === 'entity.parse.failed')
        return res.status(400).json({ message: 'Invalid JSON payload! Check if your body data is a valid JSON.' });

    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
        return res.status(400).json({
            error: 'Validation error',
            details: err.errors.map(error => ({
                field: error.path,
                message: error.message
            }))
        });

    }

    res.status(err.statusCode || 500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
