import axiosInstance from "~/config/axiosInstance";

import { USER_ENDPOINTS } from "~/rest/endpoints";

export const addUser = async (body: any) => {
  const { data: response } = await axiosInstance.post(
    USER_ENDPOINTS.users,
    body
  );
  return response;
};

export const updateUser = async (body: any, id: number) => {
  const { data: response } = await axiosInstance.put(
    `${USER_ENDPOINTS.users}/${id}`,
    body
  );
  return response;
};

export const getAllUsers = async () => {
  const { data: response } = await axiosInstance.get(
    `${USER_ENDPOINTS.users}?pageNumber=1&pageSize=9999`
  );
  return response.users;
};

export const getIsUserExists = async (queryStr: string) => {
  const { data: response } = await axiosInstance.get(
    `${USER_ENDPOINTS.users}${USER_ENDPOINTS.userExist}?query=${queryStr}`
  );
  return response;
};

export const deleteUser = async (accountId: number, userId: number) => {
  const { data: response } = await axiosInstance.delete(
    `${USER_ENDPOINTS.users}${USER_ENDPOINTS.account}/${accountId}/user/${userId}`
  );
  return response;
};

export const searchUser = async (query: string) => {
  const { data: response } = await axiosInstance.get(
    `${USER_ENDPOINTS.users}?query=${query}`
  );
  return response;
};

const getUserQuery = (queryStr: string) => {
  if (queryStr !== "") {
    return `&query=${queryStr}`;
  } else {
    return "";
  }
};

export const getAllAccountUsers = async (
  query: string,
  pageNumber: number,
  pageSize: number
) => {
  let alteredPageNumber = pageNumber;
  if (pageNumber === 0) {
    alteredPageNumber = 1;
  } else {
    ++alteredPageNumber;
  }

  const baseUrl = `${USER_ENDPOINTS.users}?pageNumber=${alteredPageNumber}&pageSize=${pageSize}`;
  const completeUrl = baseUrl + getUserQuery(query);
  const { data: response } = await axiosInstance.get(completeUrl);
  return response;
};
