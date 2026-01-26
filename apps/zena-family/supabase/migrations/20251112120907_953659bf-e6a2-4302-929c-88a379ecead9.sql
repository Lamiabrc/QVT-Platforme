-- Add push notification support to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS push_token TEXT,
ADD COLUMN IF NOT EXISTS platform TEXT CHECK (platform IN ('ios', 'android', 'web'));

-- Add index for faster lookups by push_token
CREATE INDEX IF NOT EXISTS idx_profiles_push_token ON profiles(push_token) WHERE push_token IS NOT NULL;

-- Add comments to document the new columns
COMMENT ON COLUMN profiles.push_token IS 'Device push notification token for native apps (FCM for Android, APNS for iOS)';
COMMENT ON COLUMN profiles.platform IS 'Platform type: ios, android, or web - used to determine which push notification service to use';