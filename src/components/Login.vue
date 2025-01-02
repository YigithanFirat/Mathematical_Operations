<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <div id="app">
        <router-view/>
        <div class="full-body">
            <div class="header">
                <ul>
                    <li><a href="/"> <i class="fa-solid fa-house"></i> Anasayfa </a></li>
                    <li><a href="/panel"> <i class="fa-solid fa-layer-group"></i> Panel </a></li>
                    <li><a href="/members"> <i class="fa-solid fa-person"></i> Üyeler </a></li>
                    <li><a href="/history"> <i class="fa-solid fa-ghost"></i> Geçmiş </a></li>
                    <li><a href="/settings"> <i class="fa-solid fa-user-gear"></i> Ayarlar </a></li>
                    <li v-if="!isLoggedIn"><a href="/" @click="logout()"> <i class="fa-solid fa-door-open"></i> Çıkış </a></li>
                    <abbr title="Giriş Yap" v-if="isLoggedIn">
                        <button @click="navigateToLogin()">Giriş Yap</button>
                    </abbr>
                    <abbr title="Kaydol" v-if="isLoggedIn">
                        <button @click="navigateToRegister()">Kaydol</button>
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
                        <button draggable="false" type="submit">Giriş Yap</button>
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
  data() 
  {
    return {

    };
  },
  name: 'Login',
  methods:
  {
    navigateToRegister()
    {
      return this.$router.push('/register');
    },

    async loginUser() 
    {
        const nickname = document.getElementById('nickname').value;
        const password = document.getElementById('password').value;
        if(!nickname || !password) 
        {
            alert('Lütfen nickname ve şifre alanlarını doldurun.');
            return;
        }
        try 
        {
            const response = await axios.post
            (
                'http://localhost:3000/login', 
                { nickname, password }, 
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            if(response.status === 200) 
            {
                const { userId, message } = response.data;
                console.log('Giriş Başarılı:', message);
                localStorage.setItem('userId', userId);
                localStorage.setItem('isLoggedIn', true);
                alert('Giriş başarılı!');
                return this.$router.push('/');
            }
        } 
        catch(error) 
        {
            console.error('Hata Detayı:', error.response?.data || error.message || error);
            if(error.response?.status === 400) 
            {
                alert('Nickname ve şifre gereklidir.');
            } 
            else if(error.response?.status === 401) 
            {
                alert('Kullanıcı bulunamadı veya şifre hatalı.');
            } 
            else
            {
                alert('Giriş sırasında bir hata oluştu. Lütfen tekrar deneyiniz.');
            }
        }
    },
  }
};

</script>

<style>

.login-screen
{
    margin-left: 500px;
    text-align: center;
    padding: 20px;
    width: 600px;
    max-width: 100%;
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
    border: 2px solid black;
    cursor: pointer;
    padding: 3px;
    box-shadow: 3px 3px 5px black;
    font-size: 14px;
    font-weight: 600;
    width: 100px;
    color: #fafafa;
    border-radius: 30px 30px;
    background-color: blue;
    outline: 0;
    letter-spacing: 1px;
    margin-top: 30px;
}

</style>