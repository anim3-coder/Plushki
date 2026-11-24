import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'https://localhost:7120', // адрес вашего бэкенда
                changeOrigin: true,
                secure: false, // если используете самоподписанный сертификат
            },
        },
    },
});