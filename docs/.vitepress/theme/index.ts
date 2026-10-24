import { h } from 'vue'
import BlogTheme from '@sugarat/theme'

// 自定义样式重载
import './style.css'

// 自定义主题色
// import './user-theme.css'

// 摄影画廊组件
import Gallery from './components/Gallery.vue'
import BlogComment from './components/BlogComment.vue'
import BlogMusicPlayer from './components/BlogMusicPlayer.vue'

export default {
  extends: BlogTheme,
  Layout: () =>
    h(BlogTheme.Layout, null, {
      'doc-after': () => h(BlogComment),
      'layout-bottom': () => h(BlogMusicPlayer),
    }),
  enhanceApp({ app }) {
    app.component('Gallery', Gallery)
  },
}
