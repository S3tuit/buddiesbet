ALTER TABLE "Player"
ADD CONSTRAINT ruby_amount_positive CHECK ("rubyAmount" > 0),
ADD CONSTRAINT crystal_ball_positive CHECK ("crystalBallAmount" > 0);
