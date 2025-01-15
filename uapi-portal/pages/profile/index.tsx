import { Fragment } from "react";

import { NextApplicationPage } from "~/modules/_core/interfaces/app.interface";
import Profile from "~/modules/profile";

import { AppHead } from "~/core/components/Apphead";
import Mainlayout from "~/core/components/Layouts/Mainlayout";
import { labels } from "~/core/utils/labels";

const ProfilePage: NextApplicationPage = () => {
  return (
    <Fragment>
      <AppHead title={labels.profile} />
      <Mainlayout>
        <Profile />
      </Mainlayout>
    </Fragment>
  );
};
export default ProfilePage;
ProfilePage.requireAuth = true;
