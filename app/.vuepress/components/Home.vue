<template lang="pug">
.home
  p {{currentLang}}
  p ホームです
    
</template>

<script>
import { mapState } from 'vuex'

export default {
  props:{},
  components: {},
  computed: {
    ...mapState(['currentLang']),
  },
  methods: {},
  created () {
  },
  mounted () {
  },
  data () {
    return {}
  },
}
</script>

<style lang="stylus" scoped>
p
  color: #f00
</style>

