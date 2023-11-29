<script setup>
import { FormInput } from "@/components/elements/form-input";
import { ref } from "vue";
import api from "../../services/api";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { TELEGRAM, WEB_APP } from "@/constants";

import { useI18n } from "vue-i18n";
import { mainButtonOffClick, mainButtonOnClick } from "@/util/main.button.util";

const { t } = useI18n();

const router = useRouter();
const route = useRoute();

const name = ref({
  id: "name",
  label: "labels_placeholders.name",
  type: "text",
  value: null,
});

const phone = ref({
  id: "phone",
  label: "labels_placeholders.phone",
  type: "text",
  value: 0,
});

const isSubmitted = ref(false);
const isValidated = ref(false);

async function fetchAccountDetails() {
  const { data } = await api.client.getClient();
  name.value.value = data.result.first_name;
  phone.value.value = data.result.phone;
}

const updateClientSubmit = async () => {
  if (route.name === "account-edit") {
    const body = {
      first_name: name.value.value,
      phone: phone.value.value,
    };
    await api.client.updateClient(body).finally(async () => {
      await router.push({ name: "account-view" });
    });
  }
};

const webApp = window[TELEGRAM][WEB_APP];
webApp.MainButton.setText(t("buttons.to_save"));
webApp.MainButton.color = "#683724";
webApp.MainButton.textColor = "#FFFFFF";

if (isValidated.value) {
  webApp.MainButton.setText(t("buttons.required_to_fill"));
  webApp.MainButton.color = "#E92C2C";
  webApp.MainButton.textColor = "#FFFFFF";
}

webApp.MainButton.isVisible = true;
fetchAccountDetails();

mainButtonOnClick(updateClientSubmit);
onBeforeRouteLeave(() => {
  mainButtonOffClick(updateClientSubmit);
});
</script>

<template>
  <div class="account-edit">
    <div class="header">
      <p class="header-title t-large">{{ $t("titles.user_details") }}</p>
    </div>
    <div class="custom-container">
      <FormInput
        key="name"
        v-model="name.value"
        :is-submitted="false"
        :is-validated="isValidated"
        :multi-lang="true"
        :props-data="name"
      />

      <FormInput
        key="phone"
        v-model="phone.value"
        :is-submitted="false"
        :is-validated="isValidated"
        :multi-lang="true"
        :props-data="phone"
      />
    </div>

    <div class="account-edit_save">
      <span
        :class="{ active: isSubmitted }"
        class="account-edit_save-text l-large"
      >
        {{ $t("others.save_changes") }}
      </span>

      <!--      <button @click="update">-->
      <!--        <p class="l-large">Сохранить</p>-->
      <!--      </button>-->
    </div>
  </div>
</template>

<style lang="scss" scoped src="./account-edit-style.scss" />
