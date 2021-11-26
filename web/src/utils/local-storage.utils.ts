import { FormInputMode } from "../types/FormInputMode";

const INPUT_MODE_KEY = "input-mode";

const fallbackInputMode: FormInputMode = "song+artist";

export const isInputMode = (mode: string | null): mode is FormInputMode => {
  return mode !== "song+artist" && mode !== "spotify";
};

export const setLocalStorageInputMode = (value: FormInputMode): void => {
  window.localStorage.setItem(INPUT_MODE_KEY, value);
};

export const getLocalStorageInputMode = (): FormInputMode => {
  const inputMode = window.localStorage.getItem(INPUT_MODE_KEY);

  if (!isInputMode(inputMode)) {
    return fallbackInputMode;
  }

  return inputMode;
};
