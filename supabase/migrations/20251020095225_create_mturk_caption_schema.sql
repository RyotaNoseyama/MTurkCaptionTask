/*
  # MTurk Caption Collection Schema

  1. New Tables
    - `participants`
      - `worker_id` (text, primary key) - MTurk worker identifier
      - `cond` (int, nullable) - Experimental condition (0-3)
      - `tz` (text, nullable) - Worker timezone
      - `consent_at` (timestamptz, nullable) - Consent timestamp
    
    - `days`
      - `id` (text, primary key) - CUID identifier
      - `idx` (int, unique) - Sequential day index
      - `date_et` (timestamptz) - ET midnight for this day
    
    - `submissions`
      - `id` (text, primary key) - CUID identifier
      - `worker_id` (text) - Foreign key to participants
      - `day_idx` (int) - Day index when submitted
      - `caption_a` (text) - First caption
      - `caption_b` (text) - Second caption
      - `rt_ms` (int, nullable) - Response time in milliseconds
      - `submitted_at` (timestamptz) - Submission timestamp
      - Unique constraint on (worker_id, day_idx)
    
    - `scores`
      - `id` (text, primary key) - CUID identifier
      - `submission_id` (text, unique) - Foreign key to submissions
      - `worker_id` (text) - Foreign key to participants
      - `score` (int) - Score value (0-10)
      - `is_7plus` (boolean) - Whether score >= 7
      - `scored_at` (timestamptz) - When scored
      - `scorer` (text, nullable) - Scorer identifier/memo

  2. Security
    - RLS disabled for MVP (external auth via MTurk params)
    - Foreign key constraints ensure referential integrity
*/

CREATE TABLE IF NOT EXISTS participants (
  worker_id text PRIMARY KEY,
  cond int,
  tz text,
  consent_at timestamptz
);

CREATE TABLE IF NOT EXISTS days (
  id text PRIMARY KEY,
  idx int UNIQUE NOT NULL,
  date_et timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS submissions (
  id text PRIMARY KEY,
  worker_id text NOT NULL REFERENCES participants(worker_id),
  day_idx int NOT NULL,
  caption_a text NOT NULL,
  caption_b text NOT NULL,
  rt_ms int,
  submitted_at timestamptz DEFAULT now(),
  UNIQUE(worker_id, day_idx)
);

CREATE INDEX IF NOT EXISTS idx_submissions_day ON submissions(day_idx);
CREATE INDEX IF NOT EXISTS idx_submissions_worker ON submissions(worker_id);

CREATE TABLE IF NOT EXISTS scores (
  id text PRIMARY KEY,
  submission_id text UNIQUE NOT NULL REFERENCES submissions(id),
  worker_id text NOT NULL REFERENCES participants(worker_id),
  score int NOT NULL CHECK (score >= 0 AND score <= 10),
  is_7plus boolean DEFAULT false,
  scored_at timestamptz DEFAULT now(),
  scorer text
);

CREATE INDEX IF NOT EXISTS idx_scores_day ON scores(worker_id);
