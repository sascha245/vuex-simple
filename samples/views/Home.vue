<script lang="ts" src="./Home.ts"></script>

<template>
  <div class="home">
    <h1>Home</h1>
    <div>
      <p>Counter: {{ counter }}</p>
      <button @click="increment">Increment</button>
    </div>
    <div>
      <p>My1 Counter: {{ testModule.myModule1.counter }}</p>
      <button @click="testModule.myModule1.increment">Increment</button>
    </div>
    <div>
      <p>My2 Counter: {{ testModule.myModule2.counter }}</p>
      <button @click="testModule.myModule2.increment">Increment</button>
    </div>
  </div>
</template>

<style>
</style>
