import react from '@vitejs/plugin-react'
import path from "path";
import {defineConfig} from 'vite'

// https://vite.dev/config/
export default defineConfig(
    {
        plugins: [react()],
        resolve: {
            dedupe: ['@reduxjs/toolkit', 'react', 'react-dom', '@mui/material', '@mui/icons-material', '@mui/x-data-grid', '@mui/lab', '@emotion/react', '@emotion/cache', '@emotion/styled', 'notistack'],
            alias: {
                "@": path.resolve(__dirname, "./src"),
                "@app": path.resolve(__dirname, "./src/app"),
                "@common": path.resolve(__dirname, "./src/common"),
                "@interfaces": path.resolve(__dirname, "./src/interfaces"),
                "@theme": path.resolve(__dirname, "./src/theme"),
                "@features": path.resolve(__dirname, "./src/features"),
                "@pages": path.resolve(__dirname, "./src/pages"),
            }
        },
        server: {
            host: "0.0.0.0",
            port: 5175,
            proxy: {
                /*"/api/mcp": {
                    target: "http://localhost:8083",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api\/mcp/, ""),
                },*/
                "/api": {
                    target: "http://192.168.165.34:8080",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        }
    }
)
