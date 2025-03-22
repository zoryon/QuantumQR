import { ApiDefinition } from "@/types";

export const API_CONFIG = {
  qrcodes: {
    find: { method: "GET" },
    findAll: { method: "GET" },
    create: { method: "POST" },
    delete: { method: "DELETE" },
    scan: { method: "POST" },
    update: { method: "PUT" },
  },
  auth: {
    register: {
      confirm: { method: "POST" },
    },
    login: { method: "POST" },
    forgotPassword: {
      reset: { method: "POST" },
      sendEmail: { method: "POST" },
    },
  },
  policies: { method: "GET" },
} satisfies ApiDefinition;