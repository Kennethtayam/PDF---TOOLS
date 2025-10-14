const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error(`Usage: node OrganizePDF.js <sourceDir> [--dest <destDir>] [--dry-run] [--report report.csv]`);
  process.exit(1);
}

const sourceDir = path.resolve(args[0]);
const destDir = getOpt('--dest') ? path.resolve(getOpt('--dest')) : sourceDir;
const dryRun = args.includes('--dry-run');
const reportPath = getOpt('--report') ? path.resolve(getOpt('--report')) : null;

function getOpt(flag) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
  return null;
}

function extractFolderName(fileName) {
  const base = fileName.replace(/\.[^.]+$/i, ''); // Remove .pdf
  const folderName = base.split('_')[0]; // Take name before first underscore
  return sanitizeFolderName(folderName);
}

function sanitizeFolderName(name) {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // remove invalid characters
    .replace(/[. ]+$/, '')                 // remove trailing dots and spaces
    .trim();
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function moveFile(src, dest) {
  try {
    await fs.rename(src, dest);
  } catch (err) {
    if (err.code === 'EXDEV') {
      await fs.copyFile(src, dest);
      await fs.unlink(src);
    } else {
      throw err;
    }
  }
}

(async function main() {
  console.time('organize');
  console.log(`Scanning: ${sourceDir}`);

  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  const pdfs = entries
    .filter(d => d.isFile() && d.name.toLowerCase().endsWith('.pdf'))
    .map(d => path.join(sourceDir, d.name));

  console.log(`Found ${pdfs.length} PDFs`);

  const groups = new Map();
  for (const filePath of pdfs) {
    const fileName = path.basename(filePath);
    const rawFolderName = fileName.split('_')[0];
    const safeFolderName = extractFolderName(fileName);

    if (!safeFolderName) {
      console.warn(`⚠️ Skipping: "${fileName}" — invalid folder name`);
      continue;
    }

    if (!groups.has(safeFolderName)) {
      groups.set(safeFolderName, []);
    }

    groups.get(safeFolderName).push(filePath);
  }

  console.log(`Will organize into ${groups.size} folders`);

  let processed = 0;
  for (const [folderName, files] of groups) {
    const targetDir = path.join(destDir, folderName);
    if (!dryRun) await ensureDir(targetDir);

    for (const src of files) {
      const dest = path.join(targetDir, path.basename(src));
      if (dryRun) {
        console.log(`[DRY] ${src} -> ${dest}`);
      } else {
        await moveFile(src, dest);
      }
      processed++;
      if (processed % 1000 === 0) {
        console.log(`Processed ${processed}/${pdfs.length}`);
      }
    }
  }

  if (reportPath) {
    const lines = ['folder_name,file_count'];
    for (const [folderName, files] of groups) {
      lines.push(`"${folderName}",${files.length}`);
    }
    const csv = lines.join(os.EOL);
    if (dryRun) {
      console.log(`[DRY] Would write report to ${reportPath}`);
    } else {
      await fs.writeFile(reportPath, csv, 'utf8');
      console.log(`Report written to ${reportPath}`);
    }
  }

  console.log(dryRun
    ? `DRY-RUN complete. Would move ${processed} files into ${groups.size} folders.`
    : `✔ Done. Moved ${processed} files into ${groups.size} folders.`);

  console.timeEnd('organize');
})().catch(err => {
  console.error('❌ ERROR:', err.message);
  process.exit(1);
});

// to run the code copy and paste this:
// node OrganizePDF.js "\\192.168.50.214\d\testing" --dest "\\192.168.50.214\d\Result" --dry-run