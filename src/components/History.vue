<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
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

          <li v-if="isAdmin">
            <router-link to="/admin" class="btn" title="Admin Paneli">
              <i class="fa-solid fa-lock"></i> Admin
            </router-link>
          </li>

          <li v-if="isLogged">
            <button class="btn" @click="logout" type="button">
              <i class="fa-solid fa-door-open"></i> Çıkış
            </button>
          </li>

          <li v-else>
            <button class="btn" @click="navigateToLogin" type="button" title="Giriş Yap">
              <i class="fa-solid fa-right-to-bracket"></i> Giriş Yap
            </button>
          </li>

          <li v-else>
            <button class="btn" @click="navigateToRegister" type="button" title="Kaydol">
              <i class="fa-solid fa-user-plus"></i> Kaydol
            </button>
          </li>
        </ul>
      </nav>

      <!-- İşlem Geçmişi (İşlem Türüne Göre Gruplanmış) -->
      <div v-if="isLogged && historyData.length" class="history-section">
        <h2 style="margin-top: 30px; color: #2641FE">İşlem Geçmişi</h2>

        <div
          v-for="(entries, operation) in groupedHistory"
          :key="operation"
          class="operation-group"
        >
          <h3>{{ operation }}</h3>
          <table>
            <thead>
              <tr>
                <th>Zorluk</th>
                <th>Soru Sayısı</th>
                <th>Nickname</th>
                <th>Puan</th>
                <th>Toplam Süre</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, index) in entries" :key="index">
                <td>{{ entry.zorluk }}</td>
                <td>{{ entry.sorusayisi }}</td>
                <td>{{ entry.nickname }}</td>
                <td>{{ entry.puan }}</td>
                <td>{{ entry.toplamsure }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Yedek (Backup) İşlemleri -->
      <div v-if="isLogged && backupData.length" class="history-section">
        <h2 style="margin-top: 30px; color: #2641FE">Yedek (Backup) İşlemleri</h2>
        <table>
          <thead>
            <tr>
              <th>Zorluk</th>
              <th>Soru Sayısı</th>
              <th>Nickname</th>
              <th>Puan</th>
              <th>Toplam Süre</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in backupData" :key="index">
              <td>{{ entry.zorluk }}</td>
              <td>{{ entry.sorusayisi }}</td>
              <td>{{ entry.nickname }}</td>
              <td>{{ entry.puan }}</td>
              <td>{{ entry.toplamsure }}</td>
            </tr>
          </tbody>
        </table>
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
      historyData: [],
      backupData: [],
      "zorluk": "",
      "sorusayisi": 10,
      "nickname": "",
      "puan": 0,
      "toplamsure": ""
    };
  },
  computed: {
    isLogged() {
      return this.$store.getters.isLogged;
    },
    isAdmin() {
      return this.$store.getters.userRole === 'admin';
    },
    groupedHistory() {
      const grouped = {
        Toplama: [],
        Çıkarma: [],
        Çarpma: [],
        Bölme: [],
        Diğer: []
      };
      this.historyData.forEach(entry => {
        switch (entry.islem) {
          case 'Toplama':
            grouped.Toplama.push(entry);
            break;
          case 'Çıkarma':
            grouped.Çıkarma.push(entry);
            break;
          case 'Çarpma':
            grouped.Çarpma.push(entry);
            break;
          case 'Bölme':
            grouped.Bölme.push(entry);
            break;
          default:
            grouped.Diğer.push(entry);
        }
      });
      return grouped;
    }
  },
  methods: {
    async logout() {
      try {
        const response = await axios.post("http://localhost:3000/logout", {
          userId: this.$store.getters.userId,
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

    async fetchBackupData() {
      try {
        const userId = this.$store.getters.userId;
        const response = await axios.get(`http://localhost:3000/history/backup/${userId}`);
        if (response.data && Array.isArray(response.data.data)) {
          this.backupData = response.data.data;
        } else {
          this.backupData = [];
        }
      } catch (error) {
        console.error("Backup verisi alınamadı:", error);
      }
    },

    async fetchHistory() {
      try {
        const userId = this.$store.getters.userId;
        if (!userId) return;

        const response = await axios.get(`http://localhost:3000/history/${userId}`);
        if (response.data && Array.isArray(response.data.data)) {
          this.historyData = response.data.data;
        } else {
          console.warn('Beklenen formatta veri gelmedi:', response.data);
          this.historyData = [];
        }
      } catch (error) {
        console.error('Veri alınamadı:', error);
      }
    }

  },
  mounted() {
    this.fetchHistory();
    this.fetchBackupData();
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

.header {
  background-color: #112479;
  width: 100%;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 50px;
  display: flex;
  align-items: center;
}

.operation-group {
  margin-bottom: 30px;
}

.operation-group h3 {
  color: #112479;
  margin-bottom: 10px;
}

.nav-left {
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: flex-start;
  width: 100%;
}

.nav-left li {
  display: inline-flex;
}

.btn {
  background-color: #1a73e8;
  border: none;
  color: #fafafa;
  font-weight: 600;
  font-size: 14px; /* 16px -> 14px'e düşürüldü */
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Daha hafif gölge */
  transition: background-color 0.3s, transform 0.3s;
  display: inline-flex;
  align-items: center;
  text-align: center;
}

.btn:hover {
  background-color: #80b9ff;
  border-radius: 15px;
  transform: scale(1.05);
}

.btn i {
  font-size: 18px;
  line-height: 1;
}

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

</style>