-- AI Analytics Chat History Table
-- Stores the conversation history for AI Analytics queries

CREATE TABLE IF NOT EXISTS ai_analytics_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  sql_executed TEXT,
  insights JSONB NOT NULL,
  raw_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_ai_analytics_history_user_id ON ai_analytics_history(user_id);

-- Index for sorting by date
CREATE INDEX IF NOT EXISTS idx_ai_analytics_history_created_at ON ai_analytics_history(created_at DESC);

-- RLS Policies for security
ALTER TABLE ai_analytics_history ENABLE ROW LEVEL SECURITY;

-- Superadmins can view all history
CREATE POLICY "Superadmins can view all AI analytics history"
  ON ai_analytics_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'superadmin'
    )
  );

-- Superadmins can insert their own queries
CREATE POLICY "Superadmins can insert AI analytics history"
  ON ai_analytics_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'superadmin'
    )
    AND user_id = auth.uid()
  );

-- Superadmins can delete their own history
CREATE POLICY "Superadmins can delete their own AI analytics history"
  ON ai_analytics_history
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'superadmin'
    )
  );

-- Grant permissions
GRANT SELECT, INSERT, DELETE ON ai_analytics_history TO authenticated;

-- Add comment
COMMENT ON TABLE ai_analytics_history IS 'Stores AI Analytics conversation history for superadmins';
