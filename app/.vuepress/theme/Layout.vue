<template lang="pug">
  .theme-container
    Content(:custom="false")
</template>

<script>
import Vue from 'vue'

export default {
  components: { },
  data () {
    return {}
  },
  computed: {
    
  },
  created () {
    if (this.$ssrContext) {
      this.$ssrContext.title = this.$title
      this.$ssrContext.lang = this.$lang
      this.$ssrContext.description = this.$page.description || this.$description
      const localeHeadTags = (this.$localeConfig.head || []).map(this.renderHeadTag).join('\n ');
      this.$ssrContext.userHeadTags = `${this.$ssrContext.userHeadTags}\n ${localeHeadTags}`
    }
  },

  mounted () {
    // update title / meta tags
    this.currentMetaTags = []
    const updateMeta = () => {
      document.title = this.$title
      document.documentElement.lang = this.$lang
      const meta = [
        {
          name: 'description',
          content: this.$description
        },
        ...(this.$page.frontmatter.meta || [])
      ]
      this.currentMetaTags = updateMetaTags(meta, this.currentMetaTags)
    }
    this.$watch('$page', updateMeta)
    updateMeta()

    
  },

  beforeDestroy () {
    updateMetaTags(null, this.currentMetaTags)
  },

  methods: {
    renderHeadTag (tag) {
      const { tagName, attributes, innerHTML, closeTag } = this.normalizeHeadTag(tag)
      return `<${tagName}${this.renderAttrs(attributes)}>${innerHTML}${closeTag ? `</${tagName}>` : ``}`
    },
    normalizeHeadTag (tag) {
      if (typeof tag === 'string') {
        tag = [tag]
      }
      const tagName = tag[0]
      return {
        tagName,
        attributes: tag[1] || {},
        innerHTML: tag[2] || '',
        closeTag: !(tagName === 'meta' || tagName === 'link')
      }
    },
    renderAttrs (attrs = {}) {
      const keys = Object.keys(attrs)
      if (keys.length) {
        keys.map(name =>{
          `${name}="${escape(attrs[name])}"`
        })

        return ' ' + keys.map(name => `${name}="${attrs[name]}"`).join(' ')
      } else {
        return ''
      }
    }
  }
}

function updateMetaTags (meta, current) {
  if (current) {
    current.forEach(c => {
      document.head.removeChild(c)
    })
  }
  if (meta) {
    return meta.map(m => {
      const tag = document.createElement('meta')
      Object.keys(m).forEach(key => {
        tag.setAttribute(key, m[key])
      })
      document.head.appendChild(tag)
      return tag
    })
  }
}
</script>

<style src="./styles/reset.styl" lang="stylus"></style>

