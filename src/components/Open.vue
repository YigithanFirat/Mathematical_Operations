<template>
  <div class="tam-govde">
    <div class="process">
      <div class="operation toplama">
          <button title="Toplama" @click="navigateToHomePage('add')">+</button>
      </div>
      <div class="operation cikarma">
          <button title="Çıkarma" @click="navigateToHomePage('subtract')">-</button>
      </div>
      <div class="operation carpma">
          <button title="Çarpma" @click="navigateToHomePage('multiply')">*</button>
      </div>
      <div class="operation bolme">
          <button title="Bölme" @click="navigateToHomePage('divide')">/</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Open",
  methods: {
    navigateToHomePage(operation) {
      this.$router.push({ path: "/home", query: { operation } });
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

body, html {
  width: 100%;
  height: 100%;
}

.operation button {
  width: 80px;
  height: 80px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0));
  color: white;
  font-size: 36px;
  font-weight: 700;
  box-shadow: 0 6px 12px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.operation button:hover {
  background: linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.1));
  box-shadow: 0 8px 16px rgba(0,0,0,0.35);
  transform: scale(1.1);
}

.operation button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.7);
}

#app {
  width: 100%;
  height: 100%;
}

.tam-govde {
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

.process {
  display: grid;
  grid-template-columns: repeat(2, 100px);
  grid-template-rows: repeat(2, 100px);
  gap: 5px;
}

.operation {
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

.toplama {
  background-color: #FF0000;
}

.cikarma {
  background-color: #FFFF00;
}

.carpma {
  background-color: #2641FE;
}

.bolme {
  background-color: #33CC33;
}

button {
  cursor: pointer;
}
</style>