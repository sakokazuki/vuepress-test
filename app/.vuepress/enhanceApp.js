import Vuex from 'vuex'

export default ({
  Vue,
  options,
  router,
  siteData
}) => {

  
  Vue.use(Vuex);

  const state = {
    currentLang: 'jp'
  }

  const modules = {

  }

  const mutations = {
    changeLang(state, lang){
      state.currentLang = lang
    }
  }

  const actions = {
    changeLang({commit}, path){
      const lang = path === '/' ? 'jp' : 'en'

      commit('changeLang', lang);
    }
  }

  const store = new Vuex.Store({
    state,
    modules,
    mutations,
    actions,
  })
  Vue.mixin({store: store})

  async function afterEach(to, from, next) {
    store.dispatch('changeLang', to.path);
    await router.app.$nextTick()
  }

  router.afterEach(afterEach)
}