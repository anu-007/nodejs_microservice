const express = require('express');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const download = require('image-downloader');

const app = express();

app.use(express.static('./thumbnails'));

app.get('/', (req, res) => {
    res.json({
        message: 'welcome to the microservice: go to /login route and enter username and password'
    });
});

app.post('/thumb', setToken, verifyToken, (req, res) => {
    options = {
        url: 'https://upload.wikimedia.org/wikipedia/en/7/7d/Minions_characters.png',
        dest: __dirname + '/thumbnails/'
    };
       
    download.image(options)
       .then(({ filename, image }) => {
         sharp(image)
            .resize(50, 50)
            .toFile(filename, function(err) {
                res.sendFile(filename);
            });
       }).catch((err) => {
         throw err
       })
});

app.post('/ptch', setToken, (req, res) => {
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
function setToken(req, res, next) {
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

function verifyToken(req, res, next) {
    jwt.verify(req.token, 'the lost world', (err) => {
        if(err) {
            res.sendStatus(403);
        } else {
            next();
        }
    });
}

module.exports = app;

app.listen(4000, () => console.log('server running on port 4000'));