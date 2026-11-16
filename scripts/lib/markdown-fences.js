'use strict';

// V2 fences accept either Markdown delimiter. A shorter or different delimiter
// is code, not a close; an outer example fence owns everything inside it.
function readCodeFences(source) {
  const lines = [];
  let offset = 0;
  for (const raw of source.match(/[^\n]*(?:\n|$)/g) || []) {
    if (!raw) continue;
    lines.push({
      start: offset,
      end: offset + raw.length,
      text: raw.replace(/\r?\n$/, ''),
    });
    offset += raw.length;
  }
  const fences = [];
  for (let index = 0; index < lines.length; index++) {
    const opening = lines[index].text.match(/^[ \t]*(`{3,}|~{3,})(.*)$/);
    if (!opening || (opening[1][0] === '`' && opening[2].includes('`')))
      continue;
    const close = new RegExp(
      `^[ \\t]*${opening[1][0]}{${opening[1].length},}[ \\t]*$`,
    );
    let end = index + 1;
    while (end < lines.length && !close.test(lines[end].text)) end++;
    const rawCode = source.slice(
      lines[index].end,
      lines[end]?.start ?? source.length,
    );
    fences.push({
      info: opening[2].trim(),
      fenceLine: index + 1,
      previousLine: lines[index - 1]?.text.trim(),
      code: lines
        .slice(index + 1, end)
        .map((line) => line.text)
        .join('\n'),
      rawCode,
      closed: end < lines.length,
      start: lines[index].start,
      end: lines[end]?.end ?? source.length,
    });
    index = end;
  }
  return fences;
}

const INTUITION_IMPORT_PATTERN =
  /(?:import|require)\b[\s\S]*?['"]@0xintuition\//;

module.exports = { readCodeFences, INTUITION_IMPORT_PATTERN };
