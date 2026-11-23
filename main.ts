// Dad Joke Showdown — a single dad joke, written out by this program.
//
// The whole entry is one joke: it is printed here, saved to
// <output dir>/entry.txt, and then read back so the file on disk can be
// compared with the joke in this source. If anything differs, the run
// fails instead of handing in a half-written entry.
//
// Rules the joke itself has to follow (checked below before writing):
//   - between 1 and 200 characters long, counting code points
//   - exactly one line, no line breaks inside it
//   - exactly one sentence, ending in a single full stop
//   - no trailing newline in the output file
//
// The code below uses only syntax plain Node can read as-is, so both
// `node main.ts` and `node --check main.ts` work with no extra tooling.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE =
  "I went to the dentist for a filling, but he gave me a lecture about flossing instead, so technically it was a cavity search.";

const MAX_LENGTH = 200;

function abort(reason) {
  console.error(`dad-joke-showdown: ${reason}`);
  process.exit(1);
}

function checkShape(text) {
  const points = [...text];
  if (points.length < 1 || points.length > MAX_LENGTH) {
    abort(`joke must be 1-${MAX_LENGTH} characters, got ${points.length}`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    abort("joke must be a single line");
  }
  const stops = [...text].filter((ch) => ch === ".").length;
  if (stops !== 1 || !text.endsWith(".")) {
    abort("joke must be exactly one sentence ending in a full stop");
  }
}

function main() {
  checkShape(JOKE);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });

  const target = join(outDir, "entry.txt");
  writeFileSync(target, JOKE, "utf8");

  const back = readFileSync(target, "utf8");
  if (back !== JOKE) {
    abort("entry.txt on disk does not match the joke in this source");
  }
  if (back.endsWith("\n")) {
    abort("entry.txt must not end with a trailing newline");
  }

  console.log(
    `wrote entry.txt (${[...JOKE].length} characters, ` +
      `${Buffer.byteLength(back, "utf8")} bytes, 1 sentence)`,
  );
}

main();
