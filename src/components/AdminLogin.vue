<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <div id="app">
        <router-view />
        <div class="full-body">
            <div class="header">
                <ul>
                    <li><a href="/"> <i class="fa-solid fa-house"></i> Anasayfa </a></li>
                    <li><a v-if="isLogged == 1" href="/history"> <i class="fa-solid fa-ghost"></i> Geçmiş </a></li>
                    <li><a v-if="isLogged == 1" href="/settings"> <i class="fa-solid fa-user-gear"></i> Ayarlar </a></li>
                    <li><a v-if="isLogged == 1" href="/" @click="logout()"> <i class="fa-solid fa-door-open"></i> Çıkış </a></li>
                    <abbr title="Kaydol">
                      <button 
                        v-if="isLogged == 0" 
                        @click="navigateToRegister()"
                        >
                        Kaydol
                      </button>
                  </abbr>
                </ul>
            </div>
            <div class="login-screen">
                <form id="loginform" class="input-wrap" @submit.prevent="loginUser()">
                    <label class="f-nickname" for="nickname">Kullanıcı Adınız</label>
                    <input type="text" id="nickname" name="nickname" class="input" placeholder="Kullanıcı Adınız" required>
                    <label class="f-password" for="password">Şifreniz</label>
                    <input type="password" id="password" name="password" class="input" placeholder="Şifreniz" required>
                    <abbr title="Giriş Yap">
                      <button 
                        v-if="isLogged == 0" 
                        >
                        Giriş Yap
                      </button>
                  </abbr>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default 
{
  computed: 
  {
    isLogged() 
    {
      return this.$store.getters.isLogged;
    },
  },
  name: "Login",
  methods: 
  {
    navigateToRegister() 
    {
      return this.$router.push("/register");
    },

    async logout() 
    {
      try
      {
        const response = await axios.post("http://localhost:3000/logout", 
        {
          userId: 1,
        });
        if(response.data && response.data.message === "Çıkış işlemi başarılı.") 
        {
          alert("Başarıyla çıkış yaptınız.");
          this.$store.dispatch("logout");
        }
        else
        {
          alert(response.data.error || "Çıkış işlemi başarısız. Tekrar deneyin.");
        }
      }
      catch(error)
      {
        console.error("Hata Detayı:", error.response?.data || error.message || error);
        alert("Sunucuya bağlanırken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    },

    async loginAdmin() 
    {
      const nickname = document.getElementById("nickname").value;
      const password = document.getElementById("password").value;
      if(!nickname || !password) 
      {
        alert("Lütfen tüm alanları doldurun!");
        return;
      }
      try 
      {
        const response = await axios.post("http://localhost:3000/login", 
        {
          nickname,
          password,
        });
        if(response.data && response.data.message === "Giriş başarılı ve Login durumu güncellendi.") 
        {
          alert("Giriş başarılı");
          this.$store.dispatch("login");
          this.$router.push("/");
        } 
        else 
        {
          alert("Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.");
        }
      } 
      catch(error) 
      {
        console.error("Hata Detayı: ", error.response?.data || error.message || error);
        alert("Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }
    },
  },
};
</script>

<style>

.login-screen 
{
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
  opacity: 0.7;
}

.login-screen label.f-nickname 
{
  display: block;
  color: #fafafa;
  font-size: 15px;
  font-weight: 600;
  font-style: normal;
  margin-bottom: 5px;
  margin-top: 250px;
}

.login-screen label.f-password 
{
  color: #fafafa;
  font-size: 15px;
  font-weight: 600;
  font-style: normal;
}

.login-screen .input 
{
  text-align: center;
  width: 100%;
  height: 48px;
  padding: 10px 15px;
}

.login-screen textarea 
{
  text-align: center;
  width: 100%;
  height: 100px;
}

.login-screen .form 
{
  padding: 10px 0;
}

.login-screen button 
{
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #fafafa;
  background-color: #1a73e8;
  border-radius: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  outline: 0;
  letter-spacing: 1px;
  margin-top: 30px;
}

.login-screen button:hover
{
  background-color: #0c5bd5;
  transform: scale(1.05);

}
</style>
