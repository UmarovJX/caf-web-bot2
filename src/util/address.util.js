import { getSessionVar, setSessionVar } from "@/util/localstorage.util";
import { SESSION } from "@/constants";

export function saveAddressSession({
  address: { id, address: name, home, floor, entrance },
}) {
  setSessionVar(SESSION.ADDRESS.ID, id);
  setSessionVar(SESSION.ADDRESS.NAME, name);
  setSessionVar(SESSION.ADDRESS.HOME, home);
  setSessionVar(SESSION.ADDRESS.FLOOR, floor);
  setSessionVar(SESSION.ADDRESS.ENTRANCE, entrance);
}

export function getAddressSession() {
  return {
    id: getSessionVar(SESSION.ADDRESS.ID),
    name: getSessionVar(SESSION.ADDRESS.NAME),
    home: getSessionVar(SESSION.ADDRESS.HOME),
    floor: getSessionVar(SESSION.ADDRESS.FLOOR),
    entrance: getSessionVar(SESSION.ADDRESS.ENTRANCE),
  };
}

export function hasAddressSession() {
  return !!getSessionVar(SESSION.ADDRESS.ID);
}

export function savePickupBranchSession({
  pickup: { id, address, name, distance },
}) {
  setSessionVar(SESSION.PICKUP.ID, id);
  setSessionVar(SESSION.PICKUP.ADDRESS, address);
  setSessionVar(SESSION.PICKUP.NAME, name);
  setSessionVar(SESSION.PICKUP.DISTANCE, distance);
}

export function getPickupBranchSession() {
  return {
    id: getSessionVar(SESSION.PICKUP.ID),
    address: getSessionVar(SESSION.PICKUP.ADDRESS),
    name: getSessionVar(SESSION.PICKUP.NAME),
    distance: getSessionVar(SESSION.PICKUP.DISTANCE),
  };
}

export function hasPickupBranchSession() {
  return !!getSessionVar(SESSION.PICKUP.ID);
}

export function saveTableSession({
  table: {
    id,
    name,
    branch: { name: branchName, id: branchId },
  },
}) {
  setSessionVar(SESSION.TABLE.ID, id);
  setSessionVar(SESSION.TABLE.NAME, name);
  setSessionVar(SESSION.TABLE.BRANCH_ID, branchId);
  setSessionVar(SESSION.TABLE.BRANCH_NAME, branchName);
}

export function getTableSession() {
  return {
    id: getSessionVar(SESSION.TABLE.ID),
    name: getSessionVar(SESSION.TABLE.NAME),
    branchId: getSessionVar(SESSION.TABLE.BRANCH_ID),
    branchName: getSessionVar(SESSION.TABLE.BRANCH_NAME),
  };
}

export function hasTableSession() {
  return !!getSessionVar(SESSION.TABLE.ID);
}

export function saveRequestPageInQr({ name }) {
  setSessionVar("qr_request_page", name);
}

export function getRequestPageInQr() {
  return getSessionVar("qr_request_page");
}

export function saveRequestPageInCreateAddress({ name }) {
  setSessionVar("create_address_request_page", name);
}

export function getRequestPageInCreateAddress() {
  return getSessionVar("create_address_request_page");
}
