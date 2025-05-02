set client_min_messages to warning;

-- -- DANGER: this is NOT how to do it in the real world.
-- -- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";


CREATE TABLE "public"."Users" (
  "userId"          SERIAL PRIMARY KEY,
  "fullName"        text NOT NULL,
  "username"        text NOT NULL unique,
  "hashedPassword"  text NOT NULL,
  "role"            VARCHAR(10) NOT NULL DEFAULT 'kid',
  "createdAt"       timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "Schedules" (
  "scheduleId"      SERIAL PRIMARY KEY,
  "userId"          int NOT NULL,
  "therapyName"     text NOT NULL,
  "timeOfDay"       text NOT NULL,
  "daysOfWeek"      text NOT NULL,
  "createdAt"       timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "TimeLimits" (
  "limitId"         SERIAL PRIMARY KEY,
  "userId"          int NOT NULL,
  "hoursLimit"      int NOT NULL,
  "minutesLimit"    int NOT NULL,
  "createdAt"       timestamptz NOT NULL DEFAULT (now())
);

ALTER TABLE "Schedules" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");

ALTER TABLE "TimeLimits" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");
