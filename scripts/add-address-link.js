const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '../content/v2/en/contracts');

function addAddressLinks() {
    console.log('Adding address links to documentation...');

    if (!fs.existsSync(DOCS_DIR)) {
        console.error(`Docs directory not found: ${DOCS_DIR}`);
        process.exit(1);
    }

    const mdxFiles = fs.readdirSync(DOCS_DIR).filter(file => file.endsWith('.mdx') && file !== 'index.mdx');

    mdxFiles.forEach(mdxFile => {
        const mdxPath = path.join(DOCS_DIR, mdxFile);
        let content = fs.readFileSync(mdxPath, 'utf8');

        const oldLinkText = '> [!TIP]\n> View deployed contract addresses in the [Contract Addresses](/resources/contract-addresses) section.\n\n';
        const newLinkText = '<Callout type="info">\n  View deployed contract addresses in the [Contract Addresses](/resources/contract-addresses) section.\n</Callout>\n\n';

        if (content.includes('<Callout type="info">\n  View deployed contract addresses')) {
            console.log(`Skipping ${mdxFile} (already has Callout)`);
            return;
        }

        let newContent = content;

        // Replace old style if present
        if (content.includes('> [!TIP]')) {
            // We need to be careful with exact matching of the multi-line string, 
            // so let's try to match the core part or just replace the whole known block
            // The previous script inserted exactly `oldLinkText`.
            newContent = content.replace(oldLinkText, newLinkText);
            // Fallback in case of whitespace differences (e.g. if user edited it)
            if (newContent === content) {
                // Try a regex replacement for the blockquote
                newContent = content.replace(/> \[!TIP\]\s*> View deployed contract addresses in the \[Contract Addresses\]\(\/resources\/contract-addresses\) section\.\s*/g, newLinkText);
            }
        } else {
            // Insert new style if old style not found (and not already present)
            const parts = content.split('---');
            if (parts.length >= 3) {
                newContent = `---${parts[1]}---\n\n${newLinkText}${parts.slice(2).join('---').trim()}`;
            }
        }

        if (newContent !== content) {
            fs.writeFileSync(mdxPath, newContent);
            console.log(`Updated ${mdxFile}`);
        } else {
            console.log(`No changes for ${mdxFile}`);
        }
    });

    console.log('Done.');
}

addAddressLinks();
