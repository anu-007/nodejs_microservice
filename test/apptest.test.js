const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.should();

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
        it('it returns JWT token for a username and password pair', () => {
            chai.request(server)
                .post('/login')
                .type('json')
                .send('{"username":"admin","password":"admin"}')
                .end((err, res, done) => {
                    if (err) return done(err);
                    res.body.should.have.property('jwt');
                done();
            });
        });
    });

    describe('testing for protected routes', () => {
        let tokenjwt = '';
        beforeEach((done) => {
            chai.request(server)
              .post('/login')
              .type('json')
              .send('{"username":"admin","password":"admin"}')
              .end((err, res) => {
                const result = JSON.parse(res.text);
                tokenjwt = result.token;
                done();
            });
        });

        it('should not be able to consume the route /thumb since no token was sent', (done) => {
            chai.request(server)
              .post('/thumb')
              .end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });

        it('should not be able to consume the route /thumb since unauthorized token was sent', (done) => {
            chai.request(server)
              .post('/thumb')
              .set('Authorization', 'Bearer someothertoken')
              .end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });

        it('should be able to consume the route /thumb since token valid was sent', (done) => {
            chai.request(server)
              .post('/thumb')
              .type('json')
              .send('{"url":"https://cdn.pixabay.com/photo/2017/07/29/20/18/minions-2552584_960_720.jpg"}')
              .set('Authorization', `Bearer ${tokenjwt}`)
              .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });

        it('should not be able to consume the route /ptch since no token was sent', (done) => {
            chai.request(server)
              .post('/ptch')
              .end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });

        it('should not be able to consume the route /ptch since unauthorized token was sent', (done) => {
            chai.request(server)
              .post('/ptch')
              .set('Authorization', 'Bearer someothertoken')
              .end((err, res) => {
                res.should.have.status(403);
                done();
            });
        });

        it('should be able to consume the route /ptch since token valid was sent', (done) => {
            chai.request(server)
              .post('/ptch')
              .type('json')
              .send('{"baz":"qux","foo":"bar"}')
              .set('Authorization', `Bearer ${tokenjwt}`)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
    });
});
