import { ref } from "vue";

export function useDialog() {
  const showDialog = ref(false);
  const header = ref("");
  const content = ref(""); 

  const openDialog = (newHeader, newContent) => {
    header.value = newHeader;
    content.value = Array.isArray(newContent) ? newContent.join("\n") : newContent;
    showDialog.value = true;
  };
  
  const closeDialog = () => {
    showDialog.value = false;
    header.value = "";
    content.value = "";
  };

  return {
    showDialog,
    header,
    content,
    openDialog,
    closeDialog,
  };
}