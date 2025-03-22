import { API_CONFIG } from "@/constants";
import { ApiDefinition, EndpointFor, EndpointParamTypes } from "@/types";

const createEndpoint = <T extends ApiDefinition>(config: T): EndpointFor<T> => {
  const handler = {
    get: (target: any, prop: string) => {
      if (prop === "toString") return () => target.path;
      if (prop === "query") return (params: EndpointParamTypes) => {
        const query = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined) query.append(key, value.toString());
        }
        return `${target.path}?${query}`;
      }

      const kebabProp = prop.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

      return new Proxy({
        path: `${target.path}/${kebabProp}`,
        method: (config as any)[prop]?.method,
      }, handler);
    }
  };

  return new Proxy({ path: "/api" }, handler) as any;
}

export const api = createEndpoint(API_CONFIG);