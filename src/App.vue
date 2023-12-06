<script setup lang="ts">
import { ref } from "vue";
import { ModuleMapper } from "./types/ModuleMapper";
import Index from "./components/Index.vue";
import ServiceModule from "./components/ServiceTemplate.vue";
import { useThemeStore } from "./stores/theme";

useThemeStore().applyTheme();

type PageType = "" | ModuleMapper;

const menu = ref<[string, PageType][]>([
  ["首页", ""],
  ["中草药管理", ModuleMapper.HERB],
  ["处方管理", ModuleMapper.PRESCRIPTION],
  ["条辨管理", ModuleMapper.ITEM_DIFFERENTIATION],
]);
const view = ref(menu.value[0][1]);

/**
 * 获取提示。
 */
function getTip() {
  const tipSet = [
    "按住 Shift 再滚动鼠标滚轮可以便捷横向查看表格哦~",
    "对记录操作的按钮位于表格最右边哦~",
  ];
  return tipSet[Math.floor(Math.random() * tipSet.length)];
}

function handleChangeView(path: PageType) {
  view.value = path;
}
</script>

<template>
  <div class="box">
    <div class="title-box">
      <h1 class="title">中药处方管理系统</h1>
      <p class="subtitle">Powered by Penyo</p>
    </div>
    <div class="content">
      <ul class="menu">
        <li
          v-for="fx in menu"
          class="fx"
          :class="fx[1] === view ? 'now' : ''"
          @click="handleChangeView(fx[1])"
        >
          {{ fx[0] }}
        </li>
        <li class="tip">小提示：{{ getTip() }}</li>
      </ul>
      <div class="view">
        <index v-if="view === ''" />
        <service-module v-else :service-module="view" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  position: fixed;
  width: calc(100vw - 2rem * 2);
  height: calc(100vh - 2.2rem - 2rem);
  padding: 2.2rem 2rem 2rem;
  background: var(--c-highlight);
  & .title-box {
    display: flex;
    color: var(--c-text-highlight);
    user-select: none;
    & .title {
      margin-right: 0.3rem;
    }
    & .subtitle {
      opacity: 0.3;
    }
  }
  & .content {
    display: flex;
    width: 100%;
    height: calc(100% - 2.6rem);
    background: var(--c-background);
    border-radius: 0.3rem;
    overflow: hidden;
    box-shadow: 0 0.1rem 3px 3px rgba(0, 0, 0, 0.1);
    & .menu {
      flex: 1;
      box-shadow: 0 0.1rem 3px 3px rgba(0, 0, 0, 0.1);
      user-select: none;
      & .fx {
        display: flex;
        align-items: center;
        height: 3rem;
        border-bottom: 1px solid var(--c-background-2);
        color: var(--c-text);
        text-indent: 2rem;
        &.now {
          background: linear-gradient(
            to right,
            var(--c-highlight),
            var(--c-background)
          );
          color: var(--c-text-highlight);
        }
      }
      & .tip {
        padding: 2rem;
        color: var(--c-text);
        opacity: 0.5;
      }
    }
    & .view {
      flex: 4;
      overflow: hidden;
    }
  }
}
</style>
./types/ModuleMapper
