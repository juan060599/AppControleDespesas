-- Add subscription date fields to user_plans table
ALTER TABLE user_plans ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP DEFAULT NOW();
ALTER TABLE user_plans ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP;
ALTER TABLE user_plans ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT TRUE;

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_user_plans_active ON user_plans(user_id, active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_user_plans_end_date ON user_plans(subscription_end_date);
