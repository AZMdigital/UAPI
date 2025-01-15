import { Fragment } from "react";

import Home from "~/modules/home";

import { AppHead } from "~/core/components/Apphead";
import Mainlayout from "~/core/components/Layouts/Mainlayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const HomeScreen: NextApplicationPage = () => {
  return (
    <Fragment>
      <AppHead title={labels.home} />
      <Mainlayout>
        <Home />
      </Mainlayout>
    </Fragment>
  );
};

export default HomeScreen;
HomeScreen.requireAuth = true;
