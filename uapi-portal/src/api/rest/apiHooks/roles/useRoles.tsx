import { useMutation, useQuery } from "@tanstack/react-query";

import {
  deleteRole,
  getAllPermissions,
  getAllRoles,
  getPermissionsByRole,
  getRolesWithSearch,
  saveRole,
  updateRole,
} from "~/rest/repositories/roles";

export const useGetRoles = () =>
  useQuery(["getRoles"], () => getAllRoles(), {
    refetchOnWindowFocus: false,
    cacheTime: 0,
    retry: false,
  });

export const useGetRolesWithSearch = () => {
  return useMutation<
    any,
    unknown,
    {
      roleName: string;
    }
  >(["getRolesWithSearch"], ({ roleName }) => {
    return getRolesWithSearch(roleName);
  });
};

export const useGetAllRoles = () => {
  return useMutation<any, unknown, { roleName: string }>(["getRoles"], () => {
    return getAllRoles();
  });
};

export const useGetAllPermissions = () =>
  useQuery(["getAllPermissions"], () => getAllPermissions(), {
    refetchOnWindowFocus: false,
  });

export const usePermissionsByRole = () => {
  return useMutation<any, unknown, { roleId: number }>(
    ["getPermissionByRole"],
    ({ roleId }) => {
      return getPermissionsByRole(roleId);
    }
  );
};

export const useUpdateRole = () => {
  return useMutation<any, unknown, { rolesData: any; id: any }>(
    ["updateRole"],
    ({ rolesData, id }) => {
      const { ...remainingData } = rolesData;
      return updateRole(remainingData, id!);
    }
  );
};

export const useSaveRole = () => {
  return useMutation<any, unknown, { rolesData: any }>(
    ["saveRole"],
    ({ rolesData }) => {
      return saveRole(rolesData);
    }
  );
};

export const useDeleteRole = () => {
  return useMutation<any, unknown, { roleId: number }>(
    ["deleteRole"],
    ({ roleId }) => {
      return deleteRole(roleId);
    }
  );
};
