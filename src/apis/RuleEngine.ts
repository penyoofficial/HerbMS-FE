import { ModuleMapper } from "@/types/ModuleMapper";
import { TableMapper } from "@/types/TableMapper";

/**
 * 规则引擎
 */
export namespace RuleEngine {
  /**
   * 表映射器。
   *
   * *本质是2-1译码器。*
   */
  export function tableMapper(
    serviceModule: ModuleMapper,
    needQueryA: boolean,
  ) {
    switch (serviceModule) {
      case ModuleMapper.HERB:
        return needQueryA ? TableMapper.HERBS : TableMapper.EXPERIENCES;
      case ModuleMapper.PRESCRIPTION:
        return needQueryA
          ? TableMapper.PRESCRIPTION_INFOS
          : TableMapper.PRESCRIPTIONS;
      case ModuleMapper.ITEM_DIFFERENTIATION:
        return needQueryA
          ? TableMapper.ITEM_DIFFERENTIATION_INFOS
          : TableMapper.ITEM_DIFFERENTIATIONS;
    }
  }
}
