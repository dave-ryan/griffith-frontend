<template>
  <div class="mt-5 row text-center">
    <div class="col"></div>
    <div class="col">
      <img src="../assets/images/errorcat.jpg" class="error-img" alt="error" />
      <h2 class="mb-3">
        {{ error.report }}
      </h2>
      <button class="btn btn-outline-success" @click="refresh()">
        Refresh The Page
      </button>
    </div>
    <div class="col"></div>
  </div>
</template>

<style scoped></style>

<script>
export default {
  props: ["error"],
  methods: {
    refresh() {
      window.location.reload();
    },
  },
};
</script>
