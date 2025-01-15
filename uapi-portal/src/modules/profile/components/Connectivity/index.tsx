/* eslint-disable array-callback-return */
import { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

import { useAppSelector } from "~/state/hooks";

import { useGetServices } from "~/rest/apiHooks";
import { useGetCompanyServices } from "~/rest/apiHooks/companies/useCompanies";
import { ServiceCategory } from "~/rest/models/service";

import DisplayNote from "~/modules/profile/components/DisplayNote";
import ServiceAuthForm from "~/modules/profile/components/ServiceAuthForm";
import ServiceProviderNestedList from "~/modules/profile/components/ServiceProviderNestedList";
import {
  CredentailsMode,
  ServiceGroupType,
} from "~/modules/profile/utils/helper";
import {
  categorizeServicesByServiceProvider,
  filteredCompanyService,
  getServiceGroups,
} from "~/modules/services/utils/helper";
import { labels } from "~/modules/services/utils/labels";

import LoadingView from "~/core/components/LoadingView";
import PageNotFound from "~/core/components/PageNotFound";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";

export default function Connectivity() {
  const user = useAppSelector((state) => state.core.userInfo);

  const { data, isLoading, error, isError } = useGetServices();
  const {
    mutateAsync: getCompanyServiceList,
    data: companyServiceData,
    isLoading: isCompanyServiceDataLoading,
  } = useGetCompanyServices();
  const [servicesData, setServicesData] = useState<ServiceCategory[]>([]);
  const [serviceGroup, setServiceGroup] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>();

  const [isEmptyView, setEmptyView] = useState(false);
  const [isServicesLoading, setServicesLoading] = useState(false);
  const [isShowUnAuthView, setShowUnAuthView] = useState(false);

  useEffect(() => {
    if (isLoading || isCompanyServiceDataLoading) {
      setServicesLoading(true);
    } else {
      setServicesLoading(false);
    }
  }, [isCompanyServiceDataLoading, isLoading]);

  useEffect(() => {
    if (data) {
      getCompanyServiceList({ companyId: user?.company.id as number });
      setShowUnAuthView(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (isError) {
      const errorObj: any = error;
      const status =
        errorObj?.error?.response?.status || errorObj?.response?.status;
      if (status === 403) {
        setShowUnAuthView(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isError]);

  useEffect(() => {
    if (companyServiceData) {
      const filteredCompanyData = filteredCompanyService(
        companyServiceData,
        data
      );
      const categorizedData =
        categorizeServicesByServiceProvider(filteredCompanyData);
      if (categorizedData.length > 0) {
        // Save Categorized Data
        setServicesData(categorizedData);

        // Create service groups for side bar
        const newgroups = getServiceGroups(categorizedData);
        if (newgroups.length > 0) {
          // Save service groups
          setServiceGroup(newgroups);

          // Auto select the first index of service groups
          setSelectedItem(newgroups[0]);
        } else {
          // if no group shows then show empty view
          setEmptyView(true);
        }
      } else {
        // if no service data then show empty view
        setEmptyView(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyServiceData]);

  const getServiceProviderView = (item: ServiceCategory) => {
    if (item.serviceProvider.requiresServiceHeadCredentials) {
      return (
        <DisplayNote
          title={labels.noteTitle}
          message={labels.credentialOnHeadLevel}
        />
      );
    } else {
      return (
        <Grid item minWidth={360} key={item.name}>
          <ServiceAuthForm
            serviceProvider={item.serviceProvider}
            credentailsMode={CredentailsMode.SERVICEPROVIDER}
            serviceHeadId={0}
          />
        </Grid>
      );
    }
  };

  const getServiceHeadView = (item: ServiceCategory) => {
    if (item.serviceProvider.requiresServiceHeadCredentials) {
      return (
        <Grid item minWidth={360} key={item.name}>
          <ServiceAuthForm
            serviceProvider={item.serviceProvider}
            credentailsMode={CredentailsMode.SERVICEHEAD}
            serviceHeadId={selectedItem.id}
          />
        </Grid>
      );
    } else {
      return (
        <DisplayNote
          title={labels.noteTitle}
          message={labels.credentialOnProviderLevel}
        />
      );
    }
  };

  return (
    <Fragment>
      {isServicesLoading ? (
        <LoadingView height="70vh" />
      ) : (
        <Fragment>
          {isShowUnAuthView ? (
            <UnAuthorizeView />
          ) : (
            <Stack direction="row">
              {serviceGroup.length > 0 && (
                <Box marginRight="41px">
                  <ServiceProviderNestedList
                    ServiceProviderGroupList={serviceGroup}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                  />
                </Box>
              )}
              {servicesData.length > 0 &&
                serviceGroup.length > 0 &&
                selectedItem && (
                  <Grid
                    container
                    spacing={2}
                    maxHeight="70vh"
                    overflow="auto"
                    columns={12}
                  >
                    {servicesData.map((item) => {
                      if (
                        item.name.toLowerCase() ===
                        selectedItem.parent?.toLowerCase()
                      ) {
                        return (
                          <Fragment key={item.serviceProvider.id}>
                            {selectedItem.type ===
                            ServiceGroupType.SERVICE_PROVIDER
                              ? getServiceProviderView(item)
                              : getServiceHeadView(item)}
                          </Fragment>
                        );
                      }
                    })}
                  </Grid>
                )}
              {isEmptyView && (
                <PageNotFound pageNotFoundText={labels.noServiceData} />
              )}
            </Stack>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
