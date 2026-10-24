<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
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
  // lightbox 用原图，放大后才能看清细节
  return withBase(url)
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

// —— lightbox 缩放 / 拖拽 ——
const MIN_SCALE = 1
const MAX_SCALE = 5
const ZOOM_STEP = 1.4

const stageEl = ref<HTMLElement | null>(null)
const imgEl = ref<HTMLImageElement | null>(null)
const scale = ref(1)
const offset = ref({ x: 0, y: 0 })
const dragging = ref(false)
const zoomPercent = computed(() => Math.round(scale.value * 100))

const pointerMap = new Map<number, { x: number; y: number }>()
let dragStart: { x: number; y: number; ox: number; oy: number } | null = null
let pinchStart: {
  distance: number
  scale: number
  midX: number
  midY: number
  ox: number
  oy: number
} | null = null

function clampScale(value: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value))
}

function clampOffset(x: number, y: number, nextScale = scale.value) {
  const stage = stageEl.value
  const img = imgEl.value
  if (!stage || !img)
    return { x: 0, y: 0 }
  const maxX = Math.max(0, (img.offsetWidth * nextScale - stage.clientWidth) / 2)
  const maxY = Math.max(0, (img.offsetHeight * nextScale - stage.clientHeight) / 2)
  return {
    x: Math.min(maxX, Math.max(-maxX, x)),
    y: Math.min(maxY, Math.max(-maxY, y)),
  }
}

function setScale(target: number, clientX?: number, clientY?: number) {
  const stage = stageEl.value
  const from = scale.value
  const to = clampScale(target)
  if (!stage || Math.abs(to - from) < 0.001)
    return
  if (to === MIN_SCALE) {
    scale.value = MIN_SCALE
    offset.value = { x: 0, y: 0 }
    return
  }
  const rect = stage.getBoundingClientRect()
  const cx = (clientX ?? rect.left + rect.width / 2) - rect.left - rect.width / 2
  const cy = (clientY ?? rect.top + rect.height / 2) - rect.top - rect.height / 2
  const ratio = to / from
  scale.value = to
  offset.value = clampOffset(
    cx - ratio * (cx - offset.value.x),
    cy - ratio * (cy - offset.value.y),
    to,
  )
}

function zoomBy(factor: number) {
  setScale(scale.value * factor)
}

function resetZoom() {
  scale.value = MIN_SCALE
  offset.value = { x: 0, y: 0 }
  dragging.value = false
  pointerMap.clear()
  dragStart = null
  pinchStart = null
}

function onWheel(e: WheelEvent) {
  setScale(scale.value * Math.exp(-e.deltaY * 0.002), e.clientX, e.clientY)
}

function onDoubleClick(e: MouseEvent) {
  if (scale.value > MIN_SCALE)
    resetZoom()
  else
    setScale(2.5, e.clientX, e.clientY)
}

function pointerDistance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'mouse' && e.button !== 0)
    return
  const stage = stageEl.value
  if (!stage)
    return
  stage.setPointerCapture(e.pointerId)
  pointerMap.set(e.pointerId, { x: e.clientX, y: e.clientY })

  if (pointerMap.size === 1 && scale.value > MIN_SCALE) {
    dragStart = { x: e.clientX, y: e.clientY, ox: offset.value.x, oy: offset.value.y }
    dragging.value = true
  }
  else if (pointerMap.size === 2) {
    const [a, b] = [...pointerMap.values()]
    dragStart = null
    dragging.value = false
    pinchStart = {
      distance: Math.max(1, pointerDistance(a, b)),
      scale: scale.value,
      midX: (a.x + b.x) / 2,
      midY: (a.y + b.y) / 2,
      ox: offset.value.x,
      oy: offset.value.y,
    }
  }
}

function onPointerMove(e: PointerEvent) {
  if (!pointerMap.has(e.pointerId))
    return
  pointerMap.set(e.pointerId, { x: e.clientX, y: e.clientY })
  const stage = stageEl.value
  if (!stage)
    return

  if (pointerMap.size >= 2 && pinchStart) {
    const [a, b] = [...pointerMap.values()]
    const rect = stage.getBoundingClientRect()
    const midX = (a.x + b.x) / 2
    const midY = (a.y + b.y) / 2
    const nextScale = clampScale(
      pinchStart.scale * (pointerDistance(a, b) / pinchStart.distance),
    )
    const ratio = nextScale / pinchStart.scale
    const cx = pinchStart.midX - rect.left - rect.width / 2
    const cy = pinchStart.midY - rect.top - rect.height / 2
    const nx = midX - rect.left - rect.width / 2
    const ny = midY - rect.top - rect.height / 2
    scale.value = nextScale
    offset.value = clampOffset(
      nx - ratio * (cx - pinchStart.ox),
      ny - ratio * (cy - pinchStart.oy),
      nextScale,
    )
    return
  }

  if (dragStart) {
    offset.value = clampOffset(
      dragStart.ox + e.clientX - dragStart.x,
      dragStart.oy + e.clientY - dragStart.y,
    )
  }
}

