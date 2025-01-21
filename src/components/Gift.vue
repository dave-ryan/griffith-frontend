<template>
  <div class="d-flex align-items-center mb-1">
    <Spinner
      size="small"
      position="absolute"
      top="50%"
      left="-10px"
      :visible="gift.loading"
    />
    <input
      class="form-check-input me-1 check-box"
      type="checkbox"
      :value="gift.id"
      :id="`checkbox-` + gift.id"
      :checked="gift.purchaser_id"
      :disabled="
        !currentUser ||
        (gift.purchaser_id && gift.purchaser_id !== currentUser?.id) ||
        gift.loading
      "
      @change="$emit('toggleCheckBox')"
    />

    <span
      class="text-truncate d-inline-block"
      ref="giftName"
      @click="toggleTruncation()"
      truncated="true"
      :class="[
        (gift.purchaser_id && gift.purchaser_id !== currentUser?.id) ||
        gift.loading
          ? 'fw-light'
          : '',
        gift.purchaser && gift.purchaser.id === currentUser?.id
          ? 'fw-bold'
          : '',
      ]"
    >
      {{ gift.name }}
    </span>

    <span v-if="gift.link" class="ms-2">
      <a
        :href="`//` + gift.link.replace(/^https?:\/\//, '')"
        target="_blank"
        class="text-primary"
        ><i class="bi bi-box-arrow-up-right"></i>
      </a>
    </span>
    <span v-if="gift.purchaser" class="ms-auto claimed-label ps-2">
      <span v-if="gift.purchaser.id === currentUser?.id" class="text-success">
        Claimed</span
      >
      <span v-if="gift.purchaser.id !== currentUser?.id" class="text-danger">
        <span
          ref="tooltip"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          :title="gift.purchaser.name"
          :id="`tooltip-` + gift.id"
          >Claimed</span
        >
      </span>
    </span>
  </div>
</template>

<style scoped>
.check-box {
  margin-top: 0.1rem;
  padding: 7px;
}
.claimed-label {
  min-width: 70px;
}
</style>

<script>
import Spinner from "../components/Spinner";
import { Tooltip } from "bootstrap";
export default {
  components: { Spinner },
  props: ["gift", "currentUser"],
  emits: ["toggleCheckBox"],
  mounted() {
    this.$nextTick(() => {
      if (this.gift.purchaser && this.$refs.tooltip) {
        new Tooltip(this.$refs.tooltip);
      }
    });
  },
  watch: {
    //when someone else claims a gift during your session, this properly activates the tooltip
    "gift.purchaser_id": function (newPurchaserId) {
      this.$nextTick(() => {
        if (newPurchaserId && this.gift.purchaser_id != this.currentUser.id) {
          new Tooltip(document.getElementById(`tooltip-` + this.gift.id));
        }
      });
    },
  },
  methods: {
    toggleTruncation() {
      let el = this.$refs.giftName;
      if (el.getAttribute("truncated") === "true") {
        el.setAttribute("truncated", "false");
        el.classList.remove("text-truncate", "d-inline-block");
      } else {
        el.setAttribute("truncated", "true");
        el.classList.add("text-truncate", "d-inline-block");
      }
    },
  },
};
</script>
