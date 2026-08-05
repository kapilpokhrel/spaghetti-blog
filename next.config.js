/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  // Emit posts/<id>/index.html instead of posts/<id>.html, so a plain static
  // server resolves /posts/<id> to the page rather than listing the directory
  // of RSC payloads that sits alongside it.
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  /*images: {
    unoptimized: true,
  },*/

  images: {
    loader: 'custom',
    imageSizes: [128, 256, 384],
    // The prose column tops out at 768 css px, so a 2x/3x display needs
    // candidates well past 1080 or the browser upscales and detail is lost.
    deviceSizes: [480, 640, 750, 828, 1080, 1536, 1920, 2560],
  },
  transpilePackages: ['next-image-export-optimizer'],
  env: {
    nextImageExportOptimizer_exportFolderPath: 'out',
    nextImageExportOptimizer_quality: '80',
    nextImageExportOptimizer_storePicturesInWEBP: 'true',
    nextImageExportOptimizer_exportFolderName: 'nextImageExportOptimizer',

    // If you do not want to use blurry placeholder images, then you can set
    // nextImageExportOptimizer_generateAndUseBlurImages to false and pass
    // `placeholder="empty"` to all <ExportedImage> components.
    nextImageExportOptimizer_generateAndUseBlurImages: 'true',
  },
};

module.exports = nextConfig;
