ALTER TABLE "Player"
DROP CONSTRAINT IF EXISTS ruby_amount_positive,
DROP CONSTRAINT IF EXISTS crystal_ball_positive;

ALTER TABLE "Player"
ADD CONSTRAINT ruby_amount_positive CHECK ("rubyAmount" >= 0),
ADD CONSTRAINT crystal_ball_positive CHECK ("crystalBallAmount" >= 0);
