export function calculateCommitmentPoints(context: {
  isEarlyCommit: boolean
}): number {
  let points = 10
  if (context.isEarlyCommit) points += 15
  return points
}

export function isEarlyCommit(current: number, target: number): boolean {
  return current < target * 0.1
}
