<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { withBase } from 'vitepress'
import photos from '../../../gallery/photos.json'

interface Photo {
  title: string
  location: string
  date: string
  camera: string
  src: string
  width: number
  height: number
}

const list = photos as Photo[]

function joinMeta(parts: (string | undefined)[]) {
  return parts.filter(Boolean).join(' · ')
}

// 缤纷云图片处理：网格用小图、lightbox 用大图，按需实时缩放
function imageUrl(url: string, params: string) {
  return withBase(url) + (url.includes('?') ? '&' : '?') + params
}

function thumbUrl(url: string) {
  return imageUrl(url, 'w=800&q=80')
}

function largeUrl(url: string) {
  return imageUrl(url, 'w=1920&q=85')
}

// 骨架 → 渐进显示
const loaded = ref<boolean[]>([])

// —— justified 等高行布局 ——
const GAP = 12
const gridEl = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
let resizeObserver: ResizeObserver | null = null

const targetRowHeight = computed(() => (containerWidth.value < 640 ? 180 : 300))

interface LayoutRow {
  indices: number[]
  height: number
  widths: number[]
}

const layoutRows = computed<LayoutRow[]>(() => {
  const w = containerWidth.value
  if (w <= 0 || list.length === 0)
    return []

  const target = targetRowHeight.value
  const rows: LayoutRow[] = []
  let cur: number[] = []
  let totalRatio = 0

  const flush = (indices: number[], h: number) => {
    rows.push({
      indices,
      height: h,
      widths: indices.map(i => (list[i].width / list[i].height) * h),
    })
  }

  for (let i = 0; i < list.length; i++) {
    cur.push(i)
    totalRatio += list[i].width / list[i].height
    const avail = w - GAP * (cur.length - 1)
    const h = avail / totalRatio
    if (h <= target) {
      flush(cur, h)
      cur = []
      totalRatio = 0
    }
  }
  if (cur.length)
    flush(cur, target)

  return rows
})

// —— lightbox ——
const current = ref<number | null>(null)
const currentPhoto = computed<Photo | null>(() =>
  current.value === null ? null : list[current.value],
)

function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

function open(i: number) {
  current.value = i
  lockScroll(true)
}

function close() {
  current.value = null
  lockScroll(false)
}

function next() {
  if (current.value !== null)
    current.value = (current.value + 1) % list.length
}

function prev() {
  if (current.value !== null)
    current.value = (current.value - 1 + list.length) % list.length
}

function onKey(e: KeyboardEvent) {
  if (current.value === null)
    return
  if (e.key === 'Escape')
    close()
  else if (e.key === 'ArrowRight')
    next()
  else if (e.key === 'ArrowLeft')
    prev()
}

function updateContainerWidth() {
  if (gridEl.value)
    containerWidth.value = gridEl.value.clientWidth
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  updateContainerWidth()
  if (gridEl.value) {
    resizeObserver = new ResizeObserver((entries) => {
      containerWidth.value = entries[0].contentRect.width
    })
    resizeObserver.observe(gridEl.value)
  }
  window.addEventListener('resize', updateContainerWidth)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', updateContainerWidth)
  resizeObserver?.disconnect()
  lockScroll(false)
})
</script>

