/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  /*images: {
    unoptimized: true,
  },*/

  images: {
    loader: 'custom',
    imageSizes: [128, 256, 384],
    deviceSizes: [480, 640, 750, 828, 1080],
  },
  transpilePackages: ['next-image-export-optimizer'],
  env: {
    nextImageExportOptimizer_exportFolderPath: 'out',
    nextImageExportOptimizer_quality: '75',
    nextImageExportOptimizer_storePicturesInWEBP: 'true',
    nextImageExportOptimizer_exportFolderName: 'nextImageExportOptimizer',

    // If you do not want to use blurry placeholder images, then you can set
    // nextImageExportOptimizer_generateAndUseBlurImages to false and pass
    // `placeholder="empty"` to all <ExportedImage> components.
    nextImageExportOptimizer_generateAndUseBlurImages: 'true',
  },
};

module.exports = nextConfig;
