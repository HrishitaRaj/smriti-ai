// Lightweight EXIF helper using exifr (dynamic import)
export async function getGpsFromDataUrl(dataUrl: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const exifr: any = await import('exifr');
    // exifr requires a Blob or ArrayBuffer; convert dataUrl to Blob
    const blob = dataURLToBlob(dataUrl);
    const result = await exifr.gps(blob) as any;
    if (!result) return null;
    // exifr.gps returns {latitude, longitude}
    const lat = result.latitude ?? result.lat ?? null;
    const lon = result.longitude ?? result.lon ?? null;
    if (lat == null || lon == null) return null;
    return { lat: Number(lat), lon: Number(lon) };
  } catch (e) {
    // silently ignore if library is missing
    console.warn('exifr failed', e);
    return null;
  }
}

function dataURLToBlob(dataurl: string) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
