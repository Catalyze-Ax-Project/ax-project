#!/usr/bin/env node
/**
 * Plugin repo sync — clones (or pulls) Catalyze-Ax-Project/plugin and
 * generates lib/data/plugins.generated.json for build-time consumption.
 *
 * Resolution order for plugin source:
 *   1. PLUGIN_LOCAL_PATH env var (explicit path to a local clone)
 *   2. Sibling directory (../plugin) — works for local dev when both repos
 *      are cloned side-by-side
 *   3. Clone via PLUGIN_REPO_TOKEN (Vercel build path)
 */
import { execSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const PLUGIN_LOCAL_PATH = process.env.PLUGIN_LOCAL_PATH
const PLUGIN_REPO_TOKEN = process.env.PLUGIN_REPO_TOKEN
const CACHE_DIR = join(ROOT, '.plugin-cache')
const OUT_DIR = join(ROOT, 'lib/data')
const OUT_FILE = join(OUT_DIR, 'plugins.generated.json')

function resolvePluginRoot() {
  if (PLUGIN_LOCAL_PATH && existsSync(PLUGIN_LOCAL_PATH)) {
    console.log(`[sync-plugins] Using PLUGIN_LOCAL_PATH: ${PLUGIN_LOCAL_PATH}`)
    return PLUGIN_LOCAL_PATH
  }

  const sibling = join(ROOT, '..', 'plugin')
  if (existsSync(sibling) && existsSync(join(sibling, 'README.md'))) {
    console.log(`[sync-plugins] Using sibling plugin repo: ${sibling}`)
    return sibling
  }

  const url = PLUGIN_REPO_TOKEN
    ? `https://x-access-token:${PLUGIN_REPO_TOKEN}@github.com/Catalyze-Ax-Project/plugin.git`
    : 'https://github.com/Catalyze-Ax-Project/plugin.git'

  if (existsSync(CACHE_DIR)) {
    console.log(`[sync-plugins] Pulling latest in ${CACHE_DIR}`)
    execSync(`git -C "${CACHE_DIR}" fetch --depth=1 origin main`, { stdio: 'inherit' })
    execSync(`git -C "${CACHE_DIR}" reset --hard origin/main`, { stdio: 'inherit' })
  } else {
    console.log(`[sync-plugins] Cloning to ${CACHE_DIR}`)
    execSync(`git clone --depth=1 "${url}" "${CACHE_DIR}"`, { stdio: 'inherit' })
  }
  return CACHE_DIR
}

function readMdDir(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = readFileSync(join(dir, f), 'utf-8')
      const { data, content } = matter(raw)
      return { ...data, body: content.trim() }
    })
}

const root = resolvePluginRoot()

const skills = [
  ...readMdDir(join(root, 'skills/common')),
  ...readMdDir(join(root, 'skills/bd')),
  ...readMdDir(join(root, 'skills/dev-growth')),
  ...readMdDir(join(root, 'skills/marketing')),
  ...readMdDir(join(root, 'skills/operations')),
]

const teams = readMdDir(join(root, 'teams'))

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(
  OUT_FILE,
  JSON.stringify(
    { skills, teams, syncedAt: new Date().toISOString() },
    null,
    2,
  ),
)
console.log(
  `[sync-plugins] ✓ Synced ${skills.length} skills + ${teams.length} team rules → ${OUT_FILE}`,
)
