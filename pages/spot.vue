<template>
  <!-- Full-screen gym page for spot.casazza.io
       The WASM canvas is rendered by BackgroundWrapper (in app.vue).
       This page provides the sidebar overlay + minimal nav on top. -->
  <div class="spot-page">
    <!-- Minimal header nav -->
    <header class="spot-nav">
      <a href="https://casazza.info" class="spot-nav-home" title="Back to casazza.info">
        &larr; casazza.info
      </a>
      <span class="spot-nav-title">spot gym</span>
      <div class="spot-nav-right">
        <span class="status-dot" :class="{ connected: status.connected }" />
        <span class="status-text">{{ status.text }}</span>
        <button class="panel-toggle" @click="sidebarOpen = !sidebarOpen" :title="sidebarOpen ? 'Hide panel' : 'Show metrics'">
          {{ sidebarOpen ? '&rsaquo;&rsaquo;' : '&lsaquo;&lsaquo;' }}
        </button>
      </div>
    </header>

    <!-- Sidebar metrics panel (collapsible, overlays on right) -->
    <aside class="spot-sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-inner">
        <div class="metrics-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="metrics-content">
          <!-- Rerun viewer iframe -->
          <iframe
            v-if="activeTab === 'rerun'"
            :src="rerunUrl"
            frameborder="0"
            allow="autoplay"
            class="rerun-frame"
          />

          <!-- Node status cards -->
          <div v-else-if="activeTab === 'nodes'" class="nodes-panel">
            <div v-if="Object.keys(nodes).length === 0" class="no-nodes">
              no training nodes connected
            </div>
            <div v-for="(node, name) in nodes" :key="name" class="node-card">
              <div class="node-name">{{ name }}</div>
              <div class="node-behavior">{{ node.behavior }}</div>
              <div class="node-stats">
                <span>{{ formatSteps(node.steps) }} steps</span>
                <span class="reward" :class="rewardClass(node.reward)">
                  r={{ node.reward?.toFixed(0) ?? '?' }}
                </span>
              </div>
              <div class="node-bar">
                <div
                  class="node-bar-fill"
                  :style="{ width: progressPercent(node.steps) + '%' }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref('rerun')
const sidebarOpen = ref(true)

// Rerun viewer - same as spot-training.vue
const rerunUrl = ref('http://192.168.1.35:9091/?url=rerun%2Bhttp%3A%2F%2F192.168.1.35%3A9877%2Fproxy')

const tabs = [
  { id: 'rerun', label: 'metrics' },
  { id: 'nodes', label: 'nodes' },
]

const status = ref({ connected: false, text: 'offline' })
const nodes = ref<Record<string, { behavior?: string; steps?: number; reward?: number }>>({})

function formatSteps (steps?: number) {
  if (!steps) return '?'
  if (steps > 1e6) return (steps / 1e6).toFixed(1) + 'M'
  if (steps > 1e3) return (steps / 1e3).toFixed(0) + 'K'
  return steps
}

function rewardClass (reward?: number) {
  if (reward === undefined || reward === null) return ''
  if (reward > 0) return 'positive'
  if (reward > -5000) return 'improving'
  return 'negative'
}

function progressPercent (steps?: number) {
  if (!steps) return 0
  return Math.min(100, (steps / 50_000_000) * 100)
}

let pollInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  pollInterval = setInterval(async () => {
    try {
      const res = await fetch('/api/training-status')
      if (res.ok) {
        const data = await res.json()
        nodes.value = data.nodes || {}
        const entries = Object.entries(nodes.value)
        if (entries.length === 0) {
          status.value = { connected: true, text: '0 nodes' }
        } else {
          const best = entries.reduce(
            (b, [k, v]) => ((v.reward ?? -Infinity) > b.reward ? { name: k, ...v, reward: v.reward ?? -Infinity } : b),
            { name: '', reward: -Infinity }
          )
          status.value = {
            connected: true,
            text: `${entries.length} nodes | best: ${best.name} r=${best.reward?.toFixed(0)} | ${formatSteps(best.steps)} steps`,
          }
        }
      } else {
        status.value = { connected: false, text: 'api error' }
      }
    } catch {
      status.value = { connected: false, text: 'offline' }
    }
  }, 5000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>

<style scoped>
/* The WASM canvas is rendered by app.vue's BackgroundWrapper, covering the full viewport.
   This component is an overlay on top. All elements need pointer-events-auto explicitly. */

.spot-page {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  pointer-events: none; /* let clicks fall through to canvas by default */
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  z-index: 30;
}

/* ── Header nav ── */
.spot-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  height: 32px;
  flex-shrink: 0;
  background: rgba(10, 10, 10, 0.85);
  border-bottom: 1px solid #1e2228;
  backdrop-filter: blur(4px);
  pointer-events: auto;
}

