import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { env } from 'node:process'

const repoName = env.GITHUB_REPOSITORY?.split('/')[1]
const base = env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
