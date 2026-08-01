import { defineConfig } from 'vite'
import type { ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

const localDbApiPlugin = () => {
  const dbPath = path.resolve(__dirname, 'src/utils/local_db.json');

  // Ensure DB file exists
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({
      pf_client_logos: [],
      pf_team: [],
      pf_testimonials: [],
      pf_projects: [],
      pf_blogs: [],
      pf_stats: [],
      pf_orbit_icons: [],
      pf_expertise_cards: []
    }, null, 2));
  }

  return {
    name: 'local-db-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url?.startsWith('/api/db')) {
          res.setHeader('Content-Type', 'application/json');
          
          if (req.method === 'GET') {
            const data = fs.readFileSync(dbPath, 'utf-8');
            res.end(data);
            return;
          }
          
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const newData = JSON.parse(body);
                fs.writeFileSync(dbPath, JSON.stringify(newData, null, 2));
                res.end(JSON.stringify({ success: true }));
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
              }
            });
            return;
          }
        }
        next();
      });
    }
  };
};

export default defineConfig({
  plugins: [react(), tailwindcss(), localDbApiPlugin()],
  base: process.env.GITHUB_ACTIONS ? '/PIXELFORGE/' : './',
  server: {
    watch: {
      ignored: ['**/src/utils/local_db.json']
    }
  }
})

