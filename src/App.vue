<template>
  <main msg="Welcome to Your Destiny!"></main>
  <link rel="icon" href="/public/favicon.ico">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
  <div class="full-body">
    <div class="header">
      <ul>
        <li><a href="/"> <i class="fa-solid fa-house"></i> Anasayfa </a></li>
        <li><a href="/panel"> <i class="fa-solid fa-layer-group"></i> Panel </a></li>
        <li><a href="/members"> <i class="fa-solid fa-person"></i> Üyeler </a></li>
        <li><a href="/history"> <i class="fa-solid fa-ghost"></i> Geçmiş</a></li>
        <li><a href="/exit"> <i class="fa-solid fa-door-open"></i> Çıkış</a></li>
        <abbr title="Kaydol" v-if="!isRegisterRoute">
          <button id="register" @click="navigateToRegister">Kaydol</button>
        </abbr>
        <abbr title="Giriş Yap" v-if="!isLoginRoute">
          <button id="login" @click="navigateToLogin">Giriş Yap</button>
        </abbr>
      </ul>
    </div>
      <div class="zorluk">
        <div class="checkbox-container">
          <input type="checkbox" id="derece1" name="zorluk" value="Kolay">
          <label for="derece1">Kolay</label>
        </div>
        <div class="checkbox-container">
          <input type="checkbox" id="derece2" name="zorluk" value="Orta">
          <label for="derece2">Orta</label>
        </div>
        <div class="checkbox-container">
          <input type="checkbox" id="derece3" name="zorluk" value="Zor">
          <label for="derece3">Zor</label>
        </div>
      </div>
  </div>
</template>

<script>

export default 
{
  computed: 
  {
    // Şu anki route kontrolü
    isRegisterRoute() 
    {
      return this.$route.path === "/kayit";
    },
    isLoginRoute() 
    {
      return this.$route.path === "/giris";
    },
  },
  methods: 
  {
    navigateToRegister() 
    {
      this.$router.push("/kayit");
    },
    navigateToLogin() 
    {
      this.$router.push("/giris");
    },
  },
};

</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

*
{
    margin: 0;
    padding: 0;
    border: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
}

.full-body
{
    background-image: url("/src/assets/logo.png");
    height: 100vh;
    background-position: center;
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    justify-content: center;
    align-items: center;
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

.zorluk 
{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.checkbox-container 
{
  display: flex;
  align-items: center;
  gap: 5px;
}

.zorluk label 
{
  font-size: 16px;
  color: #fafafa;
  font-weight: 600;
}

</style>