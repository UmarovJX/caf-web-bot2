<script setup>
import { defineProps, onMounted, reactive } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const appElement = document.getElementById("app");

const drawerStore = reactive({
  body: {
    overflowY: null,
    height: null,
  },
  app: {
    overflowY: null,
    height: null,
  },
});

function initializeBodyStyle() {
  drawerStore.app.overflowY = appElement.style.overflowY;
  drawerStore.app.height = appElement.style.height;
  // drawerStore.body.overflowY = document.body.style.overflowY;
  // drawerStore.body.height = document.body.style.height;
}

onMounted(() => {
  initializeBodyStyle();
});
</script>

<template>
  <Teleport :disabled="props.show" to="body">
    <Transition name="modal">
      <div v-if="props.show" class="modal-mask">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"></slot>
          </div>

          <div class="modal-body">
            <slot name="body"></slot>
          </div>

          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.modal-mask {
  width: 100%;
  top: calc(-100vh - 60px);
  height: calc(100vh + 60px);
  display: flex;
  transition: opacity 0.3s ease;

  &::before {
    content: "";
    left: 0;
    right: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    z-index: 2;
    width: 100%;
    height: 300%;
    top: -120%;
  }
}

.modal-container {
  position: fixed;
  z-index: 9998;
  bottom: 0;
  width: 100%;
  margin: auto;
  background-color: var(--background_secondary);
  transition: all 0.5s ease-in-out;
  border-radius: 16px 16px 0 0;
  border: 1px solid var(--background_secondary);
  overflow: hidden;
  //opacity: 1;
}

//.modal-enter-from {
//  opacity: 0;
//}
//
//.modal-leave-to {
//  opacity: 0;
//}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: translateY(100%);
}
</style>
