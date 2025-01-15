/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
import { ComponentType, useEffect } from "react";
import { useRouter } from "next/router";

import { useAppSelector } from "~/state/hooks";

import { checkPermission, paths } from "~/core/utils/helper";

const isAdminRoute = (
  Component: ComponentType<any>,
  permissionHandle: string
): ComponentType<any> => {
  return (props) => {
    const user = useAppSelector((state) => state.core.userInfo);
    const userPermissions = useAppSelector(
      (state) => state.core.userRolePermissions
    );
    const router = useRouter();
    const isAuthorized = checkPermission(permissionHandle, userPermissions);
    useEffect(() => {
      if (user?.isSuperAdmin === false && !isAuthorized) {
        // Redirect to home page or login page if not admin
        router.push(paths.unAuthPage);
      }
    }, [router]);
    // Render the component if the user is an admin
    // return isAuthorized ? <Component {...props} /> : null;
    return <Component {...props} />;
  };
};

export default isAdminRoute;
