import { ref } from "vue";
import { defineStore } from "pinia";
import { ServiceModuleEnum } from "@/types/ServiceModuleEnum";

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
  function getTableNames(moduleName: ServiceModuleEnum) {
    switch (moduleName) {
      case ServiceModuleEnum.HERB:
        return herbTableNames;
      case ServiceModuleEnum.PRESCRIPTION:
        return prescriptionTableNames;
      case ServiceModuleEnum.ITEM_DIFFERENTIATION:
        return itemDifferentiationTableNames;
    }
  }

  const herbColumnHeadsA = ref(
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
  const herbColumnHeadsB = ref(
    new Map([
      ["唯一识别码", "id"],
      ["中草药 ID", "herbId"],
      ["出处", "derivation"],
      ["心得内容", "content"],
    ]),
  );
  const prescriptionColumnHeadsA = ref(
    new Map([
      ["唯一识别码", "id"],
      ["名称", "name"],
      ["别名", "nickname"],
      ["解释", "description"],
    ]),
  );
  const prescriptionColumnHeadsB = ref(
    new Map([
      ["唯一识别码", "id"],
      ["中药处方 ID", "prescriptionId"],
      ["中药 ID", "herbId"],
      ["用量", "dosage"],
      ["用法", "usage"],
    ]),
  );
  const itemDifferentiationColumnHeadsA = ref(
    new Map([
      ["唯一识别码", "id"],
      ["编号", "code"],
      ["内容", "content"],
      ["注释", "annotation"],
    ]),
  );
  const itemDifferentiationColumnHeadsB = ref(
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
  function getColumnHeads(moduleName: ServiceModuleEnum, needQueryA: boolean) {
    switch (moduleName) {
      case ServiceModuleEnum.HERB:
        return needQueryA ? herbColumnHeadsA : herbColumnHeadsB;
      case ServiceModuleEnum.PRESCRIPTION:
        return needQueryA ? prescriptionColumnHeadsA : prescriptionColumnHeadsB;
      case ServiceModuleEnum.ITEM_DIFFERENTIATION:
        return needQueryA
          ? itemDifferentiationColumnHeadsA
          : itemDifferentiationColumnHeadsB;
    }
  }

  return { getTableNames, getColumnHeads };
});
