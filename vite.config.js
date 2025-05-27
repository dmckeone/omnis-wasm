import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { viteStaticCopy } from "vite-plugin-static-copy"
import wasm from "vite-plugin-wasm";


const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    build: {
        // Omnis *requires* that top-level-await plugins not be used
        target: 'esnext',
        lib: {
            entry: resolve(__dirname, 'lib/main.js'),
            name: 'omnis_wasm',
            // the proper extensions will be added
            fileName: 'omnis_wasm/omnis_wasm',
            formats: ["es"]
        },
        rollupOptions: {
            output: {
                entryFileNames: "omnis_wasm/omnis_wasm.mjs",
            }
        },
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: "omnis-package/package.json",
                    dest: "omnis_wasm/"
                }
            ]
        }),
        wasm()
    ]
})