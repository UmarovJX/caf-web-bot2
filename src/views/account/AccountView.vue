<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "@/locales";
import { XIcon } from "../../components/elements/material-icons";
import api from "../../services/api";
import { TELEGRAM, WEB_APP } from "@/constants";
import RoundButton from "@/components/reusable/button/RoundButton.vue";

const { locale } = useI18n();
const firstName = ref(null);
const phone = ref(null);
const showModal = ref(false);
const langOptions = [
  {
    id: 1,
    text: "Русский",
    value: "ru",
  },
  {
    id: 2,
    text: "English",
    value: "en",
  },
  {
    id: 3,
    text: "O'zbekcha",
    value: "uz",
  },
];

let checkedLangOption = ref(locale.value);

const links = [
  {
    id: 1,
    text: "titles.my_orders",
    icon: "shopping_basket",
    path: "/orders",
  },
  {
    id: 2,
    text: "titles.my_addresses",
    icon: "location_on",
    path: "/addresses",
  },
  {
    id: 3,
    text: "titles.favorite",
    icon: "favorite",
    path: "/favorites",
  },
  {
    id: 4,
    text: "titles.cashback",
    icon: "redeem",
    path: "/cashback",
  },
];

let webApp = window[TELEGRAM][WEB_APP];
webApp.MainButton.isVisible = false;

async function fetchAccountDetails() {
  const {
    data: { result },
  } = await api.client.getClient();
  firstName.value = result.first_name;
  phone.value = result.phone;
  locale.value = result.language ?? locale.value;
  checkedLangOption.value = locale.value;
}

async function fetchShopInfo() {
  const {
    data: { result },
  } = await api.shop.getShopInfo();
  langOptions.value = result.language;
}

async function setI18nLanguage({ value }) {
  const body = {
    language: value,
  };
  locale.value = value;
  localStorage.setItem("locale", value);
  showModal.value = false;
  await api.client.updateLocaleLang(body);
}

function closeLanguagePicker() {
  showModal.value = false;
}

onMounted(async () => {
  await fetchAccountDetails();
  await fetchShopInfo();
});
</script>

<template>
  <div class="account">
    <div class="header d-flex align-items-center justify-content-between">
      <p class="header-title t-large">{{ $t("user.title") }}</p>
      <!--      <x-icon color="var(&#45;&#45;brown)" name="logout" size="24" />-->
    </div>

    <div
      class="account-details d-flex align-items-center justify-content-between"
    >
      <div class="d-flex align-items-center">
        <div class="account-img">
          <x-icon color="var(--brown)" name="person" size="24" />
        </div>

        <div class="d-flex flex-column">
          <p class="account-details_name h-small">{{ firstName }}</p>
          <span class="account-details_number b-medium">{{ phone }}</span>
        </div>
      </div>

      <router-link :to="{ name: 'account-edit' }">
        <x-icon color="var(--brown)" name="edit" size="24" />
      </router-link>
    </div>

    <div v-for="link in links" :key="link.id" class="account-links">
      <router-link :to="link.path" class="d-flex account-link">
        <x-icon :name="link.icon" color="var(--brown)" size="24" />
        <p class="b-large account-link_text">{{ $t(`${link.text}`) }}</p>
      </router-link>
    </div>

    <!--  MODAL BUTTON  -->
    <div class="custom-container account-lang">
      <p class="l-large">{{ $t("others.bot_settings") }}</p>

      <button class="d-flex" @click="showModal = true">
        <x-icon color="var(--brown)" name="language" size="24" />
        <span class="b-large account-lang_text">
          {{ $t("language.title") }}
        </span>
      </button>
    </div>

    <!--  MODAL  -->
    <div>
      <Teleport :disabled="showModal" to="body">
        <Transition name="modal">
          <div v-if="showModal" id="myModal" class="modal">
            <!-- Modal content -->
            <div class="modal-content">
              <div class="setting-lang d-flex flex-column">
                <p class="lang-title t-large">
                  {{ $t("titles.language") }}
                </p>

                <div class="lang-option">
                  <label
                    v-for="option in langOptions"
                    :key="option.id"
                    :for="option.id"
                    class="container b-large"
                    >{{ option.text }}
                    <input
                      :id="option.id"
                      v-model="checkedLangOption"
                      :value="option.value"
                      name="option"
                      type="radio"
                      @change="setI18nLanguage(option)"
                    />
                    <span class="checkmark"></span>
                  </label>
                </div>

                <div class="c-flex" style="justify-content: flex-end">
                  <round-button
                    style="padding: 10px 24px; width: auto"
                    @click="closeLanguagePicker"
                  >
                    Отменить
                  </round-button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./account-style.scss" />
