<template>
  <div>
    <div class="table-actions">
      <h2>Danh Sách Học Sinh</h2>
      <div class="table-actions__header">
        <div class="table-actions__header-left">
          <ButtonComponent class="table__button" type="primary" @click="action_filter">
            <div><slot name="name-button-filter"></slot></div>
          </ButtonComponent>
          <slot name="filter-form"></slot>
          <div class="table-actions__search">
            <InputComponent
              :placeholder="'Nhập tên đối tượng cần tìm'"
              :is_text="true"
              v-model="searchQueryComputed"
            />
            <i class="pi pi-search table-actions__search-icon" style="font-size: 1rem"></i>
          </div>
        </div>
        <div class="table-actions__header-right">
          <div class="table__select-column">
            <ButtonComponent type="primary" @click="setShowColumn" class="table__button">
              <div>Chọn</div>
            </ButtonComponent>
            <div class="table__overlay" ref="overlay" :class="{ 'table__overlay--show': show }">
              <div>Chọn các cột của bảng</div>
              <div class="table__label-container">
                <label v-for="column in columns" :key="column.id" class="table__label">
                  <InputComponent v-model="column.show" type="checkbox" />
                  {{ column.name }}
                </label>
              </div>
            </div>
          </div>
          <ButtonComponent type="primary" class="table__button" @click="action_add" v-if="checkedRole">
            <div><slot name="name-button-create"></slot></div>
          </ButtonComponent>
          <ButtonComponent
            class="table__button"
            :type="isSelectedOnlyRow ? 'warning' : 'disabled'"
            @click="action_update"
          >
            <div><slot name="name-button-update"></slot></div>
          </ButtonComponent>
          <ButtonComponent
            @click="action_delete"
            :type="!isSelectedRowEmpty ? 'warning' : 'disabled'"
          >
            <div><slot name="name-button-delete"></slot></div>
          </ButtonComponent>
          <slot name="other-button"></slot>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table class="table">
        <thead>
          <tr class="table__row">
            <th class="table__header">
              <div class="table__checkbox">
                <InputComponent
                  type="checkbox"
                  v-model="isSelectedAll"
                  @update:modelValue="updateCheckboxAll"
                />
              </div>
            </th>
            <th v-for="column in columns" :key="column.id" class="table__header" v-show="column.show">
              {{ column.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in props.data"
            :key="row[primaryKey]"
            class="table__row"
            :class="{ 'table__row--selected': isCheckedRow(row) }"
            @click="() => toggleRow(row)"
          >
            <td class="table__cell">
              <div class="table__checkbox">
                <InputComponent type="checkbox" :modelValue="isCheckedRow(row)" />
              </div>
            </td>
            <td v-for="column in columns" :key="column.id" class="table__cell" v-show="column.show">
              {{ row[column.field] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <div class="pagination">
      <div class="pagination__limit">
        <span style="margin-right: 12px">Số hàng hiển thị</span>
        <DropDownComponent :value="props.limit" :list_options="limitRows" :is_above="true">
          <div
            v-for="option in limitRows"
            class="option-in-menu"
            :key="option.id"
            @click="updateLimitRows(option.value)"
            :class="{ checked: props.limit == option.value }"
          >
            {{ option.value }}
          </div>
        </DropDownComponent>
      </div>
      <div class="pagination__navigation">
        <div class="pagination__pre">
          <ButtonComponent
            class="pagination__button"
            @click="firstPage"
            type="pagination"
          >
            <div><i class="pi pi-angle-double-left" style="font-size: 1rem"></i></div>
          </ButtonComponent>
          <ButtonComponent
            class="pagination__button"
            @click="previousPage"
             type="pagination"
          >
            <div><i class="pi pi-angle-left" style="font-size: 1rem"></i></div>
          </ButtonComponent>
        </div>

        <div class="pagination__pages">
          <span class="pagination__page" v-if="page > 1" @click="updatePageState(page - 1)">{{
            page - 1
          }}</span>
          <span class="pagination__page pagination__page--current" @click="getPrimaryKey">{{
            page
          }}</span>
          <span class="pagination__page" v-if="page < props.totalPages" @click="updatePageState(page + 1)">{{
            page + 1
          }}</span>
        </div>

        <div class="pagination__next">
          <ButtonComponent
            class="pagination__button"
            @click="nextPage"
            type="pagination"
          >
            <div><i class="pi pi-angle-right" style="font-size: 1rem"></i></div>
          </ButtonComponent>
          <ButtonComponent
            class="pagination__button"
            @click="lastPage"
            type="pagination"
          >
            <div><i class="pi pi-angle-double-right" style="font-size: 1rem"></i></div>
          </ButtonComponent>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch, defineEmits, computed, onBeforeUnmount } from "vue";
import "./TableComponent.css";
import ButtonComponent from "../ButtonComponent/ButtonComponent.vue";
import DropDownComponent from "../DropDownComponent/DropDownComponent.vue";
import "primeicons/primeicons.css";
import InputComponent from "../InputComponent/InputComponent.vue";

const props = defineProps({
  columns: Array,
  data: Array,
  page: Number,
  totalPages: Number,
  limit: Number,
  searchQuery: String,
  action_delete: Function,
  action_add: Function,
  action_update: Function,
  action_filter: Function
});

const emit = defineEmits([
  "updatePage",
  "updateLimitRows",
  "updateSelectedRows",
  "update:searchQuery",
]);
const isSelectedAll = ref(false);
const selectedRows = ref({});
const show = ref(false);
const overlay = ref(null);
// Đồng bộ giá trị khi InputComponent thay đổi
const limitRows = ref([
  { id: 1, value: 5 },
  { id: 2, value: 10 },
  { id: 3, value: 20 },
  { id: 4, value: 50 },
]);

const primaryKey = computed(
  () =>
    props.columns.find((col) => ["id", "key"].includes(col.field))?.field || props.columns[0]?.field
);

const checkedRole = computed(() => {
  return localStorage.getItem("role") == 2
});

const isSelectedRowEmpty = computed(() => {
  return selectedRows.value && Object.keys(selectedRows.value).length === 0;
});

const isSelectedOnlyRow = computed(() => {
  return selectedRows.value && Object.keys(selectedRows.value).length === 1;
});

const updateCheckboxAll = (value) => {
  isSelectedAll.value = value;
  selectedRows.value = value
    ? Object.fromEntries(props.data.map((row) => [row[primaryKey.value], true]))
    : {};
  emit("updateSelectedRows", selectedRows.value);
};

const isCheckedRow = (row) => !!selectedRows.value[row[primaryKey.value]];

const toggleRow = (row) => {
  const rowId = row[primaryKey.value];
  if (selectedRows.value[rowId]) {
    delete selectedRows.value[rowId];
    if (isSelectedAll.value) isSelectedAll.value = false;
  } else {
    selectedRows.value[rowId] = true;
  }
  emit("updateSelectedRows", selectedRows.value);
};

const setShowColumn = (event) => {
  // Ngừng sự kiện click khi nhấn vào nút, không thực hiện sự kiện ngoài
  event.stopPropagation();
  show.value = !show.value;
};

const updatePageState = (newPage) => {
  if (newPage >= 1 && newPage <= props.totalPages) emit("updatePage", newPage);
};

const updateLimitRows = (newVal) => emit("updateLimitRows", newVal);
const nextPage = () => updatePageState(props.page + 1);
const previousPage = () => updatePageState(props.page - 1);
const firstPage = () => updatePageState(1);
const lastPage = () => updatePageState(props.totalPages);

const searchQueryComputed = computed({
  get: () => props.searchQuery,
  set: (value) => emit("update:searchQuery", value),
});

watch(show, (newVal) => {
  if (newVal) {
    // Nếu show = true, gắn sự kiện click vào document
    document.addEventListener("click", handleClickOutside);
  } else {
    // Nếu show = false, gỡ bỏ sự kiện click
    document.removeEventListener("click", handleClickOutside);
  }
});

// Ẩn overlay khi click bên ngoài phạm vi hiển thị
const handleClickOutside = (event) => {
  if (overlay.value && !overlay.value.contains(event.target)) {
    show.value = false;
  }
};

// Sự kiện này đảm bảo rằng sự kiện click được gỡ bỏ khi component bị unmount
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

watch(
  () => props.data,
  (newData) => {
    console.log(Object.keys(selectedRows.value));
    if (isSelectedAll.value) {
      newData.forEach((row) => {
        const rowId = row[primaryKey.value];
        if (!selectedRows.value[rowId]) {
          selectedRows.value[rowId] = true;
        }
      });
    }
  },
  { deep: true, immediate: true }
);
</script>
