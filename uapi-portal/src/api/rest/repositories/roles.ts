import axiosInstance from "~/config/axiosInstance";

import { ROLES_ENDPOINTS } from "~/rest/endpoints";

export const getAllRoles = async () => {
  const { data: response } = await axiosInstance.get(ROLES_ENDPOINTS.getRoles);
  return response;
};

const getRoleName = (roleName: string) => {
  if (roleName !== "") {
    return `?roleName=${roleName}`;
  } else {
    return "";
  }
};

export const getRolesWithSearch = async (roleName: string) => {
  const finalUrl = ROLES_ENDPOINTS.getRoles + getRoleName(roleName);
  const { data: response } = await axiosInstance.get(finalUrl);
  return response;
};

export const getAllPermissions = async () => {
  const { data: response } = await axiosInstance.get(
    ROLES_ENDPOINTS.getPermissions
  );
  return response;
};

export const getPermissionsByRole = async (id: number) => {
  const { data: response } = await axiosInstance.get(
    `${ROLES_ENDPOINTS.getRoles}/${id}${ROLES_ENDPOINTS.getPermissions}`
  );
  return response;
};

export const deleteRole = async (id: number) => {
  const { data: response } = await axiosInstance.delete(
    `${ROLES_ENDPOINTS.getRoles}/${id}`
  );
  return response;
};

export const saveRole = async (body: any) => {
  const { data: response } = await axiosInstance.post(
    ROLES_ENDPOINTS.getRoles,
    body
  );
  return response;
};

export const updateRole = async (body: any, id: number) => {
  const { data: response } = await axiosInstance.put(
    `${ROLES_ENDPOINTS.getRoles}/${id}`,
    body
  );
  return response;
};
