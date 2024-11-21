<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <div class="full-body">
        <div class="header">
            <ul>
                <li><a href="/home"> <i class="fa-solid fa-house"></i> Anasayfa</a></li>
                <li><a href="/panel"> <i class="fa-solid fa-layer-group"></i> Panel</a></li>
                <li><a href="/members"> <i class="fa-solid fa-person"></i> Üyeler</a></li>
                <li><a href="/history"> <i class="fa-solid fa-ghost"></i> Geçmiş</a></li>
                <li><a href="/exit"> <i class="fa-solid fa-door-open"></i> Çıkış</a></li>
                <abbr title="Kaydol">
                    <button draggable="false" @click="navigateToRegister()">Kaydol</button>
                </abbr>
            </ul>
        </div>
        <div class="login-screen">
            <form id="loginform" class="input-wrap" onsubmit="event.preventDefault(); loginUser();">
                <label class="f-nickname" for="nickname">Kullanıcı Adınız</label>
                <input type="text" id="nickname" name="nickname" class="input" placeholder="Kullanıcı Adınız" required>
                <label class="f-password" for="password">Şifreniz</label>
                <input type="password" id="password" name="password" class="input" placeholder="Şifreniz" required>
                <button draggable="false" type="submit">Giriş Yap</button>
            </form>
        </div>        
        <div class="ses" style="display: none">
            <audio src="Miasma [ ezmp3.cc ].mp3" controls autoplay muted loop></audio>
        </div>
    </div>
</template>

<script>
export default 
{
  name: 'Login',
  methods:
  {
    navigateToRegister()
    {
      return this.$router.push('/register');
    }
  }
};
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

*
{
    margin: 0;
    padding: 0;
    border: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
}

body, html 
{
    height: 100%;
}

.full-body
{
    background-image: url("https://i.hizliresim.com/p78nbsu.png");
    height: 100%;
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
