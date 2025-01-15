import { useQuery } from "@tanstack/react-query";

import { getSwaggerData } from "~/rest/repositories/swagger";

export const useGetSwaggerData = (pathUrl: string) =>
  useQuery(["swaggerData", pathUrl], () => getSwaggerData(pathUrl));
