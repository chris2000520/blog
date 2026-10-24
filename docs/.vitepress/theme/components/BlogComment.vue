<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import { twikooConfig } from '../integrations'

const route = useRoute()
const { frontmatter, page, isDark } = useData()

const isDev = import.meta.env.DEV
const container = ref<HTMLDivElement>()
const containerKey = ref(0)
const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const message = ref('')

const visible = computed(() => {
  if (page.value.isNotFound) return false
  if (frontmatter.value.comment === false) return false
  const layout = frontmatter.value.layout
  return layout === undefined || layout === 'doc'
})

const enabled = computed(() => visible.value && Boolean(twikooConfig.envId))

// 统一开发环境（/foo）和构建产物（/foo.html）的评论路径
const commentPath = computed(() => {
  let path = route.path.replace(/index\.html$/, '').replace(/\.html$/, '')
  path = path.replace(/\/+$/, '')
  return path || '/'
})

let initToken = 0

async function mountTwikoo() {
  if (!enabled.value) {
    if (isDev && visible.value) {
      status.value = 'error'
      message.value = '尚未配置 Twikoo，请在 docs/.vitepress/theme/integrations.ts 中填写 envId。'
    }
    return
  }

  const token = ++initToken
  status.value = 'loading'
  message.value = ''

  try {
    const mod: any = await import('twikoo')
    if (token !== initToken || !container.value) return

    const twikoo = typeof mod.default?.init === 'function' ? mod.default : mod
    container.value.innerHTML = ''
    await twikoo.init({
      envId: twikooConfig.envId,
      el: container.value,
      path: commentPath.value,
      lang: twikooConfig.lang,
      onCommentLoaded: () => {
        if (token === initToken) status.value = 'ready'
      },
    })
    if (token === initToken) status.value = 'ready'
  } catch (error) {
    if (token === initToken) {
      status.value = 'error'
      message.value = '评论加载失败，请稍后再试。'
    }
    console.error('[blog-comment] Twikoo 初始化失败：', error)
  }
}

onMounted(mountTwikoo)

watch([enabled, commentPath], async ([isEnabled]) => {
  if (!isEnabled) return
  containerKey.value += 1
  await nextTick()
  mountTwikoo()
})
</script>

<template>
  <section
    v-if="enabled || (isDev && visible)"
    class="blog-comment"
    :data-theme="isDark ? 'dark' : 'light'"
    data-pagefind-ignore="all"
  >
    <p v-if="status === 'loading'" class="blog-comment__loading">评论加载中…</p>
    <p v-if="status === 'error'" class="blog-comment__error">{{ message }}</p>
    <div :key="containerKey" ref="container" />
  </section>
</template>

<style scoped>
.blog-comment {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.blog-comment__loading,
.blog-comment__error {
  margin: 0;
  padding: 8px 0;
  font-size: 14px;
  color: var(--vp-c-text-3);
}
</style>
