import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();
const server = app.listen(env.PORT, () => {
  console.info(`Zentro API listening on port ${env.PORT}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(error => {
      if (error) {
        console.error('Unable to close the API server cleanly.', error);
        process.exitCode = 1;
      }
    });
  });
}
