/**
 * Resolves static asset paths accurately across all environments:
 * - Local dev ('/')
 * - Relative subpaths ('./')
 * - GitHub Pages subpath deployment ('/rak-shu-panda/')
 */
export function getAssetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}