function onPointerEnd(e: PointerEvent) {
  pointerMap.delete(e.pointerId)
  if (pointerMap.size < 2)
    pinchStart = null

  if (pointerMap.size === 0) {
    dragging.value = false
    dragStart = null
  }
  else if (pointerMap.size === 1 && scale.value > MIN_SCALE) {
    const [p] = [...pointerMap.values()]
    dragStart = { x: p.x, y: p.y, ox: offset.value.x, oy: offset.value.y }
    dragging.value = true
  }
  else {
    dragging.value = false
    dragStart = null
  }
}

function onImageLoad() {
  offset.value = clampOffset(offset.value.x, offset.value.y)
}

watch(current, resetZoom)

function onKey(e: KeyboardEvent) {
  if (current.value === null)
    return
  if (e.key === 'Escape') {
    close()
    return
  }
  if (e.ctrlKey || e.metaKey || e.altKey)
    return
  if (e.key === 'ArrowRight')
    next()
  else if (e.key === 'ArrowLeft')
    prev()
  else if (e.key === '+' || e.key === '=')
    zoomBy(ZOOM_STEP)
  else if (e.key === '-')
    zoomBy(1 / ZOOM_STEP)
  else if (e.key === '0')
    resetZoom()
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
            <div class="lightbox__stage-wrap">
              <div
                ref="stageEl"
                class="lightbox__stage"
                :class="{ 'is-zoomed': scale > 1, 'is-dragging': dragging }"
                @wheel.prevent="onWheel"
                @dblclick="onDoubleClick"
                @pointerdown="onPointerDown"
                @pointermove="onPointerMove"
                @pointerup="onPointerEnd"
                @pointercancel="onPointerEnd"
              >
                <img
                  ref="imgEl"
                  :src="largeUrl(currentPhoto.src)"
                  :alt="currentPhoto.title"
                  draggable="false"
                  :style="{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})` }"
                  @load="onImageLoad"
                >
              </div>
            </div>
            <figcaption class="lightbox__caption">
              <span class="lightbox__title">{{ currentPhoto.title }}</span>
              <span class="lightbox__meta">
                {{ joinMeta([currentPhoto.location, currentPhoto.date, currentPhoto.camera]) }}
              </span>
            </figcaption>
          </figure>

          <div class="lightbox__toolbar" @click.stop>
            <button type="button" aria-label="缩小" title="缩小" @click="zoomBy(1 / ZOOM_STEP)">−</button>
            <span class="lightbox__zoom">{{ zoomPercent }}%</span>
            <button type="button" aria-label="放大" title="放大" @click="zoomBy(ZOOM_STEP)">+</button>
            <button type="button" class="lightbox__reset" aria-label="重置缩放" title="重置缩放" @click="resetZoom">
              重置
            </button>
          </div>
          <p class="lightbox__hint">滚轮 / 双指缩放 · 拖动查看 · 双击放大</p>

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
  width: min(92vw, 1400px);
  height: 86vh;
  margin: 0;
}

.lightbox__stage-wrap {
  position: relative;
  flex: 1;
  width: 100%;
  min-height: 0;
}

.lightbox__stage {
  position: absolute;
  inset: 44px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  cursor: zoom-in;
}

.lightbox__stage.is-zoomed {
  cursor: grab;
}

.lightbox__stage.is-dragging {
  cursor: grabbing;
}

.lightbox__stage img {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
  transform-origin: center center;
  will-change: transform;
}

.lightbox__caption {
  flex-shrink: 0;
  max-width: 100%;
  margin-top: 16px;
  padding: 0 16px;
  text-align: center;
  color: #ccc;
}

.lightbox__toolbar {
  position: absolute;
  top: 20px;
  left: 50%;
  z-index: 4;
  display: flex;
  gap: 2px;
  align-items: center;
  padding: 4px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  backdrop-filter: blur(8px);
  transform: translateX(-50%);
}

.lightbox__toolbar button {
  min-width: 32px;
  height: 28px;
  padding: 0 8px;
  font-size: 16px;
  line-height: 1;
  color: #fff;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 999px;
}

.lightbox__toolbar button:hover {
  background: rgba(255, 255, 255, 0.14);
}

.lightbox__zoom {
  min-width: 48px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: #ddd;
  text-align: center;
}

.lightbox__reset {
  font-size: 12px !important;
}

.lightbox__hint {
  position: absolute;
  bottom: 16px;
  left: 50%;
  z-index: 3;
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  pointer-events: none;
  transform: translateX(-50%);
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
  z-index: 4;
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
  z-index: 4;
  font-size: 14px;
  color: #ccc;
}

.lightbox__nav {
  position: absolute;
  top: 50%;
  z-index: 3;
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
  .lightbox__body {
    width: 100%;
    height: 100dvh;
    padding: 68px 0 44px;
    box-sizing: border-box;
  }
  .lightbox__caption {
    margin-top: 8px;
    font-size: 13px;
  }
  .lightbox__stage {
    inset: 0;
  }
  .lightbox__toolbar {
    top: 10px;
  }
  .lightbox__hint {
    bottom: 10px;
    font-size: 11px;
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
