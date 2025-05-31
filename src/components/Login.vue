<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
  <div id="app">
    <router-view />
    <div class="full-body">
      <div class="header">
        <ul>
          <li><a class="btn" href="/"> <i class="fa-solid fa-house"></i> Anasayfa </a></li>
          <li><a class="btn" v-if="isLogged == 1" href="/history"> <i class="fa-solid fa-ghost"></i> Geçmiş </a></li>
          <li><a class="btn" v-if="isLogged == 1" href="/settings"> <i class="fa-solid fa-user-gear"></i> Ayarlar </a></li>
          <li><a class="btn" v-if="isLogged == 1" href="/" @click="logout()"> <i class="fa-solid fa-door-open"></i> Çıkış </a></li>
          <abbr title="Kaydol">
            <button class="btn" v-if="isLogged == 0" @click="navigateToRegister()"> Kaydol </button>
          </abbr>
        </ul>
      </div>

      <!-- Bildirim mesajları -->
      <div v-if="message" :class="['message-box', messageType]">
        {{ message }}
      </div>

      <div class="login-screen">
        <form id="loginform" class="input-wrap" @submit.prevent="loginUser()">
          <label class="f-nickname" for="nickname">Kullanıcı Adınız</label>
          <input type="text" id="nickname" name="nickname" class="input" placeholder="Kullanıcı Adınız" required>
          <label class="f-password" for="password">Şifreniz</label>
          <input type="password" id="password" name="password" class="input" placeholder="Şifreniz" required>
            <button title="Giriş Yap" class="btn-login">Giriş Yap</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      message: '',
      messageType: '', // "success" or "error"
    };
  },
  computed: {
    isLogged() {
      return this.$store.getters.isLogged;
    },
  },
  methods: {
    navigateToRegister() {
      return this.$router.push("/register");
    },

    showMessage(text, type = "success") {
      this.message = text;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
        this.messageType = '';
      }, 4000); // 4 saniye sonra mesaj kaybolur
    },

    async logout() {
      const userId = this.$store.getters.userId;

      if (!userId) {
        console.warn("Logout: Kullanıcı ID bulunamadı! Mevcut user:", this.$store.state.user);
        alert("Kullanıcı bilgisi eksik. Oturumu kapatmadan önce tekrar giriş yapın.");
        return;
      }

      try {
        const response = await axios.post("http://localhost:3000/logout", { userId });

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

    async loginUser() {
      const nickname = document.getElementById("nickname").value;
      const password = document.getElementById("password").value;

      if (!nickname || !password) {
        this.showMessage("Lütfen tüm alanları doldurun!", "error");
        return;
      }

      try {
        const response = await axios.post("http://localhost:3000/login", { nickname, password });
        if (response.data && response.data.message === "Giriş başarılı ve Login durumu güncellendi.") {
          this.showMessage("Giriş başarılı!", "success");
          this.$store.dispatch("login", response.data.userId); // userId'yi Vuex'e ilet
          this.$router.push("/");
        } else {
          this.showMessage("Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.", "error");
        }
      } catch (error) {
        console.error("Hata Detayı: ", error.response?.data || error.message || error);
        this.showMessage("Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.", "error");
      }
    },
  },
};
</script>

<style>

.header {
  background-color: #112479;
  width: 100%;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header ul {
  list-style-type: none;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.header ul li a {
  display: inline-block;
  padding: 10px 20px;
  text-decoration: none;
  font-size: 18px;
  color: #fafafa;
  font-weight: 500;
  letter-spacing: 1px;
  transition: color 0.3s, background-color 0.3s;
  border-radius: 4px;
}

.header abbr {
  text-decoration: none;
  cursor: pointer;
}

.login-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  max-width: 100%;
  padding: 20px;
  background-color: #800000;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  opacity: 0.75;
}

.login-screen label,
.login-screen label.f-nickname,
.login-screen label.f-password {
  display: block;
  color: #fafafa;
  font-size: 15px;
  font-weight: 600;
  font-style: normal;
  margin-bottom: 5px;
  margin-top: 15px;
}

.login-screen .input-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.login-screen .input {
  text-align: center;
  width: 100%;
  height: 48px;
  padding: 10px 15px;
  margin-bottom: 10px;
}

.login-screen .form {
    padding: 10px 0;
    width: 100%;
}

.login-screen .btn-login {
  width: 100%;
  max-width: 700px;
  height: 48px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #fafafa;
  background-color: #1a73e8;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  outline: 0;
  letter-spacing: 1px;
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.login-screen .btn-login:hover {
  background-color: #80b9ff;
  border-radius: 15px;
  transform: scale(1.05);
}

/* Hover efekti */
.btn:hover {
  background-color: #80b9ff; /* Açık mavi */
  border-radius: 15px;       /* Hoverda radius azaltıldı */
  transform: scale(1.05);
}

/* İkon varsa boyutu */
.btn i {
  font-size: 18px;
  line-height: 1;
}

.message-box {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: bold;
  color: white;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: fadeInOut 4s ease-in-out;
}

.message-box.success {
  background-color: #2ecc71;
}

.message-box.error {
  background-color: #e74c3c;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  10% { opacity: 1; transform: translateX(-50%) translateY(0); }
  90% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
}

</style>