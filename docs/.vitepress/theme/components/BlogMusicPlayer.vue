<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import 'aplayer/dist/APlayer.min.css'
import { musicConfig } from '../integrations'

interface Track {
  name: string
  artist?: string
  url: string
  cover?: string
  lrc?: string
}

const tracks = ref<Track[]>([])
const hasTracks = ref(false)
const expanded = ref(false)
const playing = ref(false)
const playerEl = ref<HTMLDivElement>()

let player: any = null
let initializing = false

onMounted(async () => {
  try {
    const res = await fetch(withBase(musicConfig.playlistUrl), { cache: 'no-cache' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const list = await res.json()
    if (!Array.isArray(list)) throw new Error('歌单内容应为数组')
    tracks.value = list.filter((track: Track) => track?.name && track?.url)
    hasTracks.value = tracks.value.length > 0
  } catch (error) {
    console.warn('[blog-music] 歌单加载失败：', error)
  }
})

async function expand() {
  expanded.value = true
  await nextTick()
  if (player || initializing) return

  initializing = true
  try {
    const mod: any = await import('aplayer')
    if (!expanded.value) return

    const APlayer = mod.default ?? mod
    const brand = getComputedStyle(document.documentElement)
      .getPropertyValue('--vp-c-brand-1')
      .trim()

    player = new APlayer({
      container: playerEl.value,
      audio: tracks.value.map(track => ({
        ...track,
        artist: track.artist || '未知歌手',
        cover: track.cover || withBase('/logo.png'),
      })),
      autoplay: false,
      theme: brand || '#409eff',
      loop: 'all',
      order: 'list',
      preload: 'none',
      lrcType: tracks.value.some(track => track.lrc) ? 3 : 0,
      volume: musicConfig.volume,
      listFolded: true,
      listMaxHeight: '220px',
      storageName: 'blog-music',
      mutex: true,
    })

    player.on('play', () => {
      playing.value = true
    })
    player.on('pause', () => {
      playing.value = false
    })
  } catch (error) {
    console.error('[blog-music] 播放器初始化失败：', error)
    expanded.value = false
  } finally {
    initializing = false
  }
}

function toggle() {
  if (expanded.value) {
    expanded.value = false
  } else {
    expand()
  }
}

onBeforeUnmount(() => {
  player?.destroy()
})
</script>

<template>
  <div v-if="hasTracks" class="blog-music">
    <transition name="music-panel">
      <section v-show="expanded" class="blog-music__panel">
        <header class="blog-music__header">
          <span class="blog-music__title">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z"
              />
            </svg>
            音乐
          </span>
          <span class="blog-music__count">{{ tracks.length }} 首</span>
          <button class="blog-music__collapse" type="button" aria-label="收起播放器" @click="expanded = false">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path fill="currentColor" d="M12 15.5 5.5 9l1.4-1.4L12 12.7l5.1-5.1L18.5 9 12 15.5Z" />
            </svg>
          </button>
        </header>
        <div ref="playerEl" class="blog-music__player" />
      </section>
    </transition>

    <button
      v-if="!expanded"
      class="blog-music__fab"
      :class="{ 'is-playing': playing }"
      type="button"
      aria-label="打开音乐播放器"
      title="音乐播放器"
      @click="toggle"
    >
      <span v-if="playing" class="blog-music__bars" aria-hidden="true">
        <i /><i /><i />
      </span>
      <svg v-else viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.blog-music {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  max-width: calc(100vw - 40px);
}

.blog-music__panel {
  width: 340px;
  max-width: 100%;
  padding: 10px 12px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-elv);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
}

.blog-music__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 2px 8px;
}

.blog-music__title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.blog-music__count {
  margin-left: auto;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.blog-music__collapse {
  display: inline-flex;
  padding: 2px;
  color: var(--vp-c-text-3);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 4px;
}

.blog-music__collapse:hover {
  color: var(--vp-c-text-1);
}

.blog-music__fab {
  display: grid;
  width: 52px;
  height: 52px;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16);
  place-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.blog-music__fab:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
  transform: translateY(-2px);
}

.blog-music__fab.is-playing {
  color: #fff;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  border-color: transparent;
}

.blog-music__bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 18px;
}

.blog-music__bars i {
  width: 3px;
  height: 100%;
  background: currentColor;
  border-radius: 2px;
  animation: music-bounce 0.9s ease-in-out infinite;
}

.blog-music__bars i:nth-child(2) {
  height: 60%;
  animation-delay: -0.3s;
}

.blog-music__bars i:nth-child(3) {
  height: 80%;
  animation-delay: -0.6s;
}

@keyframes music-bounce {
  0%,
  100% {
    transform: scaleY(0.35);
  }
  50% {
    transform: scaleY(1);
  }
}

.music-panel-enter-active,
.music-panel-leave-active {
  transform-origin: left bottom;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.music-panel-enter-from,
.music-panel-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}

@media (max-width: 640px) {
  .blog-music {
    right: 12px;
    bottom: 12px;
    left: 12px;
    max-width: none;
  }

  .blog-music__panel {
    width: 100%;
  }
}
</style>

<style>
.blog-music .aplayer {
  margin: 0;
  color: var(--vp-c-text-1);
  font-family: inherit;
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  box-shadow: none;
}

.blog-music .aplayer .aplayer-info .aplayer-music .aplayer-title {
  color: var(--vp-c-text-1);
}

.blog-music .aplayer .aplayer-info .aplayer-music .aplayer-author {
  color: var(--vp-c-text-3);
}

.blog-music .aplayer .aplayer-list ol li {
  color: var(--vp-c-text-2);
  border-top-color: var(--vp-c-divider);
}

.blog-music .aplayer .aplayer-list ol li:hover {
  background: var(--vp-c-default-soft);
}

.blog-music .aplayer .aplayer-list ol li.aplayer-list-light {
  background: var(--vp-c-brand-soft);
}

.blog-music .aplayer .aplayer-list ol li.aplayer-list-light .aplayer-list-title {
  color: var(--vp-c-brand-1);
}

.blog-music .aplayer .aplayer-list ol li .aplayer-list-author {
  color: var(--vp-c-text-3);
}

.blog-music .aplayer .aplayer-volume-wrap .aplayer-volume-bar-wrap .aplayer-volume-bar {
  background: var(--vp-c-divider);
}
</style>
