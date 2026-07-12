type CanaryPlayer = {
  rating: number;
  gamesPlayed: number;
  hasVerifiedAccount: boolean;
};

export function calculateCoverageCanaryScore(player: CanaryPlayer): number {
  const ratingBonus = player.rating >= 2000 ? 25 : 10;
  const experienceBonus = player.gamesPlayed >= 50 ? 15 : 5;
  const verificationBonus = player.hasVerifiedAccount ? 20 : 0;

  return ratingBonus + experienceBonus + verificationBonus;
}

export function getCoverageCanaryBucket(score: number): string {
  if (score >= 50) {
    return 'ready';
  }

  if (score >= 30) {
    return 'warming-up';
  }

  return 'newcomer';
}
