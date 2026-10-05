import { Plugin } from 'vite';
import { handleRunCode, handleSubmitCode } from './companion';

export function judgeCompanionPlugin(): Plugin {
  return {
    name: 'judge-companion',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/judge')) {
          return next();
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        // Read request body
        const chunks: Buffer[] = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', async () => {
          try {
            const bodyStr = Buffer.concat(chunks).toString('utf8');
            const payload = JSON.parse(bodyStr || '{}');

            res.setHeader('Content-Type', 'application/json');

            if (req.url === '/api/judge/run') {
              const result = await handleRunCode(payload);
              res.end(JSON.stringify(result));
            } else if (req.url === '/api/judge/submit') {
              const result = await handleSubmitCode(payload);
              res.end(JSON.stringify(result));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Endpoint not found' }));
            }
          } catch (err: any) {
            console.error('Judge endpoint error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message || 'Judge internal error' }));
          }
        });
      });
    },
  };
}
