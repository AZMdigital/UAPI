import { useMutation } from "@tanstack/react-query";

import {
  addUser,
  deleteUser,
  getAllAccountUsers,
  getAllUsers,
  getIsUserExists,
  updateUser,
} from "~/rest/repositories/user";

export const useCreateUser = () => {
  return useMutation<any, unknown, { userData: any }>(
    ["createUser"],
    ({ userData }) => {
      return addUser(userData);
    }
  );
};

export const useUpdateUser = () => {
  return useMutation<any, unknown, { userData: any; id: any }>(
    ["updateUser"],
    ({ userData, id }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { company, ...remainingData } = userData;
      if (remainingData.isSuperAdmin) {
        delete remainingData.roleId;
      }
      delete remainingData.role;
      delete remainingData.isSuperAdmin;
      delete remainingData.updatedAt;
      delete remainingData.isDeleted;
      delete remainingData.deletedAt;
      delete remainingData.createdAt;

      return updateUser(remainingData, id!);
    }
  );
};

export const useGetAllUsers = () => {
  return useMutation<any, unknown, { userName: string }>(
    ["getAllUsers"],
    () => {
      return getAllUsers();
    }
  );
};

export const useGetIsUserExists = () => {
  return useMutation<any, unknown, { query: string }>(
    ["isUserExists"],
    ({ query }) => {
      return getIsUserExists(query);
    }
  );
};

export const useDeleteUser = () => {
  return useMutation<any, unknown, { accountId: number; userId: number }>(
    ["deleteUser"],
    ({ accountId, userId }) => {
      return deleteUser(accountId, userId);
    }
  );
};

export const useGetAllAccountUsersWithPagination = () => {
  return useMutation<
    any,
    unknown,
    {
      query: string;
      pageNumber: number;
      pageSize: number;
    }
  >(["accountUsers"], ({ query, pageNumber, pageSize }) => {
    return getAllAccountUsers(query, pageNumber, pageSize);
  });
};
