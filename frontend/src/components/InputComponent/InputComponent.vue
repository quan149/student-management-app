<template>
  <!-- Input text -->
  <input
    v-if="is_text"
    type="text"
    class="input input--text"
    :placeholder="placeholder"
    v-model="inputValue"
    :disabled="is_disable"
    :class="{ 'input--error': is_error }"
  />

  <!-- Input password -->
  <input
    v-if="is_password"
    type="password"
    class="input input--text"
    :placeholder="placeholder"
    v-model="inputValue"
  />

  <!-- Input checkbox -->
  <input v-if="is_checkbox" type="checkbox" class="input-checkbox" v-model="checkedValue" />

  <!-- Input date picker -->
  <input
    v-if="is_datePicker"
    class="input input--date"
    type="date"
    v-model="datePicker"
    :disabled="is_disable"
  />

  <!-- Input radio -->
  <div class="input-radio-group">
    <input
      v-if="is_radio"
      type="radio"
      class="input-radio"
      :value="value"
      v-model="radioValue"
      :disabled="is_disable"
      :checked="radioValue === value"
      :id="id"
      :name="name"
    />
    <label class="input-radio__label" :for="id">{{ props.label }}</label>
  </div>
</template>


<script setup>
import { defineProps, defineEmits, computed, watch } from "vue";
import "./InputComponent.css";

// Định nghĩa props
const props = defineProps({
  placeholder: String,
  modelValue: String,
  modelDatePicker: String,
  modelRadio: String,
  is_checkbox: Boolean,
  modelChecked: Boolean,
  is_datePicker: Boolean,
  is_text: Boolean,
  is_radio: Boolean,
  is_disable: Boolean,
  is_error: Boolean,
  is_password: Boolean,
  value: null,
  id: String,
  name: String,
  label: String,
});

const emit = defineEmits([
  "update:modelValue",
  "update:modelChecked",
  "update:modelDatePicker",
  "update:modelRadio",
]);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const checkedValue = computed({
  get: () => props.modelChecked,
  set: (value) => {
    emit("update:modelChecked", value);
  },
});

const datePicker = computed({
  get: () => props.modelDatePicker,
  set: (value) => {
    console.log(value);
    emit("update:modelDatePicker", value);
  },
});

const radioValue = computed({
  get: () => props.modelRadio,
  set: (value) => emit("update:modelRadio", value),
});

// Theo dõi sự thay đổi của radioValue
watch(radioValue, (newValue, oldValue) => {
  console.log(`Radio changed from ${oldValue} to ${newValue}`);
});
</script>
