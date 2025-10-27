-- submissionsテーブルにcompletion_codeカラムを追加するSQL

-- 1. カラムを追加（NULLを許可）
ALTER TABLE submissions 
ADD COLUMN completion_code VARCHAR(20);

-- 2. インデックスを追加（検索性能向上のため、オプション）
CREATE INDEX idx_submissions_completion_code ON submissions(completion_code);

-- 3. コメント追加（オプション）
COMMENT ON COLUMN submissions.completion_code IS 'MTurk completion code for successful submissions';
