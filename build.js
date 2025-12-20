const ejs = require('ejs');
const fs = require('fs-extra');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'pages');
const outDir = __dirname; // Output to root

async function build() {
    try {
        // Ensure source exists
        if (!fs.existsSync(srcDir)) {
            console.error('Source directory not found:', srcDir);
            return;
        }

        // Get all .ejs files in src/pages
        const files = await fs.readdir(srcDir);
        const templates = files.filter(file => file.endsWith('.ejs'));

        for (const template of templates) {
            const filePath = path.join(srcDir, template);
            const fileName = path.basename(template, '.ejs');
            const outFile = path.join(outDir, `${fileName}.html`);

            console.log(`Compiling ${template} to ${fileName}.html...`);

            const data = {
                // Common data can go here
                year: new Date().getFullYear()
            };

            const html = await ejs.renderFile(filePath, data, {
                root: path.join(__dirname, 'src') // Allow absolute include paths like /partials/head
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
