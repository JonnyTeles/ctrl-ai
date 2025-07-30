import { createWorker, PSM } from 'tesseract.js';

let worker: Tesseract.Worker | null = null;

export async function getWorker() {
  if (!worker) {
    worker = await createWorker('por');
    await worker.setParameters({
      preserve_interword_spaces: '1',
      tessedit_pageseg_mode: PSM.AUTO,
    });
  }
  return worker;
}