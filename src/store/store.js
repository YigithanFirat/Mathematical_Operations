import { createStore } from 'vuex';

// Güvenli JSON.parse
function safeParse(item) {
  try {
    if (item && item !== 'undefined') {
      return JSON.parse(item);
    }
  } catch (e) {
    console.error('JSON parse hatası:', e);
  }
  return null;
}

export default createStore({
  state: {
    Logged: safeParse(localStorage.getItem('Logged')) || 0,
    user: safeParse(localStorage.getItem('user')) || null,
  },

  mutations: {
    setLogged(state, status) {
      state.Logged = status;
      localStorage.setItem('Logged', JSON.stringify(status));
    },

    setUser(state, userData) {
      state.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
    },

    clearUser(state) {
      state.user = null;
      localStorage.removeItem('user');
    },
  },

  actions: {
    login({ commit }, userData) {
      commit('setLogged', 1);
      commit('setUser', userData);
    },

    logout({ commit }) {
      commit('setLogged', 0);
      commit('clearUser');
      localStorage.removeItem('Logged');
    },
  },

  getters: {
    isLogged: (state) => state.Logged === 1,
    userId: (state) => state.user?.id || null,
    userNickname: (state) => state.user?.nickname || '',
  },
});