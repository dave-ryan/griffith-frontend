<template>
  <div>
    <div class="form-check form-check-inline">
      <input
        class="form-check-input"
        type="checkbox"
        :value="item.id"
        :id="`checkbox-` + item.id"
        :checked="item.purchaser_id"
        :disabled="item.purchaser_id && item.purchaser_id !== me.id"
        @change="$emit('toggleCheckBox')"
      />
      <span
        :class="
          item.purchaser_id && item.purchaser_id !== me.id ? 'fw-light' : ''
        "
      >
        {{ item.name }}
        <span v-if="item.link">
          -
          <a
            :href="`//` + item.link.replace(/^https?:\/\//, '')"
            target="_blank"
            >link</a
          ></span
        >
      </span>
      <span
        v-if="item.purchaser && item.purchaser_id"
        :class="item.purchaser_id === me.id ? 'text-success' : 'text-danger'"
      >
        - Purchased By
        {{ item.purchaser_id === me.id ? "You!" : "Someone Else" }}
        {{ me.is_admin ? " - " + item.purchaser.name : "" }}
      </span>
    </div>
  </div>
</template>

<script>
export default { props: ["item", "me"], emits: ["toggleCheckBox"] };
</script>
