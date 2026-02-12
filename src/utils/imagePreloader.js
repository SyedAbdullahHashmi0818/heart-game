/**
 * Preloads images from URLs (both img src and CSS background-image URLs)
 * @param {string[]} imageUrls - Array of image URLs to preload
 * @returns {Promise<void>} - Resolves when all images are loaded
 */
export function preloadImages(imageUrls) {
  const promises = imageUrls.map((url) => {
    return new Promise((resolve, reject) => {
      // Skip empty or invalid URLs
      if (!url || typeof url !== "string") {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        // Still resolve to prevent blocking if one image fails
        console.warn(`Failed to load image: ${url}`);
        resolve();
      };
      img.src = url;
    });
  });

  return Promise.all(promises);
}

/**
 * Extracts background-image URLs from CSS rules
 * @param {string[]} cssUrls - Array of CSS background-image URLs (e.g., ["/screen1/bg.png"])
 * @returns {Promise<void>} - Resolves when all images are loaded
 */
export function preloadBackgroundImages(cssUrls) {
  // CSS background-image URLs are the same as regular image URLs
  // We just need to ensure they're properly formatted
  const imageUrls = cssUrls.map((url) => {
    // Remove url() wrapper if present
    let cleanUrl = url.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
    // Ensure it starts with / if it's a relative path
    if (!cleanUrl.startsWith("http") && !cleanUrl.startsWith("/")) {
      cleanUrl = "/" + cleanUrl;
    }
    return cleanUrl;
  });

  return preloadImages(imageUrls);
}

/**
 * Preloads both regular images and background images
 * @param {Object} options - Configuration object
 * @param {string[]} options.images - Array of image URLs (for img src)
 * @param {string[]} options.backgrounds - Array of background-image URLs (for CSS backgrounds)
 * @returns {Promise<void>} - Resolves when all images are loaded
 */
export function preloadAllAssets({ images = [], backgrounds = [] }) {
  const allPromises = [
    ...(images.length > 0 ? [preloadImages(images)] : []),
    ...(backgrounds.length > 0 ? [preloadBackgroundImages(backgrounds)] : []),
  ];

  return Promise.all(allPromises).then(() => {});
}
