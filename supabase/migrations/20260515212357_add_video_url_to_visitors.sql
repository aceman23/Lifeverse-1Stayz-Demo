/*
  # Add video_url to visitors

  1. Modified Tables
    - `visitors`
      - `video_url` (text, nullable) — URL of a pastor's personal video message for this visitor.
        Supports any browser-playable URL (MP4, WebM, OGG) or hosted embed link.

  2. Notes
    - No destructive changes; existing rows keep all data.
    - Column is nullable so profiles without a video work unchanged.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'visitors' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE visitors ADD COLUMN video_url text;
  END IF;
END $$;
