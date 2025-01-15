import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAppDispatch, useAppSelector } from "~/state/hooks";

import { paths } from "~/core/utils/helper";

export const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.core.token);
  useEffect(() => {
    if (!token) {
      router.push(paths.loginPage);
    }
  }, [token, dispatch, router]);

  // if auth initialized with a valid user show protected page
  if (token) {
    return <>{children}</>;
  }

  /* otherwise don't return anything, will do a redirect from useEffect */
  return null;
};
