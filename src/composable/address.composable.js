import { useAddressStore } from "@/store/address/address.store";
import {
  getAddressSession,
  getPickupBranchSession,
  getTableSession,
} from "@/util/address.util";
import { isNotUndefinedNullEmptyZero } from "@/util/inspect";
import { computed } from "vue";

export function addressDetailsComposable() {
  const { active, deliveryType } = useAddressStore();

  const addressInfo = computed(() => {
    active.value = !!active.value;

    switch (deliveryType.value) {
      case "delivery": {
        const { name, home, floor, entrance } = getAddressSession();
        let detail = "";
        if (isNotUndefinedNullEmptyZero(name)) {
          detail += name + " ";
        }
        if (isNotUndefinedNullEmptyZero(home)) {
          detail += home;
        }
        if (isNotUndefinedNullEmptyZero(floor)) {
          detail += ", " + floor;
        }
        if (isNotUndefinedNullEmptyZero(entrance)) {
          detail += ", " + entrance;
        }
        return {
          type: "Доставка",
          detail,
        };
      }

      case "pickup": {
        const { address, name, distance } = getPickupBranchSession();
        let detail = "";
        if (isNotUndefinedNullEmptyZero(name)) {
          detail += name + " ";
        }
        if (isNotUndefinedNullEmptyZero(address)) {
          detail += address;
        }
        if (isNotUndefinedNullEmptyZero(distance)) {
          detail += ", " + distance + " M";
        }
        return {
          type: "Самовывоз",
          detail,
        };
      }

      case "table": {
        const { name } = getTableSession();
        let detail = "";
        if (isNotUndefinedNullEmptyZero(name)) {
          detail += name;
        }
        return {
          type: "За столом",
          detail,
        };
      }
    }

    return {
      type: "За столом",
      detail: "",
    };
  });

  return {
    addressInfo,
  };
}
