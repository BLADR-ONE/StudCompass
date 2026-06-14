import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const defaultServiceAccountPath =
  '/home/bladr/Documents/GitHub/ProJectAlpha/secrets/projectalpha-4f185-firebase-adminsdk-7h7nz-af2a9b93c6.json';

function getServiceAccountPath() {
  const arg = process.argv.slice(2).find((value) => !value.startsWith('-'));
  return arg || defaultServiceAccountPath;
}

function serializeValue(value) {
  if (value == null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(serializeValue);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value !== 'object') {
    return value;
  }

  if (typeof value.toDate === 'function' && typeof value.seconds === 'number') {
    return value.toDate().toISOString();
  }

  if (value.constructor?.name === 'DocumentReference' && typeof value.path === 'string') {
    return { __type: 'DocumentReference', path: value.path };
  }

  if (value.constructor?.name === 'GeoPoint') {
    return { __type: 'GeoPoint', latitude: value.latitude, longitude: value.longitude };
  }

  if (typeof value.toJSON === 'function' && value.toJSON !== Object.prototype.toJSON) {
    const json = value.toJSON();
    if (json !== value) {
      return serializeValue(json);
    }
  }

  const result = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    result[key] = serializeValue(nestedValue);
  }
  return result;
}

function collectFieldNames(documents) {
  const fieldNames = new Set();
  for (const document of documents) {
    for (const fieldName of Object.keys(document.data)) {
      fieldNames.add(fieldName);
    }
  }
  return [...fieldNames].sort((left, right) => left.localeCompare(right));
}

async function main() {
  const serviceAccountPath = getServiceAccountPath();
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'),
      }),
    });
  }

  const db = getFirestore();
  const snapshot = await db.collection('facultati').get();
  const documents = snapshot.docs.map((doc) => ({
    id: doc.id,
    data: serializeValue(doc.data()),
  }));
  const fieldNames = collectFieldNames(documents);
  const output = {
    collection: 'facultati',
    exportedAt: new Date().toISOString(),
    count: documents.length,
    documents,
  };

  const exportPath = fileURLToPath(new URL('../firestore-export.json', import.meta.url));
  writeFileSync(exportPath, `${JSON.stringify(output, null, 2)}\n`);

  console.log(`Exported ${documents.length} top-level documents from facultati.`);
  console.log(`Field names: ${fieldNames.length ? fieldNames.join(', ') : '(none)'}`);
  console.log(`Wrote ${path.relative(process.cwd(), exportPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
