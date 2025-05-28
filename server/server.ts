/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express, { application } from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { ClientError, errorMiddleware, authMiddleware } from './lib/index.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

// ---------- AUTH ROUTES ----------

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { fullName, username, password, role } = req.body;

    if (!fullName || !username || !password || !role) {
      throw new ClientError(400, 'All fields required');
    }

    const hashedPassword = await argon2.hash(password);

    const sql = `
      INSERT INTO "Users" ("fullName", "username", "hashedPassword", "role")
      VALUES ($1, $2, $3, $4)
      RETURNING "userId", "username", "role", "createdAt"
    `;

    const params = [fullName, username, hashedPassword, role];
    const result = await db.query(sql, params);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(401, 'Missing credentials');
    }

    const sql = 'SELECT * FROM "Users" WHERE "username" = $1';
    const result = await db.query(sql, [username]);
    const user = result.rows[0];

    if (!user) {
      throw new ClientError(401, 'Invalid login');
    }

    const isMatch = await argon2.verify(user.hashedPassword, password);
    if (!isMatch) {
      throw new ClientError(401, 'Invalid login');
    }

    const payload = {
      userId: user.userId,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, hashKey);
    res.status(200).json({ user: payload, token });
  } catch (err) {
    next(err);
  }
});

// ---------- USERS ----------

app.get('/api/Users/kids', authMiddleware, async (req, res, next) => {
  try {
    const sql = `SELECT "userId", "fullName" FROM "Users" WHERE "role" = 'kid'`;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.post('/api/Users', authMiddleware, async (req, res, next) => {
  try {
    const { fullName, username, hashedPassword, role } = req.body;
    if (!fullName || !username || !hashedPassword || !role)
      throw new ClientError(400, 'All fields required');

    // CHECKER: IF USERNAME ALREADY EXISTS.
    const checkSql = `SELECT 1 FROM "Users" WHERE "username" = $1`;
    const checkResult = await db.query(checkSql, [username]);

    if (checkResult.rows.length > 0) {
      throw new ClientError(
        409,
        'There is already an existing account with this username.'
      );
    }

    // ACCEPT USER IF NO CONFLICT.
    const sql = `
      INSERT INTO "Users"("fullName", "username", "hashedPassword", "role")
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await db.query(sql, [
      fullName,
      username,
      hashedPassword,
      role,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.put('/api/Users/:userId', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { fullName, username, hashedPassword } = req.body;
    if (!Number(userId) || !fullName || !username || !hashedPassword)
      throw new ClientError(400, 'Invalid input');

    const sql = `
      UPDATE "Users"
      SET "fullName" = $1, "username" = $2, "hashedPassword" = $3
      WHERE "userId" = $4
      RETURNING *;
    `;
    const result = await db.query(sql, [
      fullName,
      username,
      hashedPassword,
      userId,
    ]);
    if (!result.rows[0]) throw new ClientError(404, 'User not found');
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// ---------- SCHEDULES ----------

// GET all therapies for a user
app.get('/api/Schedules/:userId', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const sql = `
      SELECT * FROM "Schedules"
      WHERE "userId" = $1
      ORDER BY "scheduleId" DESC;
    `;
    const result = await db.query(sql, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching schedules:', err);
    next(err);
  }
});

// POST a new therapy schedule
app.post('/api/Schedules', authMiddleware, async (req, res, next) => {
  try {
    const { userId, therapyName, timeOfDay, daysOfWeek } = req.body;

    if (!userId || !therapyName || !timeOfDay || !daysOfWeek) {
      throw new ClientError(400, 'All fields required');
    }

    const sql = `
      INSERT INTO "Schedules" ("userId", "therapyName", "timeOfDay", "daysOfWeek")
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await db.query(sql, [
      userId,
      therapyName,
      timeOfDay,
      daysOfWeek,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Update Schedules
app.put('/api/Schedules/:scheduleId', async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const { therapyName, timeOfDay, daysOfWeek } = req.body;
    const sql = `
      UPDATE "Schedules"
      SET "therapyName" = $1,
          "timeOfDay" = $2,
          "daysOfWeek" = $3
      WHERE "scheduleId" = $4
      RETURNING *;
    `;
    const result = await db.query(sql, [
      therapyName,
      timeOfDay,
      daysOfWeek,
      scheduleId,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/Schedules/:scheduleId', async (req, res, next) => {
  try {
    const scheduleId = Number(req.params.scheduleId);
    if (!scheduleId) throw new ClientError(400, 'Invalid scheduleId');

    const sql = 'DELETE FROM "Schedules" WHERE "scheduleId" = $1 RETURNING *';
    const result = await db.query(sql, [scheduleId]);
    if (!result.rows[0]) throw new ClientError(404, 'Schedule not found');
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// ---------- TIME LIMITS ----------

// This endpoint fetches the screen time limit for a user by ID, only if authenticated.
app.get(
  '/api/TimeLimits/user/:userId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const userId = Number(req.params.userId);
      const sql = 'SELECT * FROM "TimeLimits" WHERE "userId" = $1';
      const result = await db.query(sql, [userId]);
      res.status(result.rows.length ? 200 : 404).json(result.rows[0] || null);
    } catch (err) {
      next(err);
    }
  }
);

// This endpoint creates a new screen time limit for a user.
app.post('/api/TimeLimits', authMiddleware, async (req, res, next) => {
  try {
    const { userId, hoursLimit, minutesLimit } = req.body;
    if (!userId || hoursLimit === undefined || minutesLimit === undefined)
      throw new ClientError(400, 'All fields required');

    const sql = `
      INSERT INTO "TimeLimits"("userId", "hoursLimit", "minutesLimit")
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await db.query(sql, [userId, hoursLimit, minutesLimit]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// This route updates an existing time limit entry in the TimeLimits table using the provided limitId and new values.
app.put('/api/TimeLimits/:limitId', authMiddleware, async (req, res, next) => {
  try {
    const limitId = Number(req.params.limitId); // converts limitId into a number.
    const { userId, hoursLimit, minutesLimit } = req.body;

    if (
      !limitId ||
      !userId ||
      hoursLimit === undefined ||
      minutesLimit === undefined
    ) {
      throw new ClientError(400, 'All fields required');
    }

    const sql = `
      UPDATE "TimeLimits"
      SET "userId" = $1,
          "hoursLimit" = $2,
          "minutesLimit" = $3
      WHERE "limitId" = $4
      RETURNING *;
    `;

    const result = await db.query(sql, [
      userId,
      hoursLimit,
      minutesLimit,
      limitId,
    ]);
    if (!result.rows[0]) throw new ClientError(404, 'TimeLimit not found');
    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.delete(
  '/api/TimeLimits/user/:userId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const userId = Number(req.params.userId);
      const sql = 'DELETE FROM "TimeLimits" WHERE "userId" = $1';
      await db.query(sql, [userId]);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
