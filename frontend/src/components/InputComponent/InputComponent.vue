<template>
  <input
    v-if="['text', 'email', 'password', 'date'].includes(type)"
    :type="type"
    :value="modelValue"
    @input="updateValue($event.target.value)"
    :placeholder="placeholder"
  />

  <div v-else-if="type === 'radio'">
    <label v-for="option in options" :key="option.value">
      <input
        type="radio"
        :name="name"
        :value="option.value"
        :checked="modelValue === option.value"
        @change="updateValue(option.value)"
      />
      {{ option.label }}
    </label>
  </div>

  <div v-else-if="type === 'checkbox'">
    <label v-for="option in options" :key="option.value">
      <input
        type="checkbox"
        :value="option.value"
        :checked="modelValue.includes(option.value)"
        @change="toggleCheckbox(option.value)"
      />
      {{ option.label }}
    </label>
  </div>
</template>

<script setup>
import { defineProps, defineEmits} from "vue";
import "./InputComponent.css";
const props = defineProps({
  modelValue: [String, Array],
  type: { type: String, required: true },
  options: { type: Array, default: () => [] },
  label: String,
  placeholder: String,
  name: String, // Dùng cho radio
});

const emit = defineEmits(["update:modelValue"]);

const updateValue = (value) => {
  emit("update:modelValue", value);
};

const toggleCheckbox = (value) => {
  const newValue = props.modelValue.includes(value)
    ? props.modelValue.filter((item) => item !== value)
    : [...props.modelValue, value];

  emit("update:modelValue", newValue);
};
</script>
