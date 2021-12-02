import { FormInputMode } from "../types/FormInputMode";

const INPUT_MODE_KEY = "input-mode";
const FINISHED_DAYS_KEY = "finished-days";

const fallbackInputMode: FormInputMode = "artist+song";

export const isInputMode = (mode: string | null): mode is FormInputMode => {
  return mode === "artist+song" || mode === "spotify";
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

export const getLocalStorageFinishedDays = (): Array<number> => {
  const finishedDaysString = window.localStorage.getItem(FINISHED_DAYS_KEY);

  if (!finishedDaysString) {
    return [];
  }

  let finishedDays: Array<number>;

  try {
    finishedDays = JSON.parse(finishedDaysString);
  } catch {
    return [];
  }

  if (!Array.isArray(finishedDays)) {
    return [];
  }

  return finishedDays;
};

export const setLocalStorageFinishedDays = (finishedDays: Array<number>): void => {
  window.localStorage.setItem(FINISHED_DAYS_KEY, JSON.stringify(finishedDays));
};

export const setLocalStorageFinishedDay = (finishedDay: number): void => {
  const finishedDays = getLocalStorageFinishedDays();
  const newFinishedDays = [...finishedDays, finishedDay];
  const newFinishedDaysNoRepeatValues = [...new Set(newFinishedDays)];

  setLocalStorageFinishedDays(newFinishedDaysNoRepeatValues);
};
