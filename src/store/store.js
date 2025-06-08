import { createStore } from 'vuex';

// Güvenli JSON.parse fonksiyonu
function safeParse(data) {
  try {
    if (!data || data === 'undefined' || typeof data !== 'string') return null;
    return JSON.parse(data);
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error("safeParse hatası:", e);
    }
    return null;
  }
}

// Kullanıcı için varsayılan yapı
const defaultUser = {
  id: null,
  nickname: '',
  role: '',
  login: 0,  // login alanı eklendi
};

// 30 gün = milisaniye cinsinden
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export default createStore({
  state: {
    Logged: !!safeParse(localStorage.getItem('Logged')),
    user: { ...defaultUser, ...(safeParse(localStorage.getItem('user')) || {}) },
    operations: safeParse(localStorage.getItem('operations')) || [],
  },

  mutations: {
    setLogged(state, status) {
      state.Logged = !!status;
      localStorage.setItem('Logged', JSON.stringify(state.Logged));
    },

    setUser(state, userData) {
      if (!userData || typeof userData !== 'object') {
        state.user = { ...defaultUser };
        localStorage.setItem('user', JSON.stringify(state.user));
        return;
      }

      const cleanedUser = {
        id: userData?.id ?? null,
        nickname: userData?.nickname ?? '',
        role: userData?.role ?? '',
        login: userData?.login ?? 0,
      };

      state.user = { ...defaultUser, ...cleanedUser };
      localStorage.setItem('user', JSON.stringify(state.user));

      // login değeri 1 değilse Logged'ı false yap (opsiyonel güvenlik)
      if (cleanedUser.login !== 1) {
        state.Logged = false;
        localStorage.setItem('Logged', JSON.stringify(false));
      }
    },

    clearUser(state) {
      state.user = { ...defaultUser };
      localStorage.removeItem('user');
    },

    addOperation(state, operation) {
      if (operation && typeof operation === 'object') {
        if (!operation.timestamp) {
          operation.timestamp = Date.now();
        }
        state.operations.push(operation);
        localStorage.setItem('operations', JSON.stringify(state.operations));
      }
    },

    cleanOldOperations(state) {
      const now = Date.now();
      state.operations = state.operations.filter(op => now - op.timestamp <= THIRTY_DAYS);
      localStorage.setItem('operations', JSON.stringify(state.operations));
    },

    clearOperations(state) {
      state.operations = [];
      localStorage.removeItem('operations');
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
      commit('clearOperations');
    },

    recordOperation({ commit }, operation) {
      commit('addOperation', operation);
      commit('cleanOldOperations');
    }
  },

  getters: {
    isLogged: state => !!state.Logged,
    userId: state => state.user?.id ?? null,
    userNickname: state => state.user?.nickname ?? '',
    userRole: state => state.user?.role ?? '',
    userLogin: state => state.user?.login ?? 0,
    isAdmin: state => (state.user?.role || '').toLowerCase() === 'admin',

    recentOperations: state => {
      const now = Date.now();
      return state.operations.filter(op => now - op.timestamp <= THIRTY_DAYS);
    },

    maxDurationLastMonth: (state, getters) => {
      const ops = getters.recentOperations.filter(op => typeof op.duration === 'number');
      return ops.length ? Math.max(...ops.map(op => op.duration)) : null;
    },

    minDurationLastMonth: (state, getters) => {
      const ops = getters.recentOperations.filter(op => typeof op.duration === 'number');
      return ops.length ? Math.min(...ops.map(op => op.duration)) : null;
    },
  },
});