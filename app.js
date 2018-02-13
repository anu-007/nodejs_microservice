const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/', (req, res) => {
    res.json({
        message: 'welcome to the microservice: go to /login route and enter username and password'
    });
});

app.post('/thumb', verifyToken, (req, res) => {
    jwt.verify(req.token, 'the lost world', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created',
                authData
            });
        }
    });
});

app.post('/login', (req, res) => {
    //Mock user login
    const user = {
        username: 'tom',
        password: 'dale'
    };

    jwt.sign({user}, 'the lost world', { expiresIn: '120s' }, (err, token) => {
        res.json({
            token
        });
    });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

//Verify token
function verifyToken(req, res, next) {
    //get auth header value
    const bearerHeader = req.headers['authorization'];
    // check if bearer is undefined
    if(typeof bearerHeader != 'undefined') {
        // Split at space
        const bearer = bearerHeader.split(' ');
        // get token from array
        const bearerToken = bearer[1];
        // set the token
        req.token = bearerToken;
        // next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

app.listen(4000, () => console.log('server running on port 4000'));