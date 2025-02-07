import { createStore } from 'vuex';
import axios from 'axios';

export default createStore
({
  state: 
  {
    Logged: JSON.parse(localStorage.getItem('Logged')) || 0,
    Admin: JSON.parse(localStorage.getItem('Admin')) || 0,
  },
  mutations: 
  {
    setLogged(state, status) 
    {
      state.Logged = status;
      localStorage.setItem('Logged', JSON.stringify(status));
    },

    setAdmin(state, isAdmin) 
    {
      state.Admin = isAdmin;
      localStorage.setItem('Admin', JSON.stringify(isAdmin));
    },
  },

  actions: 
  {
    async login({ commit }, payload)
    {
      try 
      {
        const response = await axios.post('/api/check-admin', payload);
        if(response.data.success) 
        {
          commit('setLogged', 1);
          commit('setAdmin', response.data.isAdmin);
        }
      } 
      catch(error) 
      {
        console.error('Login error:', error);
      }
    },

    async loginAdmin ( { commit }, payload)
    {
      try
      {
        const response = await axios.post('/api/check-admin', payload);
        if(response.data.success)
        {
          commit('setAdmin', response.data.isAdmin); // Veritabanından gelen yanıtı kullan
        }
      }
      catch(error)
      {
        console.error('Login error:', error);
      }
    },

    logout({ commit }) 
    {
      commit('setLogged', 0);
      commit('setAdmin', 0);
      localStorage.removeItem('Logged');
      localStorage.removeItem('Admin');
    },
    async checkAdminStatus({ commit }) 
    {
      try 
      {
        const response = await axios.get('/api/check-admin');
        commit('setAdmin', response.data.isAdmin);
      } 
      catch(error) 
      {
        console.error('Admin status check error:', error);
        commit('setAdmin', 0);
      }
    },
  },

  getters: 
  {
    isLogged: (state) => state.Logged === 1,
    isAdmin: (state) => state.Admin === 1,
  },
});
