import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { sendToTelegram, type TelegramPayload } from './server/telegram';
import { registerPerson, type RegisterPayload } from './server/register';

// `npm run dev` paytida /api/telegram va /api/register so'rovlarini lokal qayta ishlaydi
function devApi(env: Record<string, string>): Plugin {
  function route(
    server: Parameters<NonNullable<Plugin['configureServer']>>[0],
    path: string,
    run: (body: unknown) => Promise<{ status: number; body: unknown }>,
  ) {
    server.middlewares.use(path, (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.end(JSON.stringify({ ok: false, error: 'Faqat POST' }));
        return;
      }
      let raw = '';
      req.on('data', (chunk) => (raw += chunk));
      req.on('end', async () => {
        let result: { status: number; body: unknown };
        try {
          result = await run(JSON.parse(raw));
        } catch {
          result = { status: 400, body: { ok: false, error: "Noto'g'ri so'rov" } };
        }
        res.statusCode = result.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result.body));
      });
    });
  }

  return {
    name: 'dev-api',
    configureServer(server) {
      // server/*.ts fayllari process.env dan o'qiydi
      Object.assign(process.env, env);
      route(server, '/api/telegram', (b) =>
        sendToTelegram(b as TelegramPayload, env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID),
      );
      route(server, '/api/register', (b) => registerPerson(b as RegisterPayload));
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), devApi(env)],
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
