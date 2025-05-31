<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <div id="app">
        <router-view/>
        <div class="full-body">
            <div class="header">
                <ul>
                    <li><a class="btn" href="/"> <i class="fa-solid fa-house"></i> Anasayfa</a></li>
                    <li><a class="btn" v-if="isLogged == 1" href="/history"> <i class="fa-solid fa-ghost"></i> Geçmiş</a></li>
                    <li><a class="btn" v-if="isLogged == 1" href="/settings"> <i class="fa-solid fa-user-gear"></i> Ayarlar </a></li>
                    <li><a class="btn" v-if="Logged == 1" href="/" @click="logout()"> <i class="fa-solid fa-door-open"></i> Çıkış </a></li>
                    <abbr title="Giriş Yap">
                        <button class="btn" draggable="false" @click="navigateToLogin()">Giriş Yap</button>
                    </abbr>
                </ul>
            </div>
            <div class="register-screen">
            <form id="registerform" class="input-wrap" @submit.prevent="registerUser()">
                <label class="f-title" for="email">E-Posta Adresiniz</label>
                <input type="email" id="email" name="email" class="input" placeholder="E-Posta Adresiniz" required>

                <label class="f-age" for="number">Yaşınız</label>
                <input type="number" id="age", name="age" class="input" placeholder="Yaşınız" required>

                <label class="f-password" for="password">Şifreniz</label>
                <input type="password" id="password" name="password" class="input" placeholder="Şifreniz" required>

                <label class="f-nickname" for="nickname">Kullanıcı Adınız</label>
                <input type="text" id="nickname" name="nickname" class="input" placeholder="Kullanıcı Adınız" required>

                <button type="submit" class="btn-register">Kaydol</button>
            </form>
            </div>
        </div>
    </div>
</template>

<script>

export default 
{
  name: 'Register',
  computed: 
  {
    Logged() 
    {
      return this.$store.state.login;
    },
  },
  methods:
  {
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
    navigateToLogin()
    {
      return this.$router.push('/login');
    },

    async registerUser() 
    {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const nickname = document.getElementById('nickname').value.trim();
        if(!email || !password || !nickname) 
        {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }
        try 
        {
            const response = await fetch('http://localhost:3000/register', 
            {
                method: 'POST',
                headers: 
                { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, nickname })
            });
            console.log('Yanıt durumu:', response.status);
            if(response.ok) 
            {
                console.log('Kayıt başarılı');
                alert('Kayıt başarılı!');
                return this.$router.push('/login');
            } 
            else 
            {
                const errorText = await response.text();
                console.error('Sunucu hatası:', errorText);
                alert(`Kayıt sırasında bir hata oluştu: ${errorText}`);
            }
        } 
        catch(error) 
        {
            console.error('Fetch isteği sırasında hata:', error);
            alert('Bir hata oluştu, lütfen tekrar deneyiniz.');
        }
    },
  }
};

</script>

<style>

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
  gap: 8px; /* İkon ve yazı arasında boşluk */
  text-align: center;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  text-decoration: none; /* link alt çizgisini kaldır */
  border: none;
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

.register-screen {
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
    opacity: 0.75; /* %75 opaklık */
}

.register-screen label,
.register-screen label.f-title,
.register-screen label.f-password,
.register-screen label.f-nickname {
  display: block;
  color: #fafafa;
  font-size: 15px;
  font-weight: 600;
  font-style: normal;
  margin-bottom: 5px;
  margin-top: 15px; /* Uyumlu bir boşluk */
}

.register-screen .input-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.register-screen .input {
    text-align: center;
    width: 100%;
    height: 48px;
    padding: 10px 15px;
    margin-bottom: 10px;
}

.register-screen .form {
    padding: 10px 0;
    width: 100%;
}

.register-screen .btn-register {
    width: 100%; /* inputlarla aynı genişlikte */
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
}

.register-screen .btn-register:hover {
  background-color: #80b9ff; /* Açık mavi */
  border-radius: 15px;       /* Hoverda radius azaltıldı */
  transform: scale(1.05);
}

</style>