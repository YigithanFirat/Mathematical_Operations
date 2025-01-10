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
                  <li><a href="/" @click="logout()"> <i class="fa-solid fa-door-open"></i> Çıkış </a></li>
                    <abbr title="Giriş Yap">
                        <button @click="navigateToLogin()">Giriş Yap</button>
                    </abbr>
                    <abbr title="Kaydol">
                        <button @click="navigateToRegister()">Kaydol</button>
                    </abbr>
              </ul>
          </div>
        </div>
    </div>
</template>

<script>
export default 
{
  name: 'Members',
  methods: 
  {
    async logout() 
    {
      try 
      {
            const response = await axios.post('http://localhost:3000/logout', 
            {
                userId: 1,
            });
            if(response.data && response.data.message === 'Çıkış işlemi başarılı.')
            {
                alert('Başarıyla çıkış yaptınız.');
                this.$router.push('/');
            }
            else
            {
                alert(response.data.error || 'Çıkış işlemi başarısız. Tekrar deneyin.');
            }
        }
        catch(error) 
        {
            console.error('Hata Detayı:', error.response?.data || error.message || error);
            alert('Sunucuya bağlanırken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    },
    navigateToLogin() 
    {
      this.$router.push('/login');
    },

    navigateToRegister() 
    {
      this.$router.push('/register');
    },
  }
};

</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

*
{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
}

body, html
{
    width: 100%;
    height: 100%;
}

.full-body
{
    position: relative;
    width: 100%;
    height: 100vh;
    background-image: url("/src/assets/logo.png");
    background-position: center;
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
}

.full-body .header ul
{
    list-style-type: none;
    overflow: hidden;
}

.full-body .header ul li
{
    float: left;
}

.full-body .header
{
    background-color: #112479;
}

.full-body .header ul li a
{
    display: block;
    padding: 12px 24px;
    text-decoration: none;
    font-size: 18px;
    font-family: sans-serif;
    color: #fafafa;
    letter-spacing: 1px;
}

.full-body .header abbr
{
    text-decoration: none;
    cursor: pointer;
}

.full-body .header abbr button
{
    border: 2px solid black;
    cursor: pointer;
    padding: 3px;
    box-shadow: 3px 3px 5px black;
    font-size: 14px;
    font-weight: 600;
    float: right;
    margin-top: 10px;
    margin-right: 5px;
    width: 100px;
    color: #fafafa;
    border-radius: 30px 30px;
    background-color: blue;
    outline: 0;
    letter-spacing: 1px;
}

#app 
{
    width: 100%;
    height: 100%;
}
</style>