<template>
  <input
    v-if="['text', 'password', 'date'].includes(type)"
    :type="type"
    class="input"
    :placeholder="placeholder"
    v-model="inputValue"
    :disabled="is_disable"
  />

  <input
    v-else-if="type === 'checkbox'"
    type="checkbox"
    class="input-checkbox"
    v-model="inputValue"
  />

  <div v-else-if="type === 'radio'" class="input-radio-group">
    <input
      type="radio"
      class="input-radio"
      :value="value"
      v-model="inputValue"
      :disabled="is_disable"
      :id="id"
      :name="name"
    />
    <label class="input-radio__label" :for="id">{{ label }}</label>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";
import "./InputComponent.css";
const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  placeholder: String,
  modelValue: [String, Boolean],
  is_disable: Boolean,
  value: [String, Number, Boolean],
  id: String,
  name: String,
  label: String,
});

const emit = defineEmits(["update:modelValue"]);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
