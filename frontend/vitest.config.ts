import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        browser: {
            enabled: true,
            provider: playwright(),
            instances: [
                { browser: 'chromium' },
            ],
            headless: true,
        },
        setupFiles: ['./vitest.setup.ts'],
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-dom/client'],
        exclude: ['vitest'],
    },
})