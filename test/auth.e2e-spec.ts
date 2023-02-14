import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'asda2211@asda.com';
    return request(app.getHttpServer())
      .post('/account/signup')
      .send({
        email: 'asda22sad11@smail.com',
        password: '1234',
        firstName: 'test',
        phone: '+201000000000',
        dob: '2023-12-12',
        lastName: 'test',
        userName: 'test',
        gender: 'MALE',
      })
      .expect(201)
      .then((res) => {
        expect(res.body.id).toBeDefined();
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'asd1sf@assdf.com';

    const res = await request(app.getHttpServer())
      .post('/account/signup')
      .send({
        email: email,
        password: '1234',
        firstName: 'test',
        phone: '+201000000000',
        dob: '2023-12-12',
        lastName: 'test',
        gender: 'MALE',
      })
      .expect(201);

    const cookie = res.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/account/get-profile-data')
      .set('Cookie', cookie)
      .expect(200);
    expect(body.email).toEqual(email);
  });
});
