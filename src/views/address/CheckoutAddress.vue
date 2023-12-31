<script setup>
// import XIcon from "@/components/elements/material-icons/XIcon.vue";
import { FormInput } from "@/components/elements/form-input";
import { ref } from "vue";
import api from "@/services/api";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { GoogleMap, Marker } from "vue3-google-map";
import { TELEGRAM, WEB_APP } from "@/constants";

import { mainButtonOffClick, mainButtonOnClick } from "@/util/main.button.util";
import { useI18n } from "@/locales";
import {
  getRequestPageInCreateAddress,
  saveAddressSession,
} from "@/util/address.util";

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const addressDetails = ref({
  addressName: {
    id: "address",
    label: "labels_placeholders.address",
    type: "text",
    value: "",
  },
  addressEntrance: {
    id: "entrance",
    label: "labels_placeholders.entrance",
    type: "text",
    value: "",
  },
  addressFloor: {
    id: "floor",
    label: "labels_placeholders.floor",
    type: "text",
    value: "",
  },
  addressApartment: {
    id: "apartment",
    label: "labels_placeholders.flat",
    type: "text",
    value: "",
  },
  addressComment: {
    id: "comment",
    label: "labels_placeholders.comments",
    type: "text",
    value: "",
  },
  location: {
    latitude: 69.2700806,
    longitude: 41.3006733,
  },
});
const center = ref({ lat: 41.3103107, lng: 69.2779284 });
const markerOptions = ref({
  position: center.value,
  clickable: true,
  draggable: true,
});

async function fetchClientAddress() {
  addressDetails.value.addressName.value = null;
  addressDetails.value.addressEntrance.value = null;
  addressDetails.value.addressApartment.value = null;
  addressDetails.value.addressFloor.value = null;
  addressDetails.value.addressComment.value = null;
  addressDetails.value.location.latitude = 41.3103107;
  addressDetails.value.location.longitude = 69.2779284;
}

const createClientAddress = async () => {
  const body = {
    address: addressDetails.value.addressName.value,
    entrance: addressDetails.value.addressEntrance.value,
    home: addressDetails.value.addressApartment.value,
    floor: addressDetails.value.addressFloor.value,
    comment: addressDetails.value.addressComment.value,
    location: addressDetails.value.location,
    is_primary: false,
  };
  try {
    const { data } = await api.client.createAddress(body);
    if (data.result) {
      // await router.push({
      //   name: "address-select",
      //   query: {
      //     id: data.result.id,
      //     type: "delivery",
      //   },
      // });
      saveAddressSession({ address: data.result });
      await defineRedirectPage();
    }
  } catch (e) {
    return e;
  }
};

const defineRedirectPage = async () => {
  const redirectPage = getRequestPageInCreateAddress();
  if (redirectPage) {
    await router.push({
      name: redirectPage,
    });
  } else {
    await router.push({
      name: "delivery-view",
    });
  }
};

function changeLocation(location) {
  const newPosition = {
    latitude: location.latLng.lat(),
    longitude: location.latLng.lng(),
  };
  center.value = {
    lat: location.latLng.lat(),
    lng: location.latLng.lng(),
  };
  addressDetails.value.location = newPosition;
}

fetchClientAddress();

if (route.name === "checkout-address-create") {
  window[TELEGRAM][WEB_APP].MainButton.color = "#D5C7C2";
  window[TELEGRAM][WEB_APP].MainButton.textColor = "#1D0B00";
  window[TELEGRAM][WEB_APP].MainButton.setText(t("buttons.to_save"));
  window[TELEGRAM][WEB_APP].MainButton.isVisible = true;
}

function getLocation() {
  return new Promise((resolve, reject) => {
    const success = (position) => resolve(position);
    const error = (error) => reject(error);
    return navigator.geolocation.getCurrentPosition(success, error);
  });
}

async function getPermissionToLocation() {
  try {
    const {
      coords: { latitude, longitude },
    } = await getLocation();
    center.value = {
      lat: latitude,
      lng: longitude,
    };
    markerOptions.value = {
      ...markerOptions.value,
      position: center.value,
    };
  } catch (err) {
    console.error("Unable to get position", err);
  }
}

async function checkoutAddressMainButtonHandler() {
  if (route.name === "checkout-address-create") {
    window[TELEGRAM][WEB_APP].MainButton.showProgress(true);
    window[TELEGRAM][WEB_APP].MainButton.disable();
    await createClientAddress();
    window[TELEGRAM][WEB_APP].MainButton.enable();
    window[TELEGRAM][WEB_APP].MainButton.hideProgress();
  }
}

getPermissionToLocation();

mainButtonOnClick(checkoutAddressMainButtonHandler);
onBeforeRouteLeave(() => {
  mainButtonOffClick(checkoutAddressMainButtonHandler);
});
</script>

<template>
  <div class="address-map">
    <div class="header">
      <div class="d-flex align-items-center justify-content-between">
        <p class="header-title t-large">{{ $t("titles.delivery_address") }}</p>
        <!--        <div>-->
        <!--          <span-->
        <!--            v-if="route.name === 'address-create'"-->
        <!--            @click="createClientAddress"-->
        <!--          >-->
        <!--            <x-icon color="var(&#45;&#45;brown)" name="done" size="24" />-->
        <!--          </span>-->

        <!--          <span-->
        <!--            v-else-->
        <!--            @click="updateClientAddress"-->
        <!--          >-->
        <!--            <x-icon color="var(&#45;&#45;brown)" name="done" size="24" />-->
        <!--          </span>-->
        <!--        </div>-->
      </div>
    </div>

    <GoogleMap
      :center="center"
      :zoom="15"
      api-key="AIzaSyDIm3DnxGMLuv9LUj_CaCQqxtnJ2i2btps"
      style="width: 100%; height: 400px"
    >
      <Marker :options="markerOptions" @dragend="changeLocation($event)" />
    </GoogleMap>

    <div class="custom-container">
      <div class="address-map_inputs">
        <FormInput
          v-model="addressDetails.addressName.value"
          :multi-lang="true"
          :props-data="addressDetails.addressName"
        />
        <div class="address-map_inputs-block">
          <FormInput
            v-model="addressDetails.addressEntrance.value"
            :multi-lang="true"
            :props-data="addressDetails.addressEntrance"
            class="address-map_inputs-block-1"
          />
          <FormInput
            v-model="addressDetails.addressFloor.value"
            :multi-lang="true"
            :props-data="addressDetails.addressFloor"
            class="address-map_inputs-block-2"
          />
          <FormInput
            v-model="addressDetails.addressApartment.value"
            :multi-lang="true"
            :props-data="addressDetails.addressApartment"
            class="address-map_inputs-block-3"
          />
        </div>
        <FormInput
          v-model="addressDetails.addressComment.value"
          :multi-lang="true"
          :props-data="addressDetails.addressComment"
        />
      </div>

      <span class="address-map_comment b-medium">
        {{ $t("others.address_comment") }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./address-map-style.scss"></style>
