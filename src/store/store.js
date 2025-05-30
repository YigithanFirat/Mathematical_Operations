import { createStore } from 'vuex';

// Güvenli JSON.parse
function safeParse(data) {
  try {
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("JSON parse hatası:", e);
    return null;
  }
}

const saved = localStorage.getItem('myStore');
const parsed = safeParse(saved);

export default createStore({
  state: {
    Logged: Boolean(safeParse(localStorage.getItem('Logged'))), // true/false olarak tut
    user: safeParse(localStorage.getItem('user')),
  },

  mutations: {
    setLogged(state, status) {
      state.Logged = Boolean(status);
      localStorage.setItem('Logged', JSON.stringify(state.Logged ? 1 : 0));
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
    userRole: (state) => state.user?.role ?? '', // ← History.vue için önemli
    isAdmin: (state) => state.user?.role === 'admin', // ← Şartlı kontrol kolaylığı
  },
});