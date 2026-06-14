import { readdir, mkdir, copyFile, unlink } from 'node:fs/promises';
import path from 'node:path';

const drizzleDir = path.resolve('drizzle');
const netlifyMigrationsDir = path.resolve('netlify/database/migrations');

async function listSqlFiles(dir) {
  return (await readdir(dir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
    .map((entry) => entry.name)
    .sort();
}

async function main() {
  const sourceFiles = await listSqlFiles(drizzleDir);

  if (sourceFiles.length === 0) {
    throw new Error('No drizzle SQL migrations found to sync.');
  }

  await mkdir(netlifyMigrationsDir, { recursive: true });

  const targetFiles = await listSqlFiles(netlifyMigrationsDir);
  const sourceSet = new Set(sourceFiles);

  await Promise.all(
    targetFiles
      .filter((file) => !sourceSet.has(file))
      .map((file) => unlink(path.join(netlifyMigrationsDir, file))),
  );

  for (const file of sourceFiles) {
    await copyFile(path.join(drizzleDir, file), path.join(netlifyMigrationsDir, file));
  }

  console.log(
    `Synced ${sourceFiles.length} migration file${sourceFiles.length === 1 ? '' : 's'} to netlify/database/migrations/`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
