import axios from "axios";
import type { ModuleMapper } from "@/types/ModuleMapper";

/**
 * 网络 IO 引擎
 */
export namespace NetworkIOEngine {
  /**
   * 根据根 URI 和参数集获取不安全 URI。
   */
  export function getUnsafeURI(rootURI: string, params?: Map<string, unknown>) {
    let uri = `${rootURI}?`;
    if (params)
      params.forEach((v, k) => {
        uri += `${k}=${v}&`;
      });
    return uri.slice(0, -1);
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
   * 主数据包
   */
  export interface MainDataPack {
    needQueryA: boolean;
    affectedRows: number;
    objs: any[];
  }

  /**
   * 特别数据包
   */
  export interface SpecificDataPack {
    objs: any[];
  }

  /**
   * 向目标 Servlet 请求。
   */
  export async function requestServlet(
    serviceModule: ModuleMapper,
    params: Map<string, unknown>,
    servletType?: "Specific",
  ): Promise<MainDataPack | SpecificDataPack> {
    if (!servletType)
      return (await request(
        `http://localhost/herbms/${serviceModule}Servlet`,
        params,
      )) as MainDataPack;
    else
      return (await request(
        `http://localhost/herbms/${serviceModule}Servlet${servletType}`,
        params,
      )) as SpecificDataPack;
  }
}
