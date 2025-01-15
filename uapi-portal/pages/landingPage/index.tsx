import { Fragment } from "react";

import LandingPage from "~/modules/landingPage";
import LandingPageLayout from "~/modules/landingPage/components/LandingPageLayout.tsx";

import { AppHead } from "~/core/components/Apphead";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const HomeScreen: NextApplicationPage = () => {
  return (
    <Fragment>
      <AppHead title={labels.home} />
      <LandingPageLayout>
        <LandingPage />
      </LandingPageLayout>
    </Fragment>
  );
};

export default HomeScreen;
HomeScreen.requireAuth = false;
