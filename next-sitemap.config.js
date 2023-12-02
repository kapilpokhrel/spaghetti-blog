/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'http://localhost:3000/',
  output: 'export',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'weekly',
  transform: async (config, path) => {
    let freq = config.changefreq;
    let priority = config.priority;

    if (path == '/') {
      //Homepage
      priority = 1;
    } else if (path == '/posts') {
      return null;
    } else if (path.startsWith('/posts/')) {
      priority = 0.9;
    }

    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: freq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
