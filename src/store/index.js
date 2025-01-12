import { createStore } from 'vuex';

export default createStore
({
  state: 
  {
    Logged: 0,
  },
  mutations:
  {
    setLogged(state, status) 
    {
      state.Logged = status;
    },
  },
  actions: 
  {
    login({ commit }) 
    {
      commit('setLogged', 1);
    },
    logout({ commit }) 
    {
      commit('setLogged', 0);
    },
  },
  getters: 
  {
    isLogged: (state) => state.Logged === 1,
  },
});
