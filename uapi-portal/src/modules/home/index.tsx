import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useAppSelector } from "~/state/hooks";

import LoadingView from "~/core/components/LoadingView";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";
import {
  getSideMenuOptionByRole,
  MenuConfig,
  NavMenuItem,
} from "~/core/utils/helper";

const Home = () => {
  const router = useRouter();
  const { navItems } = new MenuConfig();
  const [isShowUnAuthView, setShowUnAuthView] = useState(false);
  const user = useAppSelector((state) => state.core.userInfo);
  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );

  useEffect(() => {
    if (userPermissions && user) {
      // Get the first item from the NavMenuItem list.
      const currentView: NavMenuItem[] = getSideMenuOptionByRole(
        navItems,
        userPermissions,
        user.isSuperAdmin,
        user.company.accountType,
        user.company.useMainAccountBundles
      );
      if (currentView.length > 0) {
        router.replace(currentView?.[0].page);
      } else {
        setShowUnAuthView(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userPermissions]);

  return (
    <Fragment>
      {isShowUnAuthView ? (
        <UnAuthorizeView hideHomeBtn />
      ) : (
        <LoadingView height="100vh" />
      )}
    </Fragment>
  );
};

export default Home;
