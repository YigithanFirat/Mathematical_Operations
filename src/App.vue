<template>
  <HelloWorld msg="Welcome to Your Destiny!"/>
</template>

<script>
import HelloWorld from './components/main.vue'

export default 
{
  name: 'App',
  components: 
  {
    HelloWorld
  }
}
</script>

<style>
*
{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-image: url("/src/assets/logo.png");
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

#app 
{
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>