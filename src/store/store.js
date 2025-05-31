import { createStore } from 'vuex';

// Güvenli JSON.parse fonksiyonu
function safeParse(data) {
  try {
    if (!data || data === 'undefined') return null;
    return JSON.parse(data);
  } catch (e) {
    console.error("JSON parse hatası:", e);
    return null;
  }
}

// Kullanıcı için varsayılan yapı
const defaultUser = {
  id: null,
  nickname: '',
  role: '',
};

export default createStore({
  state: {
    // localStorage'dan güvenli şekilde veri alınıyor
    Logged: safeParse(localStorage.getItem('Logged')) === 1, // 1 ise true, değilse false
    user: { ...defaultUser, ...(safeParse(localStorage.getItem('user')) || {}) },
    operations: safeParse(localStorage.getItem('operations')) || [],
  },

  mutations: {
    setLogged(state, status) {
      state.Logged = Boolean(status);
      localStorage.setItem('Logged', JSON.stringify(state.Logged ? 1 : 0));
    },

    setUser(state, userData) {
      state.user = { ...defaultUser, ...userData }; // eksik alanlar default ile tamamlanır
      localStorage.setItem('user', JSON.stringify(state.user));
    },

    clearUser(state) {
      state.user = { ...defaultUser };
      localStorage.removeItem('user');
    },

    addOperation(state, operation) {
      state.operations.push(operation);
      localStorage.setItem('operations', JSON.stringify(state.operations));
    },

    cleanOldOperations(state) {
      const now = Date.now();
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
      state.operations = state.operations.filter(op => now - op.timestamp <= THIRTY_DAYS);
      localStorage.setItem('operations', JSON.stringify(state.operations));
    }
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

    recordOperation({ commit }, operation) {
      commit('addOperation', operation);
      commit('cleanOldOperations');
    }
  },

  getters: {
    isLogged: (state) => state.Logged,
    userId: (state) => state.user?.id ?? null,
    userNickname: (state) => state.user?.nickname ?? '',
    userRole: (state) => state.user?.role ?? '',
    isAdmin: (state) => state.user?.role === 'admin',

    recentOperations: (state) => {
      const now = Date.now();
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
      return state.operations.filter(op => now - op.timestamp <= THIRTY_DAYS);
    },

    maxDurationLastMonth: (state, getters) => {
      const ops = getters.recentOperations;
      if (ops.length === 0) return null;
      return Math.max(...ops.map(op => op.duration));
    },

    minDurationLastMonth: (state, getters) => {
      const ops = getters.recentOperations;
      if (ops.length === 0) return null;
      return Math.min(...ops.map(op => op.duration));
    },
  },
});