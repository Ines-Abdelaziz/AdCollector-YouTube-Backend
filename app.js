const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(cors());
// Routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
