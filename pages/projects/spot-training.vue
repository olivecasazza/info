<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>spot training</h1>
      <span class="status" :class="{ connected: status.connected }">
        {{ status.text }}
      </span>
    </header>
    <div class="panels">
      <div class="panel-3d">
        <iframe
          src="/projects/spot"
          frameborder="0"
          allow="autoplay"
        />
      </div>
      <div class="panel-metrics">
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
          <iframe
            v-if="activeTab === 'rerun'"
            :src="rerunUrl"
            frameborder="0"
          />
          <div v-else-if="activeTab === 'nodes'" class="nodes-panel">
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
    </div>
  </div>
</template>

<script setup>
const activeTab = ref('rerun')
const rerunUrl = ref('http://192.168.1.35:9091/?url=rerun%2Bhttp%3A%2F%2F192.168.1.35%3A9877%2Fproxy')

const tabs = [
  { id: 'rerun', label: 'metrics' },
  { id: 'nodes', label: 'nodes' },
]

const status = ref({ connected: false, text: 'connecting...' })
const nodes = ref({})

function formatSteps(steps) {
  if (!steps) return '?'
  if (steps > 1e6) return (steps / 1e6).toFixed(1) + 'M'
  if (steps > 1e3) return (steps / 1e3).toFixed(0) + 'K'
  return steps
}

function rewardClass(reward) {
  if (!reward) return ''
  if (reward > 0) return 'positive'
  if (reward > -5000) return 'improving'
  return 'negative'
}

function progressPercent(steps) {
  if (!steps) return 0
  return Math.min(100, (steps / 50000000) * 100)
}

let pollInterval = null
onMounted(() => {
  pollInterval = setInterval(async () => {
    try {
      const res = await fetch('/api/training-status')
      if (res.ok) {
        const data = await res.json()
        nodes.value = data.nodes || {}
        const best = Object.entries(nodes.value)
          .reduce((b, [k, v]) => (v.reward > b.reward ? { name: k, ...v } : b), { reward: -Infinity })
        status.value = {
          connected: true,
          text: `${Object.keys(nodes.value).length} nodes | best: ${best.name} r=${best.reward?.toFixed(0)} | ${formatSteps(best.steps)} steps`,
        }
      }
    } catch {
      status.value = { connected: false, text: 'no api' }
    }
  }, 5000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>

<style scoped>
.dashboard {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
  color: #e0e0e0;
  font-family: 'JetBrains Mono', monospace;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 16px;
  background: #111;
  border-bottom: 1px solid #222;
  height: 32px;
  flex-shrink: 0;
}

.dashboard-header h1 {
  font-size: 13px;
  font-weight: 500;
  color: #8f8;
}

.status {
  font-size: 11px;
  color: #666;
}

.status.connected {
  color: #8f8;
}

.panels {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.panel-3d {
  flex: 1;
  border-right: 1px solid #222;
}

.panel-3d iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: #000;
}

.panel-metrics {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.metrics-tabs {
  display: flex;
  background: #111;
  border-bottom: 1px solid #222;
  flex-shrink: 0;
}

.metrics-tabs button {
  padding: 5px 14px;
  background: transparent;
  color: #666;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  text-transform: lowercase;
}

.metrics-tabs button.active {
  color: #8f8;
  border-bottom-color: #8f8;
}

.metrics-tabs button:hover {
  color: #ccc;
}

.metrics-content {
  flex: 1;
  overflow: hidden;
}

.metrics-content iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.nodes-panel {
  padding: 12px;
  overflow-y: auto;
  height: 100%;
}

.node-card {
  background: #151515;
  border: 1px solid #222;
  border-radius: 4px;
  padding: 10px 12px;
  margin-bottom: 8px;
}

.node-name {
  font-size: 13px;
  font-weight: 600;
  color: #ccc;
}

.node-behavior {
  font-size: 11px;
  color: #8f8;
  margin-top: 2px;
}

.node-stats {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #888;
  margin-top: 6px;
}

.reward.positive { color: #4f4; }
.reward.improving { color: #ff8; }
.reward.negative { color: #f88; }

.node-bar {
  height: 3px;
  background: #222;
  border-radius: 2px;
  margin-top: 6px;
  overflow: hidden;
}

.node-bar-fill {
  height: 100%;
  background: #8f8;
  transition: width 0.3s;
}
</style>
