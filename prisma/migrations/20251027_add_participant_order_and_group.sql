-- Add participantOrder column to participants table
ALTER TABLE participants ADD COLUMN participant_order INTEGER;

-- Create index for efficient ordering queries
CREATE INDEX idx_participants_order ON participants(participant_order);

-- Update existing participants with sequential order (if any exist)
WITH ordered_participants AS (
  SELECT worker_id, ROW_NUMBER() OVER (ORDER BY worker_id) as order_num
  FROM participants
  WHERE participant_order IS NULL
)
UPDATE participants 
SET participant_order = ordered_participants.order_num
FROM ordered_participants 
WHERE participants.worker_id = ordered_participants.worker_id;

-- Update cond column based on participant_order for existing participants
UPDATE participants 
SET cond = CASE 
  WHEN participant_order % 4 = 1 THEN 1  -- Group A
  WHEN participant_order % 4 = 2 THEN 2  -- Group B  
  WHEN participant_order % 4 = 3 THEN 3  -- Group C
  WHEN participant_order % 4 = 0 THEN 4  -- Group D
END
WHERE participant_order IS NOT NULL AND cond IS NULL;
