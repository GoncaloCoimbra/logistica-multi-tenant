import request from 'supertest';
import { createApp } from '../src/main';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const describeOrSkip = process.env.DATABASE_URL ? describe : describe.skip;

describeOrSkip('Auth e2e: refresh/revoke', () => {
  let app: INestApplication;
  let server: any;
  let refreshToken: string;
  let userCompanyId: string;

  beforeAll(async () => {
    app = await createApp();
    await app.init();
    server = app.getHttpServer();
  }, 20000);

  afterAll(async () => {
    if (userCompanyId) {
      await prisma.company.delete({ where: { id: userCompanyId } }).catch(() => {});
    }
    await prisma.$disconnect();
    await app.close();
  });

  test('register -> login -> refresh -> revoke', async () => {
    const ts = Date.now();
    const reg = await request(server)
      .post('/api/auth/register')
      .send({
        email: `e2e.auth.${ts}@example.com`,
        password: 'password123',
        name: 'E2E User',
      });

    expect(reg.status).toBe(201);
    expect(reg.body.refreshToken).toBeTruthy();

    refreshToken = reg.body.refreshToken;
    userCompanyId = reg.body.user.companyId;

    // Use refresh endpoint
    const refreshed = await request(server)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(refreshed.status).toBe(200);
    expect(refreshed.body.token).toBeTruthy();

    // Revoke
    const revoked = await request(server)
      .post('/api/auth/revoke')
      .send({ refreshToken });

    expect(revoked.status).toBe(200);
    expect(revoked.body.revoked).toBe(true);

    // Try refresh again (should fail)
    const refreshed2 = await request(server)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(refreshed2.status).toBe(401);
  }, 30000);
});
