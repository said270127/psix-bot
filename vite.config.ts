import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { sendToTelegram, type TelegramPayload } from './server/telegram';

// `npm run dev` paytida /api/telegram so'rovini lokal qayta ishlaydi
function telegramDevApi(env: Record<string, string>): Plugin {
  return {
    name: 'telegram-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/telegram', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ ok: false, error: 'Faqat POST' }));
          return;
        }
        let raw = '';
        req.on('data', (chunk) => (raw += chunk));
        req.on('end', async () => {
          let result;
          try {
            result = await sendToTelegram(
              JSON.parse(raw) as TelegramPayload,
              env.TELEGRAM_BOT_TOKEN,
              env.TELEGRAM_CHAT_ID,
            );
          } catch {
            result = { status: 400, body: { ok: false, error: "Noto'g'ri JSON" } };
          }
          res.statusCode = result.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result.body));
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), telegramDevApi(env)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
