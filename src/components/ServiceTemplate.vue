<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import type { ModuleMapper } from "@/types/ModuleMapper";
import { useDictionaryStore } from "@/stores/dictionary";
import { NetworkIOEngine } from "@/apis/NetworkIOEngine";

const props = defineProps<{
  /** 业务模块名 */
  serviceModule: ModuleMapper;
}>();

// 桥梁状态

const needQueryA = ref<boolean>(true);
const affectedRows = ref<number>(-1);
const objs = ref<any[]>([]);
const subObjs = ref<any[]>([]);

watchEffect(() => {
  if (affectedRows.value === 0) alert("操作失败！可能是因为不合法的请求参数。");
});

// 页内状态

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
const subColumnHeads = ref<string[]>([]);
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
  subColumnHeads.value = useDictionaryStore().getSubColumnHeads(
    props.serviceModule,
    needQueryA.value,
  );
});

/**
 * 获取参数集。
 */
function getParams(e?: Event) {
  const params = new Map<string, unknown>([
    ["opType", opType.value || "query"],
  ]);
  if (selectedRowId.value >= 0) params.set("id", selectedRowId.value);
  if (e)
    new FormData(e.target as HTMLFormElement).forEach((v, k) => {
      params.set(k, v);
    });
  return params;
}

function handleSubmit(e?: Event) {
  objs.value = [];
  subObjs.value = [];

  const params = getParams(e);
  NetworkIOEngine.getDatas(props.serviceModule, needQueryA.value, params).then(
    (datas) => {
      affectedRows.value = datas[0].affectedRows;
      objs.value = datas[0].objs;
      subObjs.value = datas[1].objs;
    },
  );
}

const dialog = ref();

function handleShowDialog(display: boolean) {
  opType.value = "add";
  if (dialog && dialog.value)
    if (display) dialog.value.showModal();
    else dialog.value.close();

  selectedRowValue.value = [];
}

function handleAlterOP(id: number) {
  opType.value = "update";
  handleShowDialog(true);

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
        <button @click="handleShowDialog(true)">新增</button>
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
        <div class="buttons">
          <button
            v-for="b in [0, 1]"
            type="submit"
            @click="(needQueryA = !b), (opType = 'query')"
          >
            查询{{ tableNames[b] }}
          </button>
        </div>
      </form>
    </div>
    <div class="line"></div>
    <dialog ref="dialog">
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
        <span class="buttons" @click="handleShowDialog(false)">
          <input type="submit" />
          <input type="button" value="取消" />
        </span>
      </form>
    </dialog>
    <table class="result">
      <thead>
        <tr>
          <th
            v-for="ch in Array.from(columnHeads.keys()).concat(subColumnHeads)"
            :style="`min-width: ${ch.length}rem;`"
          >
            {{ ch }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(o, i) in objs">
          <td v-for="col in o">{{ col }}</td>
          <td v-if="subObjs.length > 0">
            <div class="ps">{{ subObjs[i] || "无" }}</div>
          </td>
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
  height: calc(100% - 2rem);
  padding: 1rem 2rem;

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

  & .result .ps {
    width: 10rem;
    max-height: 5rem;
    overflow: auto;
  }
}
</style>
