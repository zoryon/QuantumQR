type Params = Record<string, string | number | undefined>;

interface Endpoint<T extends string> {
  /**
   * Convert the path to a string
   * @example
   * api.qrcodes.delete.toString() // "/api/qrcodes/delete"
   */
  toString: () => T;
  
  /**
   * Add a query string to the path
   * @example
   * api.search.query({ q: "test", page: 2 }) // "q=test&page=2"
   */
  query: (params: Params) => string;
  
  /** Access to sub path */
  [key: string]: Endpoint<`${T}/${string}`> | ((params: Params) => string) | (() => T);
}

const createEndpoint = <T extends string>(path: T): Endpoint<T> => {
  const handler = {
    get: (target: never, prop: string) => {
      if (prop === "toString") return () => path;
      
      if (prop === "query") return (params: Params) => {
        const query = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined) query.append(key, value.toString());
        }
        return `${path}?${query}`;
      };

      return createEndpoint(`${path}/${prop}`);
    }
  };

  return new Proxy({} as Endpoint<T>, handler);
};

// Implementation of the API endpoints
export const api = createEndpoint("/api") as Endpoint<"/api"> & {
  qrcodes: Endpoint<"/api/qrcodes"> & {
    find: Endpoint<"/api/qrcodes/find">;
    findAll: Endpoint<"/api/qrcodes/findAll">;
    create: Endpoint<"/api/qrcodes/create">;
    update: Endpoint<"/api/qrcodes/update">;
    delete: Endpoint<"/api/qrcodes/delete">;
    scan: Endpoint<"/api/qrcodes/scan">;
  };
  auth: Endpoint<"/api/auth"> & {
    register: Endpoint<"/api/auth/register"> & {
      confirm: Endpoint<"/api/auth/register/confirm">;
    };
    login: Endpoint<"/api/auth/login">;
    logout: Endpoint<"/api/auth/logout">;
    forgotPassword: Endpoint<"/api/auth/forgotPassword"> & {
      sendEmail: Endpoint<"/api/auth/forgotPassword/sendEmail">;
      reset: Endpoint<"/api/auth/forgotPassword/reset">;
    };
  };
  users: Endpoint<"/api/users"> & {
    current: Endpoint<"/api/users/current">;
  };
};