import { Fragment } from "react";

import ApiPage from "~/modules/swagger";

import { AppHead } from "~/core/components/Apphead";
import MainLayout from "~/core/components/Layouts/Mainlayout";
import { NextApplicationPage } from "~/core/interfaces/app.interface";
import { labels } from "~/core/utils/labels";

const Swagger: NextApplicationPage = () => {
  return (
    <Fragment>
      <AppHead title={labels.swaggerPage} />
      <MainLayout>
        <ApiPage />
      </MainLayout>
    </Fragment>
  );
};
export default Swagger;
Swagger.requireAuth = true;
