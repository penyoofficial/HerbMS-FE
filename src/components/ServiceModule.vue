<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import axios from "axios";
import type { ServiceModuleEnum } from "@/types/ServiceModuleEnum";
import { useDictionaryStore } from "@/stores/dictionary";

const props = defineProps<{
  /** 业务模块名 */
  serviceModule: ServiceModuleEnum;
}>();

// 桥梁状态

const needQueryA = ref<boolean>(true);
const affectedRows = ref<number>(-1);
const objs = ref<any[]>([]);

watchEffect(() => {
  if (affectedRows.value === 0) alert("操作失败！可能是因为不合法的请求参数。");
});

// 页内状态

const isNewingFormPoped = ref(false);
const searchBar = ref({
  keyword: "",
  isId: false,
  reset() {
    this.keyword = "";
    this.isId = false;
  },
});
const opType = ref("");
const tableNames = ref<[string, string]>(["", ""]);
const columnHeads = ref<Map<string, string>>(new Map());
const selectedRowValue = ref<(number | string)[]>([]);
const selectedRowId = ref(-1);

watch(
  () => props.serviceModule,
  () => {
    needQueryA.value = true;
    handleSubmit();
  },
  { immediate: true },
);

watchEffect(() => {
  searchBar.value.reset();
  tableNames.value = useDictionaryStore().getTableNames(
    props.serviceModule,
  ).value;
  columnHeads.value = useDictionaryStore().getColumnHeads(
    props.serviceModule,
    needQueryA.value,
  ).value;
});

/**
 * 获取参数集。
 */
function getParams(e?: Event) {
  const params = new Map<string, unknown>([
    ["needQueryA", needQueryA.value],
    ["opType", opType.value],
  ]);
  if (selectedRowId.value >= 0) params.set("id", selectedRowId.value);
  if (e)
    new FormData(e.target as HTMLFormElement).forEach((v, k) => {
      params.set(k, v);
    });
  return params;
}

/**
 * 根据根 URI 和参数集获取不安全 URI。
 */
function getUnsafeURI(rootURI: string, params: Map<string, unknown>) {
  let uri = `${rootURI}?`;
  params.forEach((v, k) => {
    uri += `${k}=${v}&`;
  });
  return uri.slice(0, -1);
}

function handleSubmit(e?: Event) {
  objs.value = [];
  isNewingFormPoped.value = false;
  axios
    .get(
      getUnsafeURI(
        `http://localhost/herbms/${props.serviceModule}Servlet`,
        getParams(e),
      ),
    )
    .then((resp) => {
      needQueryA.value = resp.data.needQueryA;
      affectedRows.value = resp.data.affectedRows;
      objs.value = resp.data.objs;
    });
}

function handleNewOrCancelOP() {
  opType.value = "add";
  isNewingFormPoped.value = !isNewingFormPoped.value;

  selectedRowValue.value = [];
}

function handleAlterOP(id: number) {
  opType.value = "update";
  isNewingFormPoped.value = true;

  objs.value.forEach((o) => {
    if (id === o.id) selectedRowValue.value = Object.values(o);
  });
}

function handleDeleteOP(id: number) {
  opType.value = "delete";
  selectedRowId.value = id;

  handleSubmit();
}
</script>

<template>
  <div class="shell">
    <div class="tool-bar">
      <div class="flex-left">
        <button @click="handleNewOrCancelOP">
          {{ isNewingFormPoped ? "取消" : "新增" }}
        </button>
      </div>
      <form class="flex-right" @submit.prevent="handleSubmit">
        <input
          type="text"
          name="keyword"
          placeholder="支持多关键字查询..."
          v-model="searchBar.keyword"
        />
        <input type="checkbox" name="isId" id="isId" v-model="searchBar.isId" />
        <label for="isId">ID 查询</label>
        <button v-show="false" type="submit"></button>
        <button
          v-for="b in [0, 1]"
          type="submit"
          @click="(needQueryA = !b), (opType = 'query')"
        >
          查询{{ tableNames[b] }}
        </button>
      </form>
    </div>
    <div class="line"></div>
    <div v-show="isNewingFormPoped" class="dialog">
      <form class="row-edit" @submit.prevent="handleSubmit">
        <p class="tip">若处于“新增”模式，则对唯一识别码的指定无效。</p>
        <table class="infos">
          <tr v-for="(ch, i) in columnHeads">
            <td>
              <label class="label" :for="ch[1]">{{ ch[0] }}</label>
            </td>
            <td>
              <input
                type="text"
                :name="ch[1]"
                :id="ch[1]"
                :value="selectedRowValue[i] || ''"
                required
              />
            </td>
          </tr>
        </table>
        <input type="submit" />
      </form>
    </div>
    <table class="result">
      <thead>
        <tr>
          <th
            v-for="ch in columnHeads"
            :style="`min-width: ${ch[0].length}rem;`"
          >
            {{ ch[0] }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in objs">
          <td v-for="col in o">{{ col }}</td>
          <td>
            <button @click="handleAlterOP(o.id)">改</button>
          </td>
          <td>
            <button @click="handleDeleteOP(o.id)">删</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  & .tool-bar {
    display: flex;
    & .flex-right {
      flex: 5;
    }
  }
  & .tip {
    font-style: italic;
    font-size: 0.8rem;
  }
  & .infos {
    margin-bottom: 1rem;
    & .label {
      margin-right: 1rem;
    }
  }
}
</style>
