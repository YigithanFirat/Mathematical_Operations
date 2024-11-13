<template>
  <main msg="Welcome to Your Destiny!"/>
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
        <router-link to="/kayit">
          <abbr title="Kaydol">
            <button id="register" @click="kayit">Kaydol</button>
          </abbr>
        </router-link>
      </ul>
    </div>
  </div>
  </template>
  
  <script>
  export default 
  {
    name: 'Login'
  };

  </script>
  
  <style scoped>

  form 
  {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin: auto;
  }
  
  button 
  {
    margin-top: 10px;
    padding: 8px;
    background-color: #112479;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  </style>
  