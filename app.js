const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/', (req, res) => {
    res.json({
        message: 'welcome to the microservice: go to /login route and enter username and password'
    });
});

app.post('/login', (req, res) => {
    //Mock user login
    const user = {
        id: 1,
        username: 'anu-007',
        email: 'anubhutiv1@gmail.com'
    }

    jwt.sign({user}, 'the lost world', (err, token) => {
        res.json({
            token
        });
    });
});

app.listen(4000, () => console.log('server running on port 4000'));