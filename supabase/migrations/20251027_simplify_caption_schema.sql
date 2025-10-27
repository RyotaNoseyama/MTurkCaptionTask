-- Simplify caption schema to use only caption_a field
-- Remove caption_b, scoreB, and unused caption field

-- Drop caption_b column
ALTER TABLE public.submissions DROP COLUMN IF EXISTS caption_b;

-- Drop score_b column  
ALTER TABLE public.submissions DROP COLUMN IF EXISTS score_b;

-- Drop unused caption column (keep caption_a as the main caption field)
ALTER TABLE public.submissions DROP COLUMN IF EXISTS caption;

-- Rename caption_a to caption for clarity (optional, but cleaner)
-- ALTER TABLE public.submissions RENAME COLUMN caption_a TO caption;

-- If you want to keep caption_a as is, no need for the rename above
