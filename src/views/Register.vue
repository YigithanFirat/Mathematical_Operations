<template>
  <Registter msg="Welcome to Your Destiny!"/>
  <link rel="icon" href="/public/favicon.ico">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
  <div class="full-body">
    <div class="header">
      <ul>
        <li><a href=""> <i class="fa-solid fa-house"></i> Anasayfa </a></li>
        <li><a href=""> <i class="fa-solid fa-layer-group"></i> Panel </a></li>
        <li><a href=""> <i class="fa-solid fa-person"></i> Üyeler </a></li>
        <li><a href=""> <i class="fa-solid fa-ghost"></i> Geçmiş</a></li>
        <li><a href=""> <i class="fa-solid fa-door-open"></i> Çıkış</a></li>
        <router-link to="/giris">
          <abbr title="Giriş Yap">
            <button id="login" @click="giris">Giriş Yap</button>
          </abbr>
        </router-link>
      </ul>
    </div>
  </div>
  </template>
  
  <script>
  
  export default 
  {
    name: 'Register'
  }

  </script>
  
  <style scoped>

  h1 
  {
    color: #333;
  }

  </style>