import { createStore } from 'vuex';

export default createStore({
  state: {
    Logged: JSON.parse(localStorage.getItem('Logged')) || 0,
    user: JSON.parse(localStorage.getItem('user')) || null, // kullanıcı nesnesi (id, nickname vb.)
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
      commit('setUser', userData); // kullanıcı bilgilerini sakla (örneğin: { id: 1, nickname: "ahmet" })
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