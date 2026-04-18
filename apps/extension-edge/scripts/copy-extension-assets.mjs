import { copyFileSync, cpSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = resolve(root, 'dist');
if (!existsSync(dist)) mkdirSync(dist, { recursive: true });

copyFileSync(resolve(root, 'manifest.json'), resolve(dist, 'manifest.json'));
copyFileSync(resolve(root, 'background.js'), resolve(dist, 'background.js'));
cpSync(resolve(root, 'icons'), resolve(dist, 'icons'), { recursive: true });
