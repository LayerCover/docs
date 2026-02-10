#!/usr/bin/env node
/**
 * sync-addresses.js
 *
 * Reads deployment JSON files from packages/contracts/deployments/base_sepolia/
 * and patches the baseSepoliaAddresses object in ContractAddresses.tsx.
 *
 * Usage:  node scripts/sync-addresses.js
 */

const fs = require('fs')
const path = require('path')

const CONTRACTS_DIR = path.resolve(__dirname, '../lib/contracts/deployments/base_sepolia')
const TARGET_FILE = path.resolve(__dirname, '../components/ContractAddresses.tsx')

// Deployment JSON files to merge (order matters — later files override)
const DEPLOYMENT_FILES = ['usdc.json', 'wsteth.json']

function loadDeployments() {
    const merged = {}
    for (const file of DEPLOYMENT_FILES) {
        const filePath = path.join(CONTRACTS_DIR, file)
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠  Skipping missing file: ${filePath}`)
            continue
        }
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        Object.assign(merged, data)
        console.log(`✓  Loaded ${Object.keys(data).length} addresses from ${file}`)
    }
    return merged
}

function patchComponent(deployments) {
    const source = fs.readFileSync(TARGET_FILE, 'utf-8')

    // Match the baseSepoliaAddresses block
    const startMarker = 'const baseSepoliaAddresses: Record<string, string> = {'
    const startIdx = source.indexOf(startMarker)
    if (startIdx === -1) {
        console.error('✗  Could not find baseSepoliaAddresses in ContractAddresses.tsx')
        process.exit(1)
    }

    // Find the closing brace
    let depth = 0
    let endIdx = -1
    for (let i = startIdx + startMarker.length; i < source.length; i++) {
        if (source[i] === '{') depth++
        if (source[i] === '}') {
            if (depth === 0) {
                endIdx = i + 1
                break
            }
            depth--
        }
    }

    if (endIdx === -1) {
        console.error('✗  Could not find closing brace for baseSepoliaAddresses')
        process.exit(1)
    }

    // Parse existing keys to preserve the key structure
    const existingBlock = source.slice(startIdx, endIdx)
    const keyRegex = /^\s*(\w+):/gm
    const existingKeys = []
    let match
    while ((match = keyRegex.exec(existingBlock)) !== null) {
        existingKeys.push(match[1])
    }

    // Build replacement
    const lines = existingKeys.map((key) => {
        const addr = deployments[key] || ''
        return `  ${key}: '${addr}',`
    })

    const replacement = `const baseSepoliaAddresses: Record<string, string> = {\n${lines.join('\n')}\n}`

    const patched = source.slice(0, startIdx) + replacement + source.slice(endIdx)
    fs.writeFileSync(TARGET_FILE, patched, 'utf-8')

    const populated = existingKeys.filter((k) => deployments[k]).length
    console.log(`\n✓  Patched ${populated}/${existingKeys.length} addresses in ContractAddresses.tsx`)

    const missing = existingKeys.filter((k) => !deployments[k])
    if (missing.length > 0) {
        console.log(`⚠  Missing from deployment JSON: ${missing.join(', ')}`)
    }
}

// Main
const deployments = loadDeployments()
console.log(`\nTotal unique addresses: ${Object.keys(deployments).length}`)
patchComponent(deployments)
