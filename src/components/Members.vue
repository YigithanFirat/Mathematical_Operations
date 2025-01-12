<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <div id="app">
      <router-view/>
      <div class="full-body">
            <div class="header">
                <ul>
                    <li><a href="/"> <i class="fa-solid fa-house"></i> Anasayfa</a></li>
                    <li><a href="/members"> <i class="fa-solid fa-person"></i> Üyeler</a></li>
                    <li><a href="/history"> <i class="fa-solid fa-ghost"></i> Geçmiş</a></li>
                    <li><a href="/settings"> <i class="fa-solid fa-user-gear"></i> Ayarlar </a></li>
                    <li><a v-if="Logged == 1" href="/" @click="logout()"> <i class="fa-solid fa-door-open"></i> Çıkış </a></li>
                        <abbr title="Giriş Yap">
                            <button v-if="Logged == 0" @click="navigateToLogin()">Giriş Yap</button>
                        </abbr>
                        <abbr title="Kaydol">
                            <button v-if="Logged == 0" @click="navigateToRegister()">Kaydol</button>
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
  computed: 
  {
    Logged() 
    {
      return this.$store.state.Logged;
    },
  },
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

@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

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

#app 
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.header 
{
    background-color: #112479;
    width: 100%;
    padding: 10px 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header ul 
{
    list-style-type: none;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0;
    padding: 0;
}

.header ul li a 
{
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

.header ul li a:hover 
{
    background-color: black;
}

.header abbr 
{
    text-decoration: none;
    cursor: pointer;
}

.header abbr button 
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
}

.header abbr button:hover 
{
    background-color: #0c5bd5;
    transform: scale(1.05);
}

#app 
{
    width: 100%;
    height: 100%;
}
</style>