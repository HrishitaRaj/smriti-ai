// Minimal face recognition helper using face-api.js
// NOTE: this file uses dynamic import so the app won't fail if the package or models are missing.
export async function ensureModelsLoaded(): Promise<boolean> {
  try {
    const faceapi: any = await import('face-api.js');
    // load from /models - ensure you place models in public/models
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    return true;
  } catch (e) {
    console.warn('face-api models/load failed', e);
    return false;
  }
}

export async function getDescriptorFromDataUrl(dataUrl: string): Promise<number[] | null> {
  try {
    const faceapi: any = await import('face-api.js');
    const img = await loadImage(dataUrl);
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    if (!detection || !detection.descriptor) return null;
    // descriptor is a Float32Array - convert to regular number[] for storage
    return Array.from(detection.descriptor as Float32Array);
  } catch (e) {
    console.warn('face-api detection failed', e);
    return null;
  }
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => res(img);
    img.onerror = (err) => rej(err);
    img.src = dataUrl;
  });
}

export function euclideanDistance(a?: number[] | null, b?: number[] | null): number {
  if (!a || !b) return Infinity;
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = (a[i] as number) - (b[i] as number);
    sum += d * d;
  }
  return Math.sqrt(sum);
}