<template>
  <div class="gallery">
    <div ref="gridEl" class="gallery-grid">
      <div v-for="(row, ri) in layoutRows" :key="ri" class="gallery-row">
        <figure
          v-for="(idx, ci) in row.indices"
          :key="list[idx].src"
          class="gallery-item"
          :class="{ 'is-loaded': loaded[idx] }"
          :style="{ width: `${row.widths[ci]}px`, height: `${row.height}px` }"
          @click.stop="open(idx)"
        >
          <img :src="thumbUrl(list[idx].src)" :alt="list[idx].title" loading="lazy" @load="loaded[idx] = true">
          <figcaption class="gallery-item__overlay">
            <span class="gallery-item__title">{{ list[idx].title }}</span>
            <span class="gallery-item__meta">{{ joinMeta([list[idx].location, list[idx].date]) }}</span>
          </figcaption>
        </figure>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="lightbox-fade">
        <div v-if="currentPhoto" class="lightbox" @click.self="close">
          <button class="lightbox__close" aria-label="关闭" @click="close">×</button>
          <div class="lightbox__counter">{{ (current as number) + 1 }} / {{ list.length }}</div>

          <button
            class="lightbox__nav lightbox__prev"
            aria-label="上一张"
            :disabled="list.length <= 1"
            @click.stop="prev"
          >
            ‹
          </button>

          <figure class="lightbox__body">
            <img :src="largeUrl(currentPhoto.src)" :alt="currentPhoto.title">
            <figcaption class="lightbox__caption">
              <span class="lightbox__title">{{ currentPhoto.title }}</span>
              <span class="lightbox__meta">
                {{ joinMeta([currentPhoto.location, currentPhoto.date, currentPhoto.camera]) }}
              </span>
            </figcaption>
          </figure>

          <button
            class="lightbox__nav lightbox__next"
            aria-label="下一张"
            :disabled="list.length <= 1"
            @click.stop="next"
          >
            ›
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.gallery {
  max-width: 1120px;
  margin: 0 auto;
  padding: 8px 24px 48px;
}

.gallery-grid {
  width: 100%;
}

.gallery-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.gallery-item {
  position: relative;
  flex-shrink: 0;
  cursor: zoom-in;
  overflow: hidden;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
}

/* 骨架：加载完成前的扫光 */
.gallery-item::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
  transform: translateX(-100%);
  animation: gallery-shimmer 1.4s infinite;
}

.gallery-item.is-loaded::after {
  display: none;
}

.gallery-item img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.4s ease;
}

.gallery-item.is-loaded img {
  opacity: 1;
}

.gallery-item:hover img {
  transform: scale(1.04);
}

@keyframes gallery-shimmer {
  100% {
    transform: translateX(100%);
  }
}

.gallery-item__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent 45%);
  opacity: 0;
  transition: opacity 0.3s;
  color: #fff;
  pointer-events: none;
}

.gallery-item:hover .gallery-item__overlay {
  opacity: 1;
}

.gallery-item__title {
  font-size: 15px;
  font-weight: 600;
}

.gallery-item__meta {
  margin-top: 2px;
  font-size: 12px;
  opacity: 0.85;
}

/* lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.92);
}

.lightbox__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90vw;
  max-height: 88vh;
  margin: 0;
}

.lightbox__body img {
  max-width: 90vw;
  max-height: 74vh;
  object-fit: contain;
}

.lightbox__caption {
  margin-top: 16px;
  text-align: center;
  color: #ccc;
}

.lightbox__title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.lightbox__meta {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  color: #aaa;
}

.lightbox__close {
  position: absolute;
  top: 24px;
  right: 32px;
  font-size: 36px;
  line-height: 1;
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.8;
}

.lightbox__counter {
  position: absolute;
  top: 28px;
  left: 32px;
  font-size: 14px;
  color: #ccc;
}

.lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  font-size: 40px;
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.8;
}

.lightbox__prev { left: 24px; }
.lightbox__next { right: 24px; }

.lightbox__nav:hover,
.lightbox__close:hover {
  opacity: 1;
}

.lightbox__nav:disabled {
  opacity: 0.2;
  cursor: default;
}

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.2s;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

@media (max-width: 639px) {
  .gallery-row {
    gap: 8px;
    margin-bottom: 8px;
  }
  .lightbox__nav {
    width: 44px;
    height: 44px;
    font-size: 30px;
  }
  .lightbox__prev { left: 8px; }
  .lightbox__next { right: 8px; }
}
</style>

<style>
/* 画廊页标题区（标题在 Gallery 组件之外，需非 scoped） */
.gallery-header {
  padding: 56px 24px 44px;
  text-align: center;
}

.gallery-header__title {
  margin: 0;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: var(--vp-c-text-1);
  animation: gallery-fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.gallery-header__desc {
  margin: 14px 0 0;
  font-size: 14px;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-2);
  animation: gallery-fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both;
}

@keyframes gallery-fade-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
