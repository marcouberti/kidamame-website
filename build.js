const ejs = require('ejs');
const fs = require('fs-extra');
const path = require('path');
const guidesMeta = require('./src/data/guides-meta');

const srcDir = path.join(__dirname, 'src', 'pages');
const outDir = __dirname; // Output to root

async function getEjsFiles(dir, baseDir = dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    let results = [];
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const nested = await getEjsFiles(fullPath, baseDir);
            results = results.concat(nested);
        } else if (entry.isFile() && entry.name.endsWith('.ejs')) {
            results.push(path.relative(baseDir, fullPath));
        }
    }
    return results;
}

async function build() {
    try {
        // Ensure source exists
        if (!fs.existsSync(srcDir)) {
            console.error('Source directory not found:', srcDir);
            return;
        }

        // Get all .ejs files in src/pages (including subdirectories like guides/)
        const templates = await getEjsFiles(srcDir);

        for (const relTemplate of templates) {
            const filePath = path.join(srcDir, relTemplate);
            const relDir = path.dirname(relTemplate);
            const fileName = path.basename(relTemplate, '.ejs');

            let outFile;
            if (fileName === 'index') {
                const targetDir = relDir === '.' ? outDir : path.join(outDir, relDir);
                await fs.ensureDir(targetDir);
                outFile = path.join(targetDir, 'index.html');
                console.log(`Compiling ${relTemplate} to ${path.relative(outDir, outFile)}...`);
            } else {
                const subDir = relDir === '.'
                    ? path.join(outDir, fileName)
                    : path.join(outDir, relDir, fileName);
                await fs.ensureDir(subDir);
                outFile = path.join(subDir, 'index.html');
                console.log(`Compiling ${relTemplate} to ${path.relative(outDir, outFile)}...`);
            }

            const data = {
                year: new Date().getFullYear(),
                guides: guidesMeta
            };

            const html = await ejs.renderFile(filePath, data, {
                root: path.join(__dirname, 'src')
            });

            await fs.writeFile(outFile, html);
            console.log(`Generated ${outFile}`);
        }
        
        console.log('Build completed successfully.');
    } catch (err) {
        console.error('Build failed:', err);
        process.exit(1);
    }
}

build();
