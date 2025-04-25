/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { ClientError, errorMiddleware } from './lib/index.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

// **************** START OF USERS ************************

app.get('/api/Users', async (req, res, next) => {
  try {
    const sql = `
        SELECT *
        FROM "Users"
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Display User list
app.get('/api/Users/:userId', async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);

    if (!Number.isInteger(userId) || userId < 1) {
      throw new ClientError(400, 'userId must be a positive integer');
    }

    const sql = `
        SELECT *
        FROM "Users"
        WHERE "userId" = $1
    `;

    const result = await db.query(sql, [userId]);
    const user = result.rows[0];

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Create User
app.post('/api/Users', async (req, res, next) => {
  try {
    const { fullName, username, hashedPassword } = req.body;

    if (!fullName || !username || !hashedPassword) {
      throw new ClientError(400, 'All fields required');
    }

    const sql = `
    INSERT INTO "Users"("fullName", "username", "hashedPassword")
    VALUES ($1, $2, $3)
    RETURNING *;
    `;

    const params = [fullName, username, hashedPassword];
    const result = await db.query(sql, params);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Update Users
app.put('/api/Users/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { fullName, username, hashedPassword } = req.body;

    if (!Number(userId)) {
      throw new ClientError(400, 'userId must be a positive integer');
    }

    if (!fullName || !username || !hashedPassword) {
      throw new ClientError(400, 'All fields required');
    }

    const sql = `
    UPDATE "Users"
    SET "fullName" = $1,
    "username" = $2,
    "hashedPassword" = $3
    WHERE "userId" = $4
    RETURNING *;
    `;

    const params = [fullName, username, hashedPassword, userId];
    const result = await db.query(sql, params);

    if (!result.rows[0]) {
      throw new ClientError(404, `User with ${userId} ID not found`);
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Delete User
app.delete(`/api/Users/:userId`, async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!Number(+userId)) {
      throw new ClientError(400, `${userId} needs to be positive integer`);
    }

    const sql = `
    DELETE FROM "Users"
    WHERE "userId" = $1
    RETURNING *;
    `;

    const result = await db.query(sql, [userId]);

    if (!result.rows[0]) {
      throw new ClientError(404, `${userId} not found.`);
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// **************** START OF SCHEDULES ******************

app.get('/api/Schedules', async (req, res, next) => {
  try {
    const sql = `
        SELECT *
        FROM "Schedules"
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Display Schedules list
app.get('/api/Schedules/:scheduleId', async (req, res, next) => {
  try {
    const scheduleId = Number(req.params.scheduleId);

    if (!Number.isInteger(scheduleId) || scheduleId < 1) {
      throw new ClientError(400, 'scheduleId must be a positive integer');
    }

    const sql = `
        SELECT *
        FROM "Schedules"
        WHERE "scheduleId" = $1
    `;

    const result = await db.query(sql, [scheduleId]);
    const user = result.rows[0];

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Create Schedule
app.post('/api/Schedules', async (req, res, next) => {
  try {
    const { userId, therapyName, timeOfDay, daysOfWeek } = req.body;

    if (!userId || !therapyName || !timeOfDay || !daysOfWeek) {
      throw new ClientError(400, 'All fields required');
    }

    const sql = `
    INSERT INTO "Schedules"("userId","therapyName", "timeOfDay", "daysOfWeek")
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `;

    const params = [userId, therapyName, timeOfDay, daysOfWeek];
    const result = await db.query(sql, params);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Update Schedules
app.put('/api/Schedules/:scheduleId', async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const { userId, therapyName, timeOfDay, daysOfWeek } = req.body;

    if (!Number(scheduleId)) {
      throw new ClientError(400, 'scheduleId must be a positive integer');
    }

    if (!userId || !therapyName || !timeOfDay || !daysOfWeek) {
      throw new ClientError(400, 'All fields required');
    }

    const sql = `
    UPDATE "Schedules"
    SET "userId" = $1,
    "therapyName" = $2,
    "timeOfDay" = $3,
    "daysOfWeek" = $4
    WHERE "scheduleId" = $5
    RETURNING *;
    `;

    const params = [userId, therapyName, timeOfDay, daysOfWeek, scheduleId];
    const result = await db.query(sql, params);

    if (!result.rows[0]) {
      throw new ClientError(404, `Schedule with ${scheduleId} ID not found`);
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Delete Schedule
app.delete(`/api/Schedules/:scheduleId`, async (req, res, next) => {
  try {
    const { scheduleId } = req.params;

    if (!Number(+scheduleId)) {
      throw new ClientError(400, `${scheduleId} needs to be positive integer`);
    }

    const sql = `
    DELETE FROM "Schedules"
    WHERE "scheduleId" = $1
    RETURNING *;
    `;

    const result = await db.query(sql, [scheduleId]);

    if (!result.rows[0]) {
      throw new ClientError(404, `${scheduleId} not found.`);
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// **************** START OF TIME LIMIT ******************

app.get('/api/TimeLimits', async (req, res, next) => {
  try {
    const sql = `
        SELECT *
        FROM "TimeLimits"
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Display Time Limit List
app.get('/api/TimeLimits/:limitId', async (req, res, next) => {
  try {
    const limitId = Number(req.params.limitId);

    if (!Number.isInteger(limitId) || limitId < 1) {
      throw new ClientError(400, 'limitId must be a positive integer');
    }

    const sql = `
        SELECT *
        FROM "TimeLimits"
        WHERE "limitId" = $1
    `;

    const result = await db.query(sql, [limitId]);
    const user = result.rows[0];

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Create TimeLimits
app.post('/api/TimeLimits', async (req, res, next) => {
  try {
    const { userId, hoursLimit, minutesLimit } = req.body;

    if (
      !Number(userId) ||
      hoursLimit === undefined ||
      minutesLimit === undefined
    ) {
      throw new ClientError(400, 'All fields required');
    }

    const sql = `
    INSERT INTO "TimeLimits"("userId", "hoursLimit", "minutesLimit")
    VALUES ($1, $2, $3)
    RETURNING *;
    `;

    const params = [userId, hoursLimit, minutesLimit];
    const result = await db.query(sql, params);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Update TimeLimits
app.put('/api/TimeLimits/:limitId', async (req, res, next) => {
  try {
    const { limitId } = req.params;
    const { userId, hoursLimit, minutesLimit } = req.body;

    if (!Number.isInteger(Number(limitId)) || Number(limitId) < 1) {
      throw new ClientError(400, 'limitId must be a positive integer');
    }

    if (
      !Number(userId) ||
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

    const params = [userId, hoursLimit, minutesLimit, limitId];
    const result = await db.query(sql, params);

    if (!result.rows[0]) {
      throw new ClientError(404, `Time limit with ${limitId} ID not found`);
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Delete Time Limit
app.delete(`/api/TimeLimits/:limitId`, async (req, res, next) => {
  try {
    const { limitId } = req.params;

    if (!Number(+limitId)) {
      throw new ClientError(400, `${limitId} needs to be positive integer`);
    }

    const sql = `
    DELETE FROM "TimeLimits"
    WHERE "limitId" = $1
    RETURNING *;
    `;

    const result = await db.query(sql, [limitId]);

    if (!result.rows[0]) {
      throw new ClientError(404, `${limitId} not found.`);
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
