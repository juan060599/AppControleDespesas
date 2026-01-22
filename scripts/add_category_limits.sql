-- Add category_limits table for category spending limits
CREATE TABLE IF NOT EXISTS category_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  limit_amount NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, category)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_category_limits_user_id ON category_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_category_limits_user_category ON category_limits(user_id, category);

-- Enable Row Level Security
ALTER TABLE category_limits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for category_limits
CREATE POLICY "Users can only see their own category limits"
  ON category_limits
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own category limits"
  ON category_limits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own category limits"
  ON category_limits
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own category limits"
  ON category_limits
  FOR DELETE
  USING (auth.uid() = user_id);
