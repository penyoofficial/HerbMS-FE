import axios from "axios";
import { RuleEngine } from "./RuleEngine";
import type { ModuleMapper } from "@/types/ModuleMapper";
import type { TableMapper } from "@/types/TableMapper";

/**
 * 网络 IO 引擎
 */
export namespace NetworkIOEngine {
  /**
   * 根据根 URI 和参数集获取不安全 URI。
   */
  export function getUnsafeURI(rootURI: string, params?: Map<string, unknown>) {
    let paramsStr = "?";
    if (params)
      params.forEach((v, k) => {
        if (k && v) paramsStr += `${k}=${v}&`;
      });
    paramsStr = paramsStr.slice(0, -1);
    return rootURI + paramsStr;
  }

  /**
   * 向目标地址请求。
   */
  export async function request(
    rootURI: string,
    params?: Map<string, unknown>,
  ) {
    return (await axios.get(getUnsafeURI(rootURI, params))).data;
  }

  /**
   * 返回数据包
   */
  export interface ReturnDataPack {
    affectedRows: number;
    objs: any[];
  }

  /**
   * 向目标 Servlet 请求。
   */
  export async function requestServlet(
    tm: TableMapper,
    params: Map<string, unknown>,
    servletType?: "specific",
  ) {
    return (await request(
      `http://localhost:1919/herbms/use-${tm}${
        servletType ? "-" + servletType : ""
      }`,
      params,
    )) as ReturnDataPack;
  }

  /**
   * 获得一组数据包。
   */
  export function getDatas(
    serviceModule: ModuleMapper,
    needQueryA: boolean,
    params: Map<string, unknown>,
  ) {
    const tm = RuleEngine.tableMapper(serviceModule, needQueryA);
    return Promise.all([
      requestServlet(tm, params),
      requestServlet(tm, params, "specific"),
    ]);
  }
}
