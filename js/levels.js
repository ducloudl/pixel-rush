// Pixel Rush - Level Data & Pattern Generator
// Color palette (10 colors, indexed 0-9)
export const PALETTE = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#FF9FF3',
];

// Level progression: [colors, gridSize, time]
const LEVEL_TABLE = [
  { colors: 3, gridSize: 10, time: 60 },
  { colors: 3, gridSize: 12, time: 55 },
  { colors: 4, gridSize: 14, time: 55 },
  { colors: 4, gridSize: 16, time: 50 },
  { colors: 6, gridSize: 20, time: 45 },
  { colors: 6, gridSize: 22, time: 45 },
  { colors: 7, gridSize: 25, time: 40 },
  { colors: 8, gridSize: 28, time: 35 },
  { colors: 9, gridSize: 30, time: 30 },
  { colors: 9, gridSize: 30, time: 30 },
];

/**
 * Get level configuration for a given level number (1-10).
 */
export function generateLevel(levelNum) {
  const idx = Math.min(Math.max(levelNum - 1, 0), LEVEL_TABLE.length - 1);
  return { ...LEVEL_TABLE[idx] };
}

// Seeded PRNG (mulberry32) for deterministic patterns
function seededRandom(seed) {
  let s = seed | 0;
  return function() {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * Generate a deterministic pixel pattern for the given level.
 * Returns a 2D array of color indices (0-based).
 */
export function getPattern(levelNum) {
  const lvl = generateLevel(levelNum);
  const size = lvl.gridSize;
  const rng = seededRandom(levelNum * 1000 + 42);
  const pattern = [];
  for (let r = 0; r < size; r++) {
    pattern[r] = [];
    for (let c = 0; c < size; c++) {
      pattern[r][c] = Math.floor(rng() * lvl.colors);
    }
  }
  return pattern;
}