.spot-nav-home {
  font-size: 11px;
  color: #5e81ac; /* Nord blue */
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.15s;
}

.spot-nav-home:hover {
  opacity: 1;
  color: #81a1c1;
}

.spot-nav-title {
  font-size: 12px;
  font-weight: 600;
  color: #a3be8c; /* Nord green */
  letter-spacing: 0.05em;
}

.spot-nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #434c5e;
  flex-shrink: 0;
}

.status-dot.connected {
  background: #a3be8c;
  box-shadow: 0 0 4px #a3be8c88;
}

.status-text {
  font-size: 10px;
  color: #4c566a;
  max-width: 360px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-dot.connected + .status-text {
  color: #616e88;
}

.panel-toggle {
  padding: 2px 8px;
  background: #1e2228;
  border: 1px solid #2e3440;
  border-radius: 3px;
  color: #616e88;
  font-size: 14px;
  cursor: pointer;
  line-height: 1;
  transition: color 0.15s, border-color 0.15s;
}

.panel-toggle:hover {
  color: #88c0d0;
  border-color: #3b4252;
}

/* ── Sidebar ── */
.spot-sidebar {
  position: absolute;
  top: 32px; /* below nav */
  right: 0;
  bottom: 0;
  width: 420px;
  max-width: 45vw;
  background: rgba(10, 12, 16, 0.88);
  border-left: 1px solid #1e2228;
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
}

.spot-sidebar.open {
  transform: translateX(0);
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* ── Tabs ── */
.metrics-tabs {
  display: flex;
  background: #0d1017;
  border-bottom: 1px solid #1e2228;
  flex-shrink: 0;
}

.metrics-tabs button {
  padding: 6px 16px;
  background: transparent;
  color: #4c566a;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  text-transform: lowercase;
  letter-spacing: 0.04em;
  transition: color 0.15s;
}

.metrics-tabs button.active {
  color: #a3be8c;
  border-bottom-color: #a3be8c;
}

.metrics-tabs button:hover:not(.active) {
  color: #81a1c1;
}

/* ── Metrics content ── */
.metrics-content {
  flex: 1;
  overflow: hidden;
}

.rerun-frame {
  width: 100%;
  height: 100%;
  border: none;
  background: #0a0c10;
}

/* ── Node cards ── */
.nodes-panel {
  padding: 12px;
  overflow-y: auto;
  height: 100%;
}

.no-nodes {
  font-size: 11px;
  color: #434c5e;
  text-align: center;
  margin-top: 32px;
}

.node-card {
  background: #0d1017;
  border: 1px solid #1e2228;
  border-radius: 4px;
  padding: 10px 12px;
  margin-bottom: 8px;
}

.node-name {
  font-size: 13px;
  font-weight: 600;
  color: #d8dee9;
}

.node-behavior {
  font-size: 11px;
  color: #a3be8c;
  margin-top: 2px;
}

.node-stats {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #4c566a;
  margin-top: 6px;
}

.reward.positive { color: #a3be8c; }
.reward.improving { color: #ebcb8b; }
.reward.negative { color: #bf616a; }

.node-bar {
  height: 3px;
  background: #1e2228;
  border-radius: 2px;
  margin-top: 6px;
  overflow: hidden;
}

.node-bar-fill {
  height: 100%;
  background: #a3be8c;
  transition: width 0.4s ease;
}
</style>
