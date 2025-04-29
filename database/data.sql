-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

insert into "Users" ("fullName", "username", "hashedPassword", "role", "createdAt")
values
  ('Mike', 'mikep', 'password123', 'parent', now()),
  ('Matt', 'mattp', 'qwerty123', 'deleted', now()),
  ('Jayz', 'jayz', 'zxcvb123', 'parent', now());


insert into "Schedules" ("userId", "therapyName", "timeOfDay", "daysOfWeek", "createdAt")
values
  (2, 'Speech Therapy', '10:00 AM', 'Friday', now()),
  (2, 'Occupational Therapy', '2:00 PM', 'Tuesday', now()),
  (2, 'Physical Therapy', '9:30 AM', 'Monday', now()),
  (2, 'Behavioral Therapy', '3:00 PM', 'Thursday', now());


insert into "TimeLimits" ("userId", "hoursLimit", "minutesLimit", "createdAt")
values
  (2, 1, 30, now()), /* 1 hr 30 mins */
  (2, 2, 0, now()),  /* 2 hrs */
  (2, 0, 45, now()); /* 45 mins */
