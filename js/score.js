/**
 * Calculate match percentage between player grid and target grid.
 * Compares only cells where target is defined and player is not null.
 */
export function calculateMatch(playerGrid, targetGrid) {
  if (!playerGrid || !targetGrid || playerGrid.length === 0) return 0;
  const rows = playerGrid.length;
  const cols = playerGrid[0].length;
  let correct = 0;
  let total = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (targetGrid[r] && targetGrid[r][c] !== undefined) {
        if (playerGrid[r] && playerGrid[r][c] !== null && playerGrid[r][c] !== undefined) {
          total++;
          if (playerGrid[r][c] === targetGrid[r][c]) {
            correct++;
          }
        }
      }
    }
  }

  return total === 0 ? 0 : Math.round((correct / total) * 100);
}

/**
 * Return array of [row, col] pairs where player differs from target.
 */
export function getMismatchedCells(playerGrid, targetGrid) {
  const mismatches = [];
  for (let r = 0; r < playerGrid.length; r++) {
    for (let c = 0; c < (playerGrid[r]?.length || 0); c++) {
      const pc = playerGrid[r][c];
      const tc = targetGrid[r]?.[c];
      if (pc !== tc) {
        mismatches.push([r, c]);
      }
    }
  }
  return mismatches;
}
