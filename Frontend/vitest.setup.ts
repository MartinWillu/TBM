import { beforeAll, afterEach, afterAll } from 'vitest';
import { worker } from './src/mocks/worker';

beforeAll(async () => {
    await worker.start({
        serviceWorker: {
            url: '/mockServiceWorker.js',
        },
        quiet: true,
    });
});

afterEach(() => {
    worker.resetHandlers();
});

afterAll(() => {
    worker.stop();
});