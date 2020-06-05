const mongoose = require('mongoose');
const expect = require('chai').expect;
const request = require("supertest");
const app = require("./app");
const server = request(app);

afterEach(done => {
  app.close();
  done();
});

describe('post /signup', () => {
  it('회원가입에 성공하여야 합니다.', async () => {
    const res = await server.post('/signup').send({
      nickname: '나무',
      email: 'tree08',
      password: '1234'
    });
    expect(res.status).to.equal(201);
    expect(res.body).has.all.keys([
      'id',
      'post'
    ]);
  });

  it('이미 회원인 경우 에러를 발생합니다.', async () => {
  
    const res = await server.post('/signup').send({
      nickname: 'hanu',
      email: 'hanu123',
      password: '0000'
    });
    expect(res.status).to.equal(409);
    expect(res.text).to.equal('Already exists user');
    
  });
});