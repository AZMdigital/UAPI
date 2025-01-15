import { Fragment } from "react";

import Services from "~/modules/services";

import { AppHead } from "~/core/components/Apphead";
import MainLayout from "~/core/components/Layouts/Mainlayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const ServicesPage: NextApplicationPage = () => {
  return (
    <Fragment>
      <AppHead title={labels.services} />
      <MainLayout>
        <Services />
      </MainLayout>
    </Fragment>
  );
};

export default ServicesPage;
ServicesPage.requireAuth = true;
