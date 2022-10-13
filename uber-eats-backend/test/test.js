var app = require('../index.js');
var assert = require('chai').assert;
var chai = require('chai');
chai.use(require('chai-http'));
const request = require('supertest');
let should = chai.should();
var expect = require('chai').expect;

var agent = require('chai').request.agent(app);

describe('Login', function () {
    it('POST /login', done => {    
        agent.post('/login')
        .set('Accept', 'application/json')
        .send({"email":"sushan@gmail.com", "password":"admin"})
        .end((err,res)=>{
            if(err) throw err;
            expect(res.status).to.be.equal(200);
            done();
        });
    });
})

describe('RestaurantLogin', function () {
    it('POST /reslogin', done => {    
        agent.post('/reslogin')
        .set('Accept', 'application/json')
        .send({"email":"greek@nickthegreek.com", "password":"admin"})
        .end((err,res)=>{
            if(err) throw err;
            expect(res.status).to.be.equal(200);
            done();
        });
    });
})

describe('RestaurantLogin', function () {
    it('POST /wrongcreds', done => {    
        agent.post('/reslogin')
        .set('Accept', 'application/json')
        .send({"email":"smash.com", "password":"admin"})
        .end((err,res)=>{
            if(err) throw err;
            expect(res.body).to.have.status(403);
            done();
        });
    });
})

describe('UserReg', function () {
    it('POST /userReg', done => {    
        agent.post('/userReg')
        .set('Accept', 'application/json')
        .send({"name": "Sushan", "contact": "6691234567", "email":"sushan@gmail.com", "password":"admin"})
        .end((err,res)=>{
            if(err) throw err;
            // console.log(res);
            expect(res.body).to.have.status(1062);
            done();
        });
    });
})


describe('resReg', function () {
    it('POST /resReg', done => {    
        agent.post('/resReg')
        .set('Accept', 'application/json')
        .send({"name": "Nick The Greek", "location": "Santa Clara", "email":"greek@nickthegreek.com", "password":"admin"})
        .end((err,res)=>{
            if(err) throw err;
            // console.log(res);
            expect(res.body).to.have.status(1062);
            done();
        });
    });
})

