const express = require('express');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const download = require('image-downloader');
const jsonpatch = require('json-patch');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.static('./thumbnails'));
app.use(bodyParser.json());

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

function setToken(req, res, next) {
    const bearerHeader = req.headers.authorization;
    // check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
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

app.get('/', (req, res) => {
    res.json({
        message: 'welcome to the microservice: go to /login route and enter username and password'
    });
});

app.post('/thumb', setToken, verifyToken, (req, res) => {
    const options = {
        url: req.body.url,
        dest: path.join(__dirname, '/thumbnails/'),
    };
    download.image(options)
       .then(({ filename, image }) => {
         sharp(image)
            .resize(50, 50)
            .toFile(filename, () => {
                res.sendFile(filename);
            });
       }).catch((err) => {
         throw err;
       });
});

app.post('/ptch', setToken, verifyToken, (req, res) => {
    const patch = jsonpatch.apply(req.body, [{ op: 'add', path: '/foo', value: 'bar' },
                                        { op: 'add', path: '/hello', value: ['world'] },
                                    ]);
    res.json(patch);
});

app.post('/login', (req, res) => {
    const user = {
        username: req.body.user,
        password: req.body.password,
    };

    jwt.sign({ user }, 'the lost world', { expiresIn: '120s' }, (err, token) => {
        res.json({
            token,
        });
    });
});

module.exports = app;

app.listen(4000, () => {
    console.log('server running on port 4000');
});
