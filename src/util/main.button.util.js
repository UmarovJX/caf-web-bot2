import { TELEGRAM, WEB_APP } from "@/constants";

export function mainButtonOnClick(callback) {
  window[TELEGRAM][WEB_APP].MainButton["onClick"](callback);
}

export function mainButtonOffClick(callback) {
  window[TELEGRAM][WEB_APP].MainButton["offClick"](callback);
}

export function mainButtonActivate() {
  window[TELEGRAM][WEB_APP].MainButton.isActive = true;
}

export function mainButtonDeactivate() {
  window[TELEGRAM][WEB_APP].MainButton.isActive = false;
}

export function mainButtonMakeVisible() {
  window[TELEGRAM][WEB_APP].MainButton.isVisible = true;
}

export function mainButtonMakeDisable() {
  window[TELEGRAM][WEB_APP].MainButton.isVisible = false;
}

export function mainButtonSetText(text) {
  window[TELEGRAM][WEB_APP].MainButton.setText(text);
}

export function mainButtonShowProgress() {
  window[TELEGRAM][WEB_APP].MainButton.showProgress(true);
}

export function mainButtonHideProgress() {
  window[TELEGRAM][WEB_APP].MainButton.hideProgress();
}
