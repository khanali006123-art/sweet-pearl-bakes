/**
 * Bundled English OCR language data for receipt checking.
 *
 * Source: https://cdn.jsdelivr.net/npm/@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz
 * (the official tesseract.js English "best" LSTM data, gzip-compressed).
 *
 * Why bundled: tesseract.js otherwise downloads this file at runtime from a
 * CDN inside its worker thread. That download can fail (sandbox/proxy, CDN
 * outage, cold serverless start), which would block genuine customers at
 * checkout. Passing the data directly to the worker removes the download,
 * the cache directory, and the filesystem dependency entirely.
 *
 * Stored as an array of chunks (not one long concatenation) so JS tooling
 * does not have to build a giant expression tree from it.
 *
 * To regenerate: download the .gz from the URL above, base64-encode it,
 * split into ~64KB chunks, and replace the array below, then rebuild
 * @sweetpearl/shared.
 */
export declare const ENG_TRAINEDDATA_GZ_PARTS: string[];
