import { ref } from "vue";
import { defineStore } from "pinia";
import { ModuleMapper } from "@/types/ModuleMapper";
import { RuleEngine } from "@/apis/RuleEngine";
import { TableMapper } from "@/types/TableMapper";

export const useDictionaryStore = defineStore("dictionary", () => {
  const herbTableNames = ref<[string, string]>(["中草药", "心得"]);
  const prescriptionTableNames = ref<[string, string]>(["经方概要", "经方"]);
  const itemDifferentiationTableNames = ref<[string, string]>([
    "条辨概要",
    "条辨",
  ]);

  /**
   * 获取指定表名组。
   */
  function getTableNames(moduleName: ModuleMapper) {
    switch (moduleName) {
      case ModuleMapper.HERB:
        return herbTableNames;
      case ModuleMapper.PRESCRIPTION:
        return prescriptionTableNames;
      case ModuleMapper.ITEM_DIFFERENTIATION:
        return itemDifferentiationTableNames;
    }
  }

  const herbsColumnHeads = ref(
    new Map([
      ["唯一识别码", "id"],
      ["编号", "code"],
      ["学名", "name"],
      ["别名", "nickname"],
      ["归属类别", "type"],
      ["本经原文", "description"],
      ["主治", "efficacy"],
      ["性味", "taste"],
      ["产地", "origin"],
      ["用量", "dosage"],
      ["禁忌", "taboo"],
      ["炮制方法", "processing"],
    ]),
  );
  const experiencesColumnHeads = ref(
    new Map([
      ["唯一识别码", "id"],
      ["中草药 ID", "herbId"],
      ["出处", "derivation"],
      ["心得内容", "content"],
    ]),
  );
  const prescriptionInfosColumnHeads = ref(
    new Map([
      ["唯一识别码", "id"],
      ["名称", "name"],
      ["别名", "nickname"],
      ["解释", "description"],
    ]),
  );
  const prescriptionsColumnHeads = ref(
    new Map([
      ["唯一识别码", "id"],
      ["中药处方 ID", "prescriptionId"],
      ["中药 ID", "herbId"],
      ["用量", "dosage"],
      ["用法", "usage"],
    ]),
  );
  const itemDifferentiationInfosColumnHeads = ref(
    new Map([
      ["唯一识别码", "id"],
      ["编号", "code"],
      ["内容", "content"],
      ["注释", "annotation"],
    ]),
  );
  const itemDifferentiationsColumnHeads = ref(
    new Map([
      ["唯一识别码", "id"],
      ["条辩 ID", "itemDifferentiationId"],
      ["处方 ID", "prescriptionId"],
      ["类型", "type"],
    ]),
  );

  /**
   * 获取指定列名组。
   */
  function getColumnHeads(moduleName: ModuleMapper, needQueryA: boolean) {
    switch (RuleEngine.tableMapper(moduleName, needQueryA)) {
      case TableMapper.HERBS:
        return herbsColumnHeads;
      case TableMapper.EXPERIENCES:
        return experiencesColumnHeads;
      case TableMapper.PRESCRIPTION_INFOS:
        return prescriptionInfosColumnHeads;
      case TableMapper.PRESCRIPTIONS:
        return prescriptionsColumnHeads;
      case TableMapper.ITEM_DIFFERENTIATION_INFOS:
        return itemDifferentiationInfosColumnHeads;
      case TableMapper.ITEM_DIFFERENTIATIONS:
        return itemDifferentiationsColumnHeads;
    }
  }

  /**
   * 获取指定副列名组。
   */
  function getSubColumnHeads(moduleName: ModuleMapper, needQueryA: boolean) {
    switch (RuleEngine.tableMapper(moduleName, needQueryA)) {
      case TableMapper.HERBS:
        return ["用药心得"];
      case TableMapper.EXPERIENCES:
        return ["所涉中草药"];
      case TableMapper.PRESCRIPTION_INFOS:
        return ["相关条辨"];
      case TableMapper.PRESCRIPTIONS:
        return ["经方大略"];
      case TableMapper.ITEM_DIFFERENTIATION_INFOS:
        return ["相关经方"];
      case TableMapper.ITEM_DIFFERENTIATIONS:
        return [];
    }
  }

  return { getTableNames, getColumnHeads, getSubColumnHeads };
});
