import { createStore } from 'vuex';

export default createStore
({
  state: 
  {
    Logged: JSON.parse(localStorage.getItem('Logged')) || 0,
  },

  mutations: 
  {
    setLogged(state, status) 
    {
      state.Logged = status;
      localStorage.setItem('Logged', JSON.stringify(status));
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
      localStorage.removeItem('Logged');
    },
  },

  getters: 
  {
    isLogged: (state) => state.Logged === 1,
  },
});
