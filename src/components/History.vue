<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
  <div id="app">
    <router-view />
    <div class="full-body">
      <nav class="header">
        <ul class="nav-left">
          <li>
            <router-link to="/" class="btn">
              <i class="fa-solid fa-house"></i> Anasayfa
            </router-link>
          </li>
          <li v-if="isLogged">
            <router-link to="/history" class="btn">
              <i class="fa-solid fa-ghost"></i> Geçmiş
            </router-link>
          </li>
          <li v-if="isLogged">
            <router-link to="/settings" class="btn">
              <i class="fa-solid fa-user-gear"></i> Ayarlar
            </router-link>
          </li>
          <li v-if="isLogged">
            <button class="btn" @click="logout" type="button">
              <i class="fa-solid fa-door-open"></i> Çıkış
            </button>
          </li>
          
          <!-- Giriş Yap ve Kaydol butonları birlikte ve aynı şartla görünür -->
          <template v-if="!isLogged">
            <li>
              <button class="btn" @click="navigateToLogin" type="button" title="Giriş Yap">
                Giriş Yap
              </button>
            </li>
            <li>
              <button class="btn" @click="navigateToRegister" type="button" title="Kaydol">
                Kaydol
              </button>
            </li>
          </template>

          <li v-if="isAdmin">
            <button class="btn" @click="navigateToAdmin" type="button" title="Admin Girişi">
              Admin Girişi
            </button>
          </li>
        </ul>
      </nav>

      <!-- İşlem geçmişi tablo görünümü -->
      <div v-if="isLogged === 1" class="history-table">
        <div v-for="(entries, islem) in groupedHistory" :key="islem">
          <h2 style="margin-top: 30px; color: #2641FE">{{ islem }} İşlemleri</h2>
          <table v-if="entries.length > 0">
            <thead>
              <tr>
                <th>Zorluk</th>
                <th>Soru</th>
                <th>Kullanıcı Cevabı</th>
                <th>Doğru Cevap</th>
                <th>Puan</th>
                <th>Süre</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in entries" :key="entry.id">
                <td>{{ entry.zorluk }}</td>
                <td>{{ entry.soru }}</td>
                <td>{{ entry.kullaniciCevabi }}</td>
                <td>{{ entry.cevap }}</td>
                <td>{{ entry.puan }}</td>
                <td>{{ entry.sure }}</td>
                <td>{{ entry.tarih }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'History',
  data() {
    return {
      historyData: []
    };
  },
  computed: {
    isLogged() {
      return this.$store.getters.isLogged;
    },
    groupedHistory() {
      const grouped = {};
      this.historyData.forEach(entry => {
        const islem = entry.islem || 'Bilinmeyen';
        if (!grouped[islem]) {
          grouped[islem] = [];
        }
        grouped[islem].push(entry);
      });
      return grouped;
    }
  },
  methods: {
    async logout() {
      try {
        const response = await axios.post("http://localhost:3000/logout", {
          userId: 1,
        });
        if (response.data && response.data.message === "Çıkış işlemi başarılı.") {
          alert("Başarıyla çıkış yaptınız.");
          this.$store.dispatch("logout");
        } else {
          alert(response.data.error || "Çıkış işlemi başarısız. Tekrar deneyin.");
        }
      } catch (error) {
        console.error("Hata Detayı:", error.response?.data || error.message || error);
        alert("Sunucuya bağlanırken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    },
    navigateToLogin() {
      this.$router.push('/login');
    },
    navigateToRegister() {
      this.$router.push('/register');
    },
    async fetchHistory() {
      try {
        const response = await axios.get('http://localhost:3000/history');
        
        if (response.data && Array.isArray(response.data.data)) {
          this.historyData = response.data.data;
        } else {
          this.historyData = [];
          console.warn('Beklenen formatta veri gelmedi:', response.data);
        }

        console.log('Gelen veri:', this.historyData);
      } catch (error) {
        console.error('Veriler alınamadı:', error.response?.data || error.message);
      }
    }

  },
  mounted() {
    this.fetchHistory();
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

body, html, #app {
  width: 100%;
  height: 100%;
}

/* Arka plan */
.full-body {
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url("/src/assets/logo.png");
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

/* HEADER */
.header {
  background-color: #112479;
  width: 100%;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 50px;
  display: flex;
  align-items: center;
}

/* Nav list with left aligned buttons */
.nav-left {
  display: flex;
  align-items: center;
  gap: 20px; /* Butonlar arası boşluk */
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: flex-start; /* En sola yasla */
  width: 100%;
}

.nav-left li {
  display: inline-block;
}

/* Buton ortak temel stil */
.btn {
  background-color: #1a73e8;
  border: none;
  color: #fafafa;
  font-weight: 600;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px; /* İkon ve yazı arası */
  text-align: center;
  user-select: none;
  text-decoration: none;
}

/* Hover efekti */
.btn:hover {
  background-color: #80b9ff; /* Açık mavi */
  border-radius: 15px;
  transform: scale(1.05);
}

.btn i {
  font-size: 18px;
  line-height: 1;
}

/* Zorluk bölümü */
.zorluk {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.zorluk .checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zorluk label {
  font-size: 16px;
  color: #fafafa;
  font-weight: 600;
}

/* İşlemler bölümü */
.islemler {
  margin-top: 30px;
  text-align: center;
  padding: 20px;
  background-color: rgba(17, 36, 121, 0.8);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.islemler label {
  color: #fafafa;
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

.islemler input,
.islemler select {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  margin-bottom: 15px;
  border: 2px solid #2641FF;
  border-radius: 4px;
  background-color: #f9f9f9;
  outline: none;
  transition: border-color 0.3s;
}

.islemler input:focus,
.islemler select:focus {
  border-color: #0c5bd5;
}

.islemler input[readonly] {
  background-color: #e9ecef;
  color: #495057;
  cursor: not-allowed;
}

/* Geçmiş tablosu */
.history-table {
  width: 90%;
  max-width: 1100px;
  margin: 30px auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.history-table h2 {
  margin-bottom: 20px;
  color: #112479;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  border-bottom: 2px solid #112479;
  padding-bottom: 8px;
}

.history-table table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.history-table table th,
.history-table table td {
  padding: 12px;
  border: 1px solid #ccc;
  text-align: center;
}

.history-table table th {
  background-color: #112479;
  color: #ffffff;
  font-weight: bold;
  text-transform: uppercase;
}

.history-table table tr:nth-child(even) {
  background-color: #f4f7ff;
}

.history-table table tr:hover {
  background-color: #dbe7ff;
  cursor: pointer;
}

.history-table table td {
  background-color: #e6ecff;
  font-weight: 600;
  color: #112479;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-left {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }

  .btn {
    padding: 8px 14px;
    font-size: 14px;
  }

  .history-table {
    padding: 10px;
  }

  .history-table h2 {
    font-size: 20px;
  }
}

/* Tooltip */
.header abbr {
  text-decoration: none;
  cursor: pointer;
}
</style>