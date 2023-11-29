<script setup>
import AppProduct from "@/components/AppProduct.vue";
import VueElementLoading from "vue-element-loading";
import { ref } from "vue";
import api from "@/services/api";

const allProducts = ref([]);

let isFetching = ref(false);

const getFavoriteList = async () => {
  isFetching.value = true;
  try {
    const {
      data: { result },
    } = await api.product.fetchFavorites();

    allProducts.value = result;
  } finally {
    isFetching.value = false;
  }
};

getFavoriteList();
</script>

<template>
  <div>
    <div class="header d-flex align-items-center justify-content-between">
      <p class="header-title t-large">{{ $t("titles.favorite") }}</p>
      <!--          <app-header style="width: fit-content; padding: 0" />-->
    </div>
    <vue-element-loading
      :active="isFetching"
      :is-full-screen="true"
      color="#683724"
    />

    <div class="page-layout">
      <!--      <app-sidebar />-->
      <div class="favorites d-flex flex-column">
        <div class="custom-container" style="min-height: calc(100vh - 88px)">
          <div class="favorites-cards">
            <app-product
              v-for="item in allProducts"
              :key="item.product.id"
              :description="item.name"
              :image="item.image"
              :price="item.product.price"
              :product="item"
            >
            </app-product>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./favorites-style.scss" />
