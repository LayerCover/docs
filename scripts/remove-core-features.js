const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '../content/v2/en/contracts');

function removeCoreFeatures() {
    console.log('Removing Core Features sections...');

    if (!fs.existsSync(DOCS_DIR)) {
        console.error(`Docs directory not found: ${DOCS_DIR}`);
        process.exit(1);
    }

    const mdxFiles = fs.readdirSync(DOCS_DIR).filter(file => file.endsWith('.mdx') && file !== 'index.mdx');

    mdxFiles.forEach(mdxFile => {
        const mdxPath = path.join(DOCS_DIR, mdxFile);
        let content = fs.readFileSync(mdxPath, 'utf8');

        // Regex to match "## Core Features" and everything up to the next "## " header
        // The [\s\S]*? is non-greedy match of any character including newlines
        // We look ahead for the next "## " or end of file
        const regex = /## Core Features[\s\S]*?(?=## |$)/;

        if (regex.test(content)) {
            const newContent = content.replace(regex, '');
            // Clean up potential double newlines left behind if necessary, though the regex might leave it okay.
            // Let's trim multiple newlines to max 2.
            const cleanedContent = newContent.replace(/\n{3,}/g, '\n\n');

            if (content !== cleanedContent) {
                fs.writeFileSync(mdxPath, cleanedContent);
                console.log(`Updated ${mdxFile}`);
            } else {
                console.log(`No changes needed for ${mdxFile} (content match but no change?)`);
            }
        } else {
            console.log(`Skipping ${mdxFile} (no Core Features section found)`);
        }
    });

    console.log('Done.');
}

removeCoreFeatures();
