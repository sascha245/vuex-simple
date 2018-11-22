<script lang="ts" src="./Home.ts"></script>

<template>
  <div class="home">
    <h1>Home</h1>

    <div>
      <p>Total: {{ total }}</p>
    </div>
    <div>
      <p>Counter: {{ counter }}</p>
      <button @click="increment">Increment</button>
    </div>
    <div>
      <p>My1 Counter: {{ testModule.my1.counter }}</p>
      <button @click="testModule.my1.increment">Increment</button>
    </div>
    <div>
      <p>My2 Counter: {{ testModule.my2.counter }}</p>
      <button @click="testModule.my2.increment">Increment</button>
    </div>
  </div>
</template>

<style>
</style>
