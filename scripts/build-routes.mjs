import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

// Real route entry files support direct visits on static hosts without a rewrite rule.
const root = resolve(import.meta.dirname, '..');
const pages = JSON.parse(await readFile(resolve(root, 'src/content.json'), 'utf8'));
const template = await readFile(resolve(root, 'dist/index.html'), 'utf8');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const entries = { ...pages, '/reflections/': { title: 'LifeWise Reflections', excerpt: 'Thoughts on relationships, identity, emotional wellbeing, and the work of finding your way.' } };
for (const [route, page] of Object.entries(entries)) {
  const directory = resolve(root, 'dist', route.slice(1));
  await mkdir(directory, { recursive: true });
  const document = template
    .replace(/<title>.*?<\/title>/, `<title>${escape(page.title)} | LifeWise Counseling</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escape(page.excerpt.slice(0, 180))}" />`);
  await writeFile(resolve(directory, 'index.html'), document);
}
await writeFile(resolve(root, 'dist/404.html'), template);
await mkdir(resolve(root, 'dist/featured-in-the-dallas-voyager'), { recursive: true });
await writeFile(resolve(root, 'dist/featured-in-the-dallas-voyager/index.html'), template);
console.log(`Generated ${Object.keys(entries).length} page entries for static hosting.`);
