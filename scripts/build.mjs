/**
 * Replaces the former Gulp pipeline:
 * - es5: transpile src/*.es6.js → dist/*.js and dist/*.min.js (minified gets package banner)
 * - default: run es5, copy src/*.es6.js to dist, copy/minify src/*.js excluding *.es6.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { transformSync } from '@babel/core';
import { minify } from 'uglify-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcDir = path.join(root, 'src');
const distDir = path.join(root, 'dist');

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const banner = `/**
 * ${pkg.name} - ${pkg.description}
 * @version v${pkg.version}
 * @link ${pkg.homepage}
 * @license ${pkg.license} : https://github.com/nico3333fr/van11y-accessible-modal-window-aria/blob/master/LICENSE
 */
`;

const es5Only = process.argv.includes('--es5-only');

function listJsFiles() {
  return fs.readdirSync(srcDir).filter((f) => f.endsWith('.js'));
}

function transpileEs6Files() {
  const es6Files = listJsFiles().filter((f) => f.endsWith('.es6.js'));
  for (const f of es6Files) {
    const srcPath = path.join(srcDir, f);
    const code = fs.readFileSync(srcPath, 'utf8');
    const outName = f.replace(/\.es6\.js$/, '.js');
    const { code: transpiled } = transformSync(code, {
      filename: f,
      cwd: root,
      sourceType: 'script',
    });
    fs.writeFileSync(path.join(distDir, outName), transpiled, 'utf8');

    const minResult = minify(transpiled);
    if (minResult.error) {
      throw minResult.error;
    }
    const minName = outName.replace(/\.js$/, '.min.js');
    fs.writeFileSync(path.join(distDir, minName), banner + minResult.code, 'utf8');
  }
}

function copyEs6SourcesToDist() {
  const es6Files = listJsFiles().filter((f) => f.endsWith('.es6.js'));
  for (const f of es6Files) {
    fs.copyFileSync(path.join(srcDir, f), path.join(distDir, f));
  }
}

function copyAndMinifyPlainJs() {
  const plain = listJsFiles().filter((f) => !f.endsWith('.es6.js'));
  for (const f of plain) {
    const code = fs.readFileSync(path.join(srcDir, f), 'utf8');
    fs.writeFileSync(path.join(distDir, f), code, 'utf8');
    const minResult = minify(code);
    if (minResult.error) {
      throw minResult.error;
    }
    const base = f.replace(/\.js$/, '');
    fs.writeFileSync(path.join(distDir, `${base}.min.js`), banner + minResult.code, 'utf8');
  }
}

fs.mkdirSync(distDir, { recursive: true });

transpileEs6Files();

if (!es5Only) {
  copyEs6SourcesToDist();
  copyAndMinifyPlainJs();
}
