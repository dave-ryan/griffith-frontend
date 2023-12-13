<template>
  <div class="mt-5 row text-center">
    <div class="col"></div>
    <div class="col">
      <img src="../assets/images/errorcat.jpg" class="error-img" alt="error" />
      <h2>
        {{ errorMessage }}
      </h2>
    </div>
    <div class="col"></div>
  </div>
</template>

<style scoped></style>

<script>
export default {
  props: ["errorMessage"],
};
</script>
