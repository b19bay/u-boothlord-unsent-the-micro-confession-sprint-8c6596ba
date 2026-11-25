// Unsent: The Micro-Confession Sprint — u-boothlord-unsent-the-micro-confession-sprint-8c6596ba
// Writes one two-part micro-confession (a To: line and the unsent message itself)
// to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Erasable TypeScript, stdlib only. No clock, no randomness, no network, no env secrets.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "To: my brother\n" +
  "I still have the bike you left at my place the summer you moved away. I ride it to work and I never told you I kept it.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

mkdirSync(outDir, { recursive: true });

// Runtime gate: the sealed scorer accepts UTF-8 text of 1-260 characters,
// not only white space; the message line itself is at most 200 characters.
// Fail loudly here, not at grade time.
const codePoints = [...ENTRY].length;
if (codePoints < 1 || codePoints > 260) {
  throw new Error(`entry is ${codePoints} characters, must be 1-260`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
const lines = ENTRY.split("\n");
if (lines.length !== 2 || !lines[0].startsWith("To: ")) {
  throw new Error("entry must be exactly a To: line plus one message line");
}
if ([...lines[1]].length > 200) {
  throw new Error("message line must be at most 200 characters");
}

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read-back check: what landed on disk must be byte-identical to the entry,
// and the byte count is pinned because ties break on fewer bytes.
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) {
  throw new Error("read-back mismatch: entry.txt differs from the entry");
}
if (Buffer.byteLength(back, "utf8") !== 134) {
  throw new Error("entry must be exactly 134 bytes");
}
