'use strict';

const { parseMarkdownCode, readFrontMatter } = require('../markdown-fences');

const { readExampleGrid } = require('../example-cards');

function readPage(doc) {
  const parsed = parseMarkdownCode(doc.content, { filePath: doc.relativePath });
  let prose = parsed.source;
  for (const fence of [...parsed.fences].reverse())
    prose = prose.slice(0, fence.start) + '\n' + prose.slice(fence.end);
  readFrontMatter(prose);
  prose = prose
    .replace(/^\uFEFF?---[^\r\n]*\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '')
    .replace(/<!--(?:[\s\S]*?)-->|\{\/\*[\s\S]*?\*\/\}/g, '');
  const headings = [
    ...prose.matchAll(/^ {0,3}(#{2,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/gm),
  ].map((match) => ({
    depth: match[1].length,
    text: match[2],
    start: match.index,
    end: match.index + match[0].length,
  }));
  function section(title, depth = 2) {
    const heading = headings.find(
      (item) => item.depth === depth && item.text === title,
    );
    if (!heading) return '';
    const next = headings.find(
      (item) => item.start > heading.start && item.depth <= depth,
    );
    return prose.slice(heading.end, next?.start ?? prose.length);
  }
  const exampleGrid =
    doc.id === 'examples/index' ? readExampleGrid(parsed) : null;
  return { prose, headings, section, fences: parsed.fences, exampleGrid };
}

function links(text) {
  // Consume inline code first, except inside a genuine Markdown link label.
  const tokens = text.matchAll(
    /(`+)[\s\S]*?\1|(?<!!)\[([^\]\n]+)\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g,
  );
  return Array.from(tokens)
    .filter((match) => match[2])
    .map((match) => ({ label: match[2], target: match[3] }));
}

function routeLinks(text) {
  return links(text)
    .filter(({ target }) => target.startsWith('/'))
    .map(({ target }) => target.split(/[?#]/)[0].replace(/\/$/, ''));
}

function tables(text) {
  const result = [];
  const lines = text.split(/\r?\n/);
  const cells = (line) =>
    line
      .trim()
      .replace(/^\||\|$/g, '')
      .split(/(?<!\\)\|/)
      .map((value) => value.trim().replace(/\\\|/g, '|'));
  for (let i = 0; i + 1 < lines.length; i++) {
    if (!lines[i].includes('|')) continue;
    const headings = cells(lines[i]);
    const delimiter = cells(lines[i + 1]);
    if (
      delimiter.length !== headings.length ||
      !delimiter.every((cell) => /^:?-+:?$/.test(cell))
    )
      continue;
    const rows = [headings];
    i++;
    while (i + 1 < lines.length && lines[i + 1].includes('|'))
      rows.push(cells(lines[++i]));
    result.push(rows);
  }
  return result;
}

function parseDiagram(code) {
  const nodes = new Map();
  const edges = [];
  const errors = [];
  const lines = code
    .split(/\r?\n/)
    .map((line) => line.replace(/%%.*$/, '').trim())
    .filter(Boolean);
  const direction = lines.shift();
  if (!/^(?:graph|flowchart)\s+(?:BT|TB|TD|LR|RL)$/.test(direction || ''))
    errors.push('expected a Mermaid graph direction');
  const node = /^([A-Za-z_][\w-]*)(?:\["([^"\n]+)"\]|\[([^\]\n]+)\])?/;
  for (let line of lines) {
    line = line.replace(/;$/, '');
    let previous;
    while (line) {
      const match = line.match(node);
      if (!match) {
        errors.push(`unsupported Mermaid statement: ${line}`);
        break;
      }
      const [, id, quoted, plain] = match;
      const label = quoted ?? plain;
      if (
        label &&
        nodes.has(id) &&
        nodes.get(id) !== id &&
        nodes.get(id) !== label
      )
        errors.push(`conflicting Mermaid label: ${id}`);
      nodes.set(id, label || nodes.get(id) || id);
      if (previous)
        edges.push({ from: previous.id, to: id, kind: previous.kind });
      line = line.slice(match[0].length).trim();
      if (!line) break;
      const arrow = line.match(/^(-->|-\.->)\s*/);
      if (!arrow) {
        errors.push(`unsupported Mermaid edge: ${line}`);
        break;
      }
      previous = { id, kind: arrow[1] };
      line = line.slice(arrow[0].length);
      if (!line) errors.push(`missing Mermaid target after ${id}`);
    }
  }
  return { direction, nodes, edges, errors };
}

module.exports = { readPage, links, routeLinks, tables, parseDiagram };
