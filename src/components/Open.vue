<template>
    <div class="tam-govde">
      <div class="process">
        <div class="operation toplama">
          <abbr title="Toplama">
            <button @click="navigateToHomePage('add')">+</button>
          </abbr>
        </div>
        <div class="operation cikarma">
          <abbr title="Çıkarma">
            <button @click="navigateToHomePage('subtract')">-</button>
          </abbr>
        </div>
        <div class="operation carpma">
          <abbr title="Çarpma">
            <button @click="navigateToHomePage('multiply')">*</button>
          </abbr>
        </div>
        <div class="operation bolme">
          <abbr title="Bölme">
            <button @click="navigateToHomePage('divide')">/</button>
          </abbr>
        </div>
      </div>
    </div>
</template>
  
<script>
  export default 
  {
    name: "Open",
    methods: 
    {
      navigateToHomePage(operation) 
      {
        this.$router.push({ path: "/home", query: { operation } });
      },
    },
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

.tam-govde
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
  justify-content: center;
}

.process 
{
  display: grid;
  grid-template-columns: repeat(2, 100px);
  grid-template-rows: repeat(2, 100px);
  gap: 20px;
}

.operation 
{
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  font-size: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.toplama 
{
  background-color: #FF0000;
}

.cikarma 
{
  background-color: #FFFF00;
  color: black;
}

.carpma 
{
  background-color: #2641FE;
}

.bolme 
{
  background-color: #33CC33;
}

</style>