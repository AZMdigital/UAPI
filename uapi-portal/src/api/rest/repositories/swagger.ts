import { swaggerAxioInstance } from "~/config/axiosInstance";

export const getSwaggerData = async (path: string) => {
  const { data: response } = await swaggerAxioInstance.get(path);
  return response;
};
