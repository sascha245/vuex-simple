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
      <p>My1 Counter: {{ my1.counter }}</p>
      <button @click="my1.increment">Increment</button>
    </div>
    <div>
      <p>My2 Counter: {{ testModule.my2.counter }}</p>
      <button @click="testModule.my2.increment">Increment</button>
    </div>
    <div>
      <p>Root Counter: state/{{ store.rootCounter }}, getter/{{ store.aRootCounter }}</p>
      <button @click="store.actionIncrementRootCounter">Increment - wait a sec</button>
    </div>
    <div>
      <p>Number but increased: {{ store.numberButIncreased(counter) }}</p>
    </div>
  </div>
</template>

<style></style>
