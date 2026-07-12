type CoverageCanaryTournament = {
  entryFeeCents: number;
  playerCount: number;
  isRated: boolean;
};

export function calculateCoverageCanaryPrizePool(
  tournament: CoverageCanaryTournament,
): number {
  const grossPrizePool = tournament.entryFeeCents * tournament.playerCount;
  const platformFee = tournament.isRated
    ? Math.round(grossPrizePool * 0.1)
    : Math.round(grossPrizePool * 0.05);

  return grossPrizePool - platformFee;
}

export function getCoverageCanaryTournamentSize(playerCount: number): string {
  if (playerCount >= 128) {
    return 'large';
  }

  if (playerCount >= 32) {
    return 'medium';
  }

  return 'small';
}
