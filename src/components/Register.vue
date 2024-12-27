<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <div id="app">
        <router-view/>
        <div class="full-body">
            <div class="header">
                <ul>
                    <li><a href="/"> <i class="fa-solid fa-house"></i> Anasayfa</a></li>
                    <li><a href="/panel"> <i class="fa-solid fa-layer-group"></i> Panel</a></li>
                    <li><a href="/members"> <i class="fa-solid fa-person"></i> Üyeler</a></li>
                    <li><a href="/history"> <i class="fa-solid fa-ghost"></i> Geçmiş</a></li>
                    <li><a href="/settings"> <i class="fa-solid fa-user-gear"></i> Ayarlar </a></li>
                    <li><a href="/exit"> <i class="fa-solid fa-door-open"></i> Çıkış</a></li>
                    <abbr title="Giriş Yap">
                        <button draggable="false" @click="navigateToLogin()">Giriş Yap</button>
                    </abbr>
                </ul>
            </div>
            <div class="register-screen">
                <form id="registerform" class="input-wrap" @submit.prevent="registerUser()">
                    <label class="f-title" for="email">E-Posta Adresiniz</label>
                    <input type="email" id="email" name="email" class="input" placeholder="E-Posta Adresiniz" required>
                    <label class="f-password" for="password">Şifreniz</label>
                    <input type="password" id="password" name="password" class="input" placeholder="Şifreniz" required>
                    <label class="f-nickname" for="nickname">Kullanıcı Adınız</label>
                    <input type="text" id="nickname" name="nickname" class="input" placeholder="Kullanıcı Adınız" required>
                    <abbr title="Kaydol">
                        <button draggable="false" type="submit">Kaydol</button>
                    </abbr>
                </form>
            </div>
        </div>
    </div>
</template>

<script>

export default 
{
  name: 'Register',
  methods:
  {
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
    }
  }
};

</script>

<style>

.register-screen
{
    margin-left: 500px;
    text-align: center;
    padding: 20px;
    width: 600px;
    max-width: 100%;
}

.register-screen label.f-title
{
    display: block;
    color: #fafafa;
    font-size: 15px;
    font-weight: 600;
    font-style: normal;
    margin-bottom: 5px;
    margin-top: 250px;
}

.register-screen label.f-password
{
    color: #fafafa;
    font-size: 15px;
    font-weight: 600;
    font-style: normal;
}

.register-screen label.f-nickname
{
    color: #fafafa;
    font-size: 15px;
    font-weight: 600;
    font-style: normal;
}

.register-screen .input
{
    text-align: center;
    width: 100%;
    height: 48px;
    padding: 10px 15px;
}

.register-screen textarea
{
    text-align: center;
    width: 100%;
    height: 100px;
}

.register-screen .form
{
    padding: 10px 0;
}

.register-screen button
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