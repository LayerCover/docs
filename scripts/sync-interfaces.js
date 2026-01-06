const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '../content/v2/en/contracts');
const INTERFACES_DIR = path.join(__dirname, '../../monorepo/packages/contracts/contracts/interfaces');

function syncInterfaces() {
    console.log('Starting interface synchronization...');

    if (!fs.existsSync(DOCS_DIR)) {
        console.error(`Docs directory not found: ${DOCS_DIR}`);
        process.exit(1);
    }

    if (!fs.existsSync(INTERFACES_DIR)) {
        console.error(`Interfaces directory not found: ${INTERFACES_DIR}`);
        process.exit(1);
    }

    const mdxFiles = fs.readdirSync(DOCS_DIR).filter(file => file.endsWith('.mdx') && file !== 'index.mdx');

    mdxFiles.forEach(mdxFile => {
        const interfaceName = path.basename(mdxFile, '.mdx');
        const solFile = `${interfaceName}.sol`;
        const solPath = path.join(INTERFACES_DIR, solFile);

        if (fs.existsSync(solPath)) {
            try {
                const solContent = fs.readFileSync(solPath, 'utf8');
                const mdxPath = path.join(DOCS_DIR, mdxFile);
                let mdxContent = fs.readFileSync(mdxPath, 'utf8');

                // Regex to match the solidity code block
                // Matches ```solidity ... ``` (non-greedy)
                const regex = /```solidity[\s\S]*?```/;

                if (regex.test(mdxContent)) {
                    const newBlock = `\`\`\`solidity\n${solContent}\`\`\``;
                    const newMdxContent = mdxContent.replace(regex, newBlock);

                    if (mdxContent !== newMdxContent) {
                        fs.writeFileSync(mdxPath, newMdxContent);
                        console.log(`Updated ${mdxFile}`);
                    } else {
                        console.log(`No changes for ${mdxFile}`);
                    }
                } else {
                    console.warn(`Warning: No solidity code block found in ${mdxFile}`);
                }
            } catch (err) {
                console.error(`Error processing ${mdxFile}:`, err);
            }
        } else {
            // It's okay if some docs don't have direct 1:1 interface files (e.g. index pages), 
            // but for this specific folder structure, we expect most to match.
            if (interfaceName !== 'contracts') {
                console.warn(`Warning: Source file ${solFile} not found for ${mdxFile}`);
            }
        }
    });

    console.log('Synchronization complete.');
}

syncInterfaces();
