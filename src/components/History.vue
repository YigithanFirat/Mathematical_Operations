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

          <li v-if="isAdmin">
            <router-link to="/admin" class="btn" title="Admin Paneli">
              <i class="fa-solid fa-lock"></i> Admin
            </router-link>
          </li>

          <li v-if="isLogged">
            <button class="btn" @click="logout">
              <i class="fa-solid fa-door-open"></i> Çıkış
            </button>
          </li>

          <li v-if="!isLogged">
            <button class="btn" @click="navigateToLogin">
              <i class="fa-solid fa-right-to-bracket"></i> Giriş Yap
            </button>
          </li>

          <li v-if="!isLogged">
            <button class="btn" @click="navigateToRegister">
              <i class="fa-solid fa-user-plus"></i> Kaydol
            </button>
          </li>
        </ul>
      </nav>

      <!-- İşlem Geçmişi -->
      <section v-if="isLogged && hasHistory" class="history-section">
        <h2>İşlem Geçmişi</h2>
        <div v-for="(entries, operation) in groupedHistory" :key="operation" class="operation-group">
          <h3>{{ operation }}</h3>
          <table v-if="entries.length">
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
          <p v-else class="empty-msg">Bu işlem için kayıt bulunamadı.</p>
        </div>
      </section>

      <!-- Yedek İşlemleri -->
      <section v-if="isLogged && backupData.length" class="history-section">
        <h2>Yedek (Backup) İşlemleri</h2>
        <table>
          <thead>
            <tr>
              <th>Zorluk</th>
              <th>Soru Sayısı</th>
              <th>Nickname</th>
              <th>Puan</th>
              <th>Toplam Süre</th>
              <th>Tarih</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in backupData" :key="index">
              <td>{{ entry.zorluk }}</td>
              <td>{{ entry.sorusayisi }}</td>
              <td>{{ entry.nickname }}</td>
              <td>{{ entry.puan }}</td>
              <td>{{ entry.toplamsure }}</td>
              <td>{{ entry.tarih }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "History",
  data() {
    return {
      historyData: [],
      backupData: [],
    };
  },
  computed: {
    isLogged() {
      return this.$store.getters.isLogged;
    },
    isAdmin() {
      return this.$store.getters.userRole === "admin";
    },
    groupedHistory() {
      const grouped = {
        Toplama: [],
        Çıkarma: [],
        Çarpma: [],
        Bölme: [],
        Diğer: [],
      };
      this.historyData.forEach((entry) => {
        if (grouped[entry.islem]) {
          grouped[entry.islem].push(entry);
        } else {
          grouped.Diğer.push(entry);
        }
      });
      return grouped;
    },
    hasHistory() {
      return Object.values(this.groupedHistory).some((entries) => entries.length > 0);
    },
  },
  methods: {
    async logout() {
      const userId = this.$store.getters.userId;
      if (!userId) {
        alert("Kullanıcı bilgisi eksik. Lütfen tekrar giriş yapın.");
        this.$router.push({ name: "Login" });
        return;
      }

      try {
        const { data } = await axios.post("http://localhost:3000/logout", { userId });
        if (data.message === "Çıkış işlemi başarılı.") {
          alert("Başarıyla çıkış yaptınız.");
          this.$store.dispatch("logout");
          this.$router.push("/");
        } else {
          alert(data.error || "Çıkış işlemi başarısız.");
        }
      } catch (err) {
        console.error(err);
        alert("Sunucu hatası. Lütfen tekrar deneyin.");
      }
    },

    navigateToLogin() {
      this.$router.push("/login");
    },

    navigateToRegister() {
      this.$router.push("/register");
    },

    async fetchHistory() {
      try {
        const user = this.$store.state.user;
        const userId = user?.id;

        if (!this.isLogged || !userId) {
          console.warn("Geçerli kullanıcı oturumu bulunamadı.");
          return;
        }

        console.log("fetchHistory -> userId:", userId);

        // Ana geçmiş verisi
        const historyRes = await axios.get(`http://localhost:3000/history/${userId}`);
        if (historyRes.data && Array.isArray(historyRes.data.data)) {
          this.historyData = historyRes.data.data;
        } else {
          this.historyData = [];
        }

        // Yedek verisi (backup)
        const backupRes = await axios.get(`http://localhost:3000/backup/${userId}`);
        if (backupRes.data && Array.isArray(backupRes.data.data)) {
          this.backupData = backupRes.data.data;
        } else {
          this.backupData = [];
        }

      } catch (error) {
        console.error("Geçmiş verileri alınırken hata oluştu:", error.response?.data || error.message);
        this.historyData = [];
        this.backupData = [];
        alert("Geçmiş verileri alınamadı. Lütfen tekrar deneyin.");
      }
    }
  },
  mounted() {
    const userId = this.$store.state.user?.id;
    if (this.isLogged && userId) {
      this.fetchHistory();
    }
  }
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css");
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Roboto", sans-serif;
}

body,
html,
#app {
  width: 100%;
  height: 100%;
}

.full-body {
  padding-top: 60px;
  min-height: 100vh;
  width: 100%;
  background-image: url("/src/assets/logo.png");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  background-color: #112479;
  display: flex;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nav-left {
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  width: 100%;
  padding: 0 20px;
}

.nav-left li {
  flex: 1;
  text-align: center;
}

.btn {
  background-color: #1a73e8;
  color: #fafafa;
  font-weight: 600;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  padding: 8px 16px;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  height: 40px;
  transition: all 0.3s ease;
}

.btn i {
  font-size: 18px;
  margin-right: 6px;
}

.btn:hover {
  background-color: #80b9ff;
  border-radius: 15px;
  transform: scale(1.07);
  box-shadow: 0 8px 20px rgba(128, 185, 255, 0.7);
}

.history-section {
  width: 90%;
  max-width: 1100px;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 20px;
  margin: 30px 0;
  border-radius: 12px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.history-section h2 {
  font-size: 24px;
  font-weight: 700;
  color: #2641fe;
  margin-bottom: 15px;
  border-bottom: 2px solid #2641fe;
  padding-bottom: 8px;
}

.operation-group {
  margin-top: 25px;
}

.operation-group h3 {
  color: #112479;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 4px;
}

.empty-msg {
  font-style: italic;
  color: #777;
  padding: 10px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

table th,
table td {
  padding: 12px;
  border: 1px solid #ccc;
  text-align: center;
}

table th {
  background-color: #112479;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
}

table tr:nth-child(even) {
  background-color: #f4f7ff;
}

table tr:hover {
  background-color: #dbe7ff;
}

table td {
  background-color: #e6ecff;
  font-weight: 600;
  color: #112479;
}

@media (max-width: 768px) {
  .nav-left {
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-left li {
    flex: 0 0 48%;
    margin: 4px 0;
  }

  .btn {
    font-size: 13px;
    padding: 6px 12px;
    width: 100%;
    justify-content: center;
  }

  .history-section {
    padding: 15px;
  }

  .history-section h2 {
    font-size: 20px;
  }

  .operation-group h3 {
    font-size: 18px;
  }

  table th,
  table td {
    padding: 8px;
    font-size: 13px;
  }
}
</style>