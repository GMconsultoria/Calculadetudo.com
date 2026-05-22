const puppeteer = require('puppeteer');
const express = require('express');
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.resolve(__dirname, '../dist');
const PORT = 3000;

async function prerender() {
    console.log('Starting prerender process...');

    // 1. Start Express server to serve the dist directory
    const app = express();
    // Serve static files, but fallback to index.html for SPA routing
    app.use(express.static(DIST_DIR));
    app.use((req, res) => {
        res.sendFile(path.join(DIST_DIR, 'index.html'));
    });

    const server = app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });

    // 2. Launch Puppeteer
    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Speed up rendering by blocking external requests
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        const url = req.url();
        if (url.includes('google-analytics') || url.includes('googlesyndication') || url.includes('doubleclick') || url.includes('translate.google')) {
            req.abort();
        } else {
            req.continue();
        }
    });

    const baseUrl = `http://localhost:${PORT}`;
    const visited = new Set();
    const routesToVisit = ['/'];
    const sitemapUrls = [];

    // 3. Crawler Loop
    while (routesToVisit.length > 0) {
        const route = routesToVisit.shift();
        if (visited.has(route)) continue;
        visited.add(route);

        console.log(`Prerendering ${route}...`);
        
        await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle0' });
        
        // Wait a small extra time to ensure JS DOM manipulation is done
        await new Promise(r => setTimeout(r, 1000));

        // Get HTML
        let html = await page.content();
        
        // Clean up injected scripts if necessary (e.g. puppeteer script tags)
        
        // Save HTML to dist
        const routeDir = path.join(DIST_DIR, route);
        if (!fs.existsSync(routeDir)) {
            fs.mkdirSync(routeDir, { recursive: true });
        }
        
        // Se a rota for '/', sobrescreve o index.html original. Senão, salva na subpasta.
        const filePath = route === '/' ? path.join(DIST_DIR, 'index.html') : path.join(routeDir, 'index.html');
        
        // Only overwrite if it's not the root, or if it's root we overwrite the original template with fully rendered content
        fs.writeFileSync(filePath, html);

        // Add to sitemap
        sitemapUrls.push(`https://calculadetudo.com${route === '/' ? '' : route}`);

        // Extract new links
        const newLinks = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a'))
                .map(a => a.getAttribute('href'))
                .filter(href => href && href.startsWith('/') && !href.startsWith('//'));
        });

        for (const link of newLinks) {
            if (!visited.has(link) && !routesToVisit.includes(link)) {
                routesToVisit.push(link);
            }
        }
    }

    // 4. Generate sitemap.xml
    console.log('Generating sitemap.xml...');
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${url === 'https://calculadetudo.com' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}
</urlset>`;
    
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapContent);

    // 5. Cleanup
    await browser.close();
    server.close();
    console.log('Prerender process completed successfully!');
}

prerender().catch(err => {
    console.error('Prerender failed:', err);
    process.exit(1);
});
