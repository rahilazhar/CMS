const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log('Token:', token); // Log the token
        const decoded = jwt.verify(token, process.env.JWT_Key); // Ensure secret key matches
        req.user = { id: decoded.id };
        next();
    } catch (e) {
        console.error('Authentication error:', e.message); // Log the error
        res.status(401).send({ error: 'Please authenticate.' });
    }
};


module.exports = auth



