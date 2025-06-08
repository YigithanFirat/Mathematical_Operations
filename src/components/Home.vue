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

      <section class="islemler">
        <div class="input-group">
          <label for="first-number">İlk Sayı</label>
          <input type="number" id="first-number" :value="firstNumber" readonly />
        </div>

        <div class="zorluk">
          <div class="checkbox-container" v-for="(option, index) in zorlukOptions" :key="index">
            <input :id="'derece' + (index + 1)" type="radio" name="zorluk" :value="option.value" v-model="selectedDifficulty" @change="generateRandomNumbers" />
            <label :for="'derece' + (index + 1)">{{ option.label }}</label>
          </div>
        </div>

        <div class="input-group">
          <label for="second-number">İkinci Sayı</label>
          <input type="number" id="second-number" :value="secondNumber" readonly />
        </div>

        <div class="islem input-group">
          <label for="operation-select">Bir işlem seçin</label>
          <select id="operation-select" v-model="selectedOperation" :disabled="operationLocked">
            <option value="add">Toplama</option>
            <option value="subtract">Çıkarma</option>
            <option value="multiply">Çarpma</option>
            <option value="divide">Bölme</option>
          </select>
        </div>

        <div class="input-group" id="sonuc">
          <label for="result">Sonuç</label>
          <input type="number" id="result" v-model.number="result" @keyup.enter="checkResult" autocomplete="off" />
          <div id="kontrol">
            <abbr title="Sonucu Kontrol Et">
              <button class="btn" @click="checkResult" type="button">
                Sonucu Kontrol Et
              </button>
            </abbr>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  computed: {
    isLogged() {
      return this.$store.getters.isLogged;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
  },
  data() {
    return {
      firstNumber: 0,
      secondNumber: 0,
      selectedOperation: "add",
      operationLocked: false,
      result: "",
      sorusayisi: 10,
      selectedDifficulty: "easy",
      questionCount: 0,
      zorlukOptions: [
        { value: "easy", label: "Kolay" },
        { value: "medium", label: "Orta" },
        { value: "hard", label: "Zor" },
      ],
      startTime: null,
      endTime: null,
    };
  },
  methods: {
    async logout() {
      const userId = this.$store.getters.userId;
      if (!userId) {
        alert("Kullanıcı bilgisi eksik. Oturumu kapatmadan önce tekrar giriş yapın.");
        this.$router.push({ name: "Login" });
        return;
      }
      try {
        const response = await axios.post("http://localhost:3000/logout", { userId });
        if (response.data?.message === "Çıkış işlemi başarılı.") {
          alert("Başarıyla çıkış yaptınız.");
          this.$store.dispatch("logout");
        } else {
          alert(response.data.error || "Çıkış işlemi başarısız. Tekrar deneyin.");
        }
      } catch (error) {
        alert("Sunucuya bağlanırken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    },
    generateRandomNumbers() {
      let min, max;
      switch (this.selectedDifficulty) {
        case "easy": min = 1; max = 10; break;
        case "medium": min = 10; max = 100; break;
        case "hard": min = 100; max = 1000; break;
        default: min = 1; max = 10;
      }
      this.firstNumber = Math.floor(Math.random() * (max - min)) + min;
      this.secondNumber = Math.floor(Math.random() * (max - min)) + min;
      if (this.selectedOperation === "divide" && this.secondNumber === 0) {
        this.secondNumber = min === 0 ? 1 : min;
      }
      this.result = "";
    },
    checkResult() {
      let expectedResult;
      switch (this.selectedOperation) {
        case "add": expectedResult = this.firstNumber + this.secondNumber; break;
        case "subtract": expectedResult = this.firstNumber - this.secondNumber; break;
        case "multiply": expectedResult = this.firstNumber * this.secondNumber; break;
        case "divide":
          if (this.secondNumber === 0) {
            alert("Bir sayıyı sıfıra bölemezsiniz!");
            return;
          }
          expectedResult = parseFloat((this.firstNumber / this.secondNumber).toFixed(2));
          break;
      }
      const userResult = parseFloat(this.result);
      const isCorrect = this.selectedOperation === "divide"
        ? Math.abs(userResult - expectedResult) < 0.01
        : userResult === expectedResult;
      isCorrect ? this.handleCorrectAnswer() : alert("Yanlış cevap!");
    },
    async handleCorrectAnswer() {
      this.questionCount++;
      if (this.questionCount === 1) this.startTime = Date.now();
      if (this.questionCount >= this.sorusayisi) {
        this.endTime = Date.now();
        const totalTime = Math.floor((this.endTime - this.startTime) / 1000);
        await this.saveResults(totalTime);
        alert(`Tebrikler! Toplam süre: ${totalTime} saniye.`);
        this.$router.push("/");
      } else {
        this.generateRandomNumbers();
      }
      this.result = "";
    },
    async saveResults(totalTime) {
      if (!this.isLogged) {
        alert("Sonuçları kaydetmek için giriş yapmalısınız.");
        return;
      }

      const payload = {
        zorluk: this.selectedDifficulty,
        sorusayisi: this.sorusayisi,
        nickname: this.$store.getters.nickname || "Anonim",
        puan: this.questionCount,
        toplamSure: totalTime,
        islem: "Dört işlem oyunu"
        // tarih alanı otomatik atanacak (veritabanında default CURRENT_TIMESTAMP)
      };

      try {
        const response = await axios.post("http://localhost:3000/saveResults", payload);
        if (response.status === 200) {
          alert("Sonuç başarıyla kaydedildi.");
        } else {
          alert("Sonuç kaydedilemedi.");
        }
      } catch (error) {
        alert("Sonuç kaydedilirken bir hata oluştu.");
      }
    },
    navigateToLogin() { this.$router.push("/login"); },
    navigateToRegister() { this.$router.push("/register"); },
    navigateToAdmin() { this.$router.push("/adminlogin"); },
    resetQuiz() {
      this.questionCount = 0;
      this.startTime = null;
      this.endTime = null;
      this.generateRandomNumbers();
      this.result = "";
    },
  },
  mounted() {
    const operation = this.$route.query.operation;
    if (["add", "subtract", "multiply", "divide"].includes(operation)) {
      this.selectedOperation = operation;
      this.operationLocked = true;
    }
    this.generateRandomNumbers();
  },
};
</script>

<style scoped>
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
  justify-content: space-between; /* Aralarında eşit boşluk */
  align-items: center;
  list-style: none;
  width: 100%;
  padding: 0 20px;
  margin: 0;
}

.nav-left li {
  flex: 1; /* Her bir li eşit genişlikte olsun */
  text-align: center; /* Butonları ortala */
}

.nav-left li .btn {
  width: 50%; /* Butonlar li içini kaplasın */
  box-sizing: border-box;
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

/* Disabled select için özel imleç ve görünüm */
select:disabled,
.disabled-cursor {
  cursor: not-allowed;
  background-color: #e9ecef !important;
  color: #495057;
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

/* Abbr etiketinin pointer olması */
.header abbr {
  text-decoration: none;
  cursor: pointer;
}

</style>