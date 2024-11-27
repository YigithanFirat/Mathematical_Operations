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
                  <li><a href="/exit"> <i class="fa-solid fa-door-open"></i> Çıkış</a></li>
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
export default {
  methods: {
    navigateToLogin() {
      this.$router.push('/login');
    },
    navigateToRegister() {
      this.$router.push('/register');
    }
  }
};
</script>

<style>

</style>
