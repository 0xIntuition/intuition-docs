const fs = require('fs');
const path = require('path');
const grayMatter = require('gray-matter');

const mdxDirectory = path.join(__dirname, 'docs');

const prefixes = {
  'community-packages': 'Community Packages',
  'protocol-sdk': 'Protocol SDK',
  'graphql-sdk': 'GraphQL SDK',
  '1ui SD': '1UI SDK',
};

let count = 0;

for (const section of Object.keys(prefixes)) {
  const sectionDirectory = path.join(mdxDirectory, section);

  for (const file of getFiles(sectionDirectory)) {
    if (file.endsWith('.mdx') || file.endsWith('.md')) {
      const filePath = path.join(mdxDirectory, file);

      const fileContent = fs.readFileSync(filePath, 'utf8');

      const { data, content } = grayMatter(fileContent);

      const existingTitle = data.title;

      const headingMatch = content.match(/^# (.*)/m);
      if (!headingMatch && !existingTitle) {
        console.log(
          `File ${filePath} does not have an H1 heading. Skipping...`,
        );
        continue;
      }

      const title = existingTitle || headingMatch[1];

      const prefix = prefixes[section];

      let updatedTitle =
        section === 'guides' ? `${title} ${prefix}` : `${prefix} ${title}`;

      if (filePath.includes('/components/')) {
        data.description = `Learn how to use and customize the ${title} component in Intuition's ${prefix} with our detailed documentation.`;
      }

      const updatedContent = [
        '\n\n<head>',
        `\t<title>${updatedTitle}</title>`,
        '</head>',
      ];

      const updatedFileContent = grayMatter.stringify(
        content + updatedContent.join('\n'),
        data,
      );
      fs.writeFileSync(filePath, updatedFileContent);

      console.log(`Updated front matter for file ${filePath}`);
      count++;
    }
  }
}

function getFiles(dir) {
  let results = [];
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else {
      results.push(path.relative(mdxDirectory, filePath));
    }
  }
  return results;
}

console.log(`Updated ${count} files.`);
