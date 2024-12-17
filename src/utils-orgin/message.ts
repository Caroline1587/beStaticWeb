import { ElMessage, MessageOptions } from "element-plus";

export function successMessage(message: string, option?: MessageOptions) {
  ElMessage({
    message,
    ...option,
    type: "success",
    duration: 2 * 1000,
    offset: 48,
  });
}
export function warningMessage(message: string, option?: MessageOptions) {
  ElMessage({
    message,
    ...option,
    type: "warning",
    duration: 3 * 1000,
    offset: 48,
  });
}
export function errorMessage(message: string, option?: MessageOptions) {
  ElMessage({
    message,
    ...option,
    type: "error",
    duration: 3 * 1000,
    offset: 48,
  });
}
export function infoMessage(message: string, option?: MessageOptions) {
  ElMessage({
    message,
    ...option,
    type: "info",
    duration: 3 * 1000,
    offset: 48,
  });
}
export function closeMessage() {
  ElMessage.closeAll();
}
