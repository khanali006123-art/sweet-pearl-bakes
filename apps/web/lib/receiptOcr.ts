/**
 * Server-side OCR extraction for payment receipt screenshots (Next.js route).
 * Mirrors apps/api/src/utils/receiptOcr.ts — the text validation itself lives
 * in @sweetpearl/shared (checkReceiptText) so both apps enforce the same rules.
 *
 * How the language data is provided: tesseract.js normally downloads
 * eng.traineddata from a CDN inside its worker thread, which can fail
 * (sandbox/proxy, CDN outage, cold serverless start) and block genuine
 * customers at checkout. Instead, the data is BUNDLED with the app
 * (packages/shared/src/tessdataEng.ts, base64 chunks) and materialized once
 * to the OS temp dir, which the worker then reads as a local file via
 * `langPath`. No network fetch happens at request time. `cacheMethod: 'none'`
 * skips the worker's own cache read/write entirely.
 *
 * Throws on any OCR failure (including timeout) — callers must treat that as
 * "receipt could not be read" and reject the order, never as a pass.
 */
import { createWorker } from 'tesseract.js';
import { ENG_TRAINEDDATA_GZ_PARTS } from '@sweetpearl/shared';
import { tmpdir } from 'os';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

type WorkerLike = {
  recognize: (image: Buffer) => Promise<{ data: { text: string } }>;
};

let workerPromise: Promise<WorkerLike> | null = null;

/** Write the bundled eng.traineddata.gz to a temp dir once; return the dir. */
function getTessdataDir(): string {
  const dir = join(tmpdir(), 'spb-tessdata');
  const file = join(dir, 'eng.traineddata.gz');
  if (!existsSync(file)) {
    mkdirSync(dir, { recursive: true });
    writeFileSync(file, Buffer.from(ENG_TRAINEDDATA_GZ_PARTS.join(''), 'base64'));
  }
  return dir;
}

function getWorker(): Promise<WorkerLike> {
  if (!workerPromise) {
    workerPromise = createWorker('eng', undefined, {
      langPath: getTessdataDir(),
      cacheMethod: 'none',
    }) as Promise<WorkerLike>;
  }
  return workerPromise;
}

const OCR_TIMEOUT_MS = 60000;

export async function extractReceiptText(dataUrl: string): Promise<string> {
  const base64 = (dataUrl.split(',')[1] || '').replace(/\s/g, '');
  const buffer = Buffer.from(base64, 'base64');
  if (buffer.length === 0) {
    throw new Error('Empty receipt image');
  }

  const run = (async () => {
    const worker = await getWorker();
    const { data } = await worker.recognize(buffer);
    return (data?.text || '') as string;
  })();

  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('OCR_TIMEOUT')), OCR_TIMEOUT_MS);
  });

  return Promise.race([run, timeout]);
}
