// Checks every cached board's YAML logic blocks for dangling downstream/upstream
// targets — a reference to a concept that isn't actually a tile on that board.
// Run via `npm run validate:boards`; wired into `npm run build` so a broken
// board reference can't reach deploy silently.
import { CACHED_BOARDS } from "../src/cachedData";

const parseLogicFields = (logic?: string): Record<string, string> | null => {
  if (!logic) return null;
  const fields: Record<string, string> = {};
  const lineRe = /^\s*(seed|mechanism|evidence|downstream|upstream|contrasts_with|scope|is_a)\s*:\s*"?([^"\n]+?)"?\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = lineRe.exec(logic)) !== null) {
    fields[m[1]] = m[2].trim();
  }
  return Object.keys(fields).length > 0 ? fields : null;
};

let problems = 0;

for (const [boardId, board] of Object.entries(CACHED_BOARDS)) {
  const allTiles = [...board.tiles, ...(board.cachedExpansion ?? [])];
  const words = new Set(allTiles.map(t => t.word));

  for (const tile of allTiles) {
    const fields = parseLogicFields(tile.logic);
    if (!fields) continue;
    for (const key of ["downstream", "upstream", "contrasts_with"] as const) {
      const value = fields[key];
      if (!value) continue;
      for (const target of value.split(",").map(t => t.trim())) {
        if (!words.has(target)) {
          console.error(`DANGLING: [${boardId}] "${tile.word}" -> ${key}: "${target}" is not a tile on this board`);
          problems++;
        }
      }
    }
  }
}

if (problems > 0) {
  console.error(`\n${problems} dangling reference(s) found.`);
  process.exit(1);
} else {
  console.log(`All boards clean: every downstream/upstream/contrasts_with target is a real tile on its own board.`);
}
