export async function getPreviewSignature(page) {
  return page.locator('#qr-preview').evaluate((root) => {
    const canvas = root.querySelector('canvas');
    if (canvas) return canvas.toDataURL();
    const svg = root.querySelector('svg');
    return svg?.outerHTML ?? '';
  });
}
