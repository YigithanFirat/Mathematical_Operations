import { createStore } from 'vuex';

// Güvenli JSON.parse
function safeParse(item) {
  try {
    const parsed = JSON.parse(item);
    return parsed ?? null;
  } catch (e) {
    console.error('JSON parse hatası:', e);
    return null;
  }
}

export default createStore({
  state: {
    Logged: safeParse(localStorage.getItem('Logged')) === 1,
    user: safeParse(localStorage.getItem('user')),
  },

  mutations: {
    setLogged(state, status) {
      state.Logged = status;
      localStorage.setItem('Logged', JSON.stringify(status ? 1 : 0));
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
      commit('setLogged', true);
      commit('setUser', userData);
    },

    logout({ commit }) {
      commit('setLogged', false);
      commit('clearUser');
      localStorage.removeItem('Logged');
    },
  },

  getters: {
    isLogged: (state) => state.Logged,
    userId: (state) => state.user?.id ?? null,
    userNickname: (state) => state.user?.nickname ?? '',
  },
});