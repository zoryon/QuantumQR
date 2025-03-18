type Params = Record<string, string | number | undefined>;

interface EndpointBuilder {
  // Converte l'endpoint in stringa
  toString: () => string;
  // Genera una query string a partire da un oggetto di parametri
  query: (params: Params) => string;
}

const createEndpointBuilder = (base: string = ""): EndpointBuilder => {
  return new Proxy(
    {},
    {
      get(_target, prop: string) {
        // Se si richiede la funzione toString, restituisci il path corrente
        if (prop === "toString") {
          return () => base;
        }
        // Se si richiede query, restituisci una funzione che costruisce la query string
        if (prop === "query") {
          return (params: Params) => {
            const qs = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
              if (value !== undefined) qs.append(key, value.toString());
            });
            return qs.toString();
          };
        }
        // Altrimenti, concatena il segmento richiesto e ritorna un nuovo builder
        return createEndpointBuilder(`${base}/${prop}`);
      },
    }
  ) as EndpointBuilder;
};

// Esportiamo l'API root con base "/api"
export const api = createEndpointBuilder("/api");
