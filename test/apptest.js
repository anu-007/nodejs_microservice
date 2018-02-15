const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('Thumbnail microservice Testing', () => {

    describe('Testing for welcome message', () => {
        it('it should GET a welcome message', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.message.should.eql('welcome to the microservice: go to /login route and enter username and password');
                done();
                });
        });
    });

    describe('Testing for public routes', () => {
        //include test cases for empty username or password pair
        it('it returns JWT token for a username and password pair', () => {
            chai.request(server)
                .post('/login')
                .type('json')
                .send('{"username":"admin","password":"admin"}')
                .end(function(err, res) {
                    if (err) return done(err);
                    res.body.should.have.property('jwt');
                done();
            });
        });
    });

    describe('testing for protected routes', () => {
        var token = '', result;
        beforeEach(function(done) {
            chai.request(server)
              .post('/login')
              .type('json')
              .send('{"username":"admin","password":"admin"}')
              .end(function(err, res) {
                result = JSON.parse(res.text);
                token = result.token;
                done();
            });
        });

        it('should not be able to consume the route /thumb since no token was sent', function(done) {
            chai.request(server)
              .post('/thumb')
              .end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });

        it('should not be able to consume the route /thumb since unauthorized token was sent', function(done) {
            chai.request(server)
              .post('/thumb')
              .set('Authorization', 'Bearer ' + 'some other token')
              .end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });

        it('should be able to consume the route /thumb since token valid was sent', function(done) {
            chai.request(server)
              .post('/thumb')
              .set('Authorization', 'Bearer ' + token)
              .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });

        it('should not be able to consume the route /ptch since no token was sent', function(done) {
            chai.request(server)
              .post('/ptch')
              .end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });

        it('should not be able to consume the route /ptch since unauthorized token was sent', function(done) {
            chai.request(server)
              .post('/ptch')
              .set('Authorization', 'Bearer ' + 'some other token')
              .end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });

        it('should be able to consume the route /ptch since token valid was sent', function(done) {
            chai.request(server)
              .post('/ptch')
              .type('json')
              .send('{"bax":"qux","foo":"bar"}')
              .set('Authorization', 'Bearer ' + token)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
              });
        });
    });

});