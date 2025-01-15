/* eslint-disable array-callback-return */
import { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppSelector } from "~/state/hooks";

import { useGetServices } from "~/rest/apiHooks";
import { useGetCompanyServices } from "~/rest/apiHooks/companies/useCompanies";
import { useGetServiceIcon } from "~/rest/apiHooks/services/useService";
import { ServiceCategory, ServiceType } from "~/rest/models/service";

import ServiceCard from "~/modules/services/components/ServiceCard";
import {
  categorizeServices,
  filteredCompanyService,
} from "~/modules/services/utils/helper";
import { labels } from "~/modules/services/utils/labels";

import LoadingView from "~/core/components/LoadingView";
import PageNotFound from "~/core/components/PageNotFound";
import SidebarList from "~/core/components/SidebarList";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";

const Services = () => {
  const user = useAppSelector((state) => state.core.userInfo);
  const { data, isLoading, error, isError } = useGetServices();
  const { mutateAsync: getServiceIcon } = useGetServiceIcon();
  const {
    mutateAsync: getCompanyServiceList,
    data: companyServiceData,
    isLoading: isCompanyServiceDataLoading,
  } = useGetCompanyServices();
  const [isShowUnAuthView, setShowUnAuthView] = useState(false);
  const [list, setList] = useState<string[]>([]);
  const [shouldTriggerRefetch, setTriggerRefetch] = useState(false);
  const [isEmptyView, setEmptyView] = useState(false);
  const [isServicesLoading, setServicesLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [servicesData, setServicesData] = useState<ServiceCategory[]>([]);
  const [isLoadingIcons, setLoadingIcons] = useState<boolean>(true); // Loader state for icons

  const fetchIconsForServices = async (services: any[]) => {
    const updatedServices = await Promise.all(
      services.map(async (service) => {
        try {
          const data = await getServiceIcon({ serviceHeadId: service.id });
          return { ...service, icon: data?.icon || null }; // If no icon, fallback to null
        } catch (error) {
          console.error(
            `Failed to fetch icon for service ID ${service.id}`,
            error
          );
          return { ...service, icon: null }; // If there's an error, fallback to null
        }
      })
    );
    setLoadingIcons(false); // Set loading state to false after fetching
    const categorizedData = categorizeServices(updatedServices);
    setServicesData(categorizedData);
  };

  const alteredCompanyServicesData = (companyServiceData: any) => {
    return companyServiceData?.map((item: any) => {
      return {
        ...item,
        subscribed: item.subscribed,
      };
    });
  };

  useEffect(() => {
    if (data) {
      setShowUnAuthView(false);
      getCompanyServiceList(
        { companyId: user?.company.id as number },
        {
          onError: (error: any) => {
            const status =
              error?.error?.response?.status || error?.response?.status;
            if (status === 403) {
              setShowUnAuthView(true);
            } else if (status === 400) {
              setEmptyView(true);
            }
          },
        }
      );
    }

    if (isError) {
      const errorObj: any = error;
      const status =
        errorObj?.error?.response?.status || errorObj?.response?.status;

      if (status === 403) {
        setShowUnAuthView(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, shouldTriggerRefetch]);

  useEffect(() => {
    if (isLoading || isCompanyServiceDataLoading) {
      setServicesLoading(true);
    } else {
      setServicesLoading(false);
    }
  }, [isCompanyServiceDataLoading, isLoading]);

  useEffect(() => {
    if (companyServiceData) {
      setEmptyView(false);
      const filteredCompanyData = filteredCompanyService(
        alteredCompanyServicesData(companyServiceData),
        data
      );

      const categorizedData = categorizeServices(filteredCompanyData);
      if (categorizedData.length > 0) {
        setServicesData(categorizedData);
      } else {
        setEmptyView(true);
      }
      const sortedOriginalServiceHeads = categorizedData.sort(
        (var1, var2) =>
          var1.originalServiceHead.sortedServiceHeadId -
          var2.originalServiceHead.sortedServiceHeadId
      );

      const groups = sortedOriginalServiceHeads.map((item) => item.name);

      setSelectedItem(groups[0]);
      setList([...groups]);

      // Fetch icons after all other data has loaded
      fetchIconsForServices(filteredCompanyData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyServiceData, data]);

  return (
    <Box display="flex" flexDirection="column">
      <Box
        width="100%"
        height={243}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ backgroundColor: "primary.main", top: 0 }}
      >
        <Typography
          fontSize={32}
          fontWeight={700}
          fontFamily="SegoeUI"
          fontStyle="normal"
          lineHeight="normal"
          color="primary.typoWhite"
          textAlign="center"
          width={654}
          height={78}
          textOverflow="clip"
        >
          {`${labels.all} `}
          <span style={{ color: "rgba(0, 186, 190, 1)" }}>
            {labels.integrationService}
          </span>
          {` ${labels.servicesTopText}`}
        </Typography>
        <Typography
          marginTop="30px"
          variant="subtitle1"
          color="rgba(255, 255, 255, 1)"
          fontFamily="SegoeUI"
        >
          {labels.serviceSmallText}
        </Typography>
      </Box>
      {isServicesLoading ? (
        <LoadingView height="100vh" />
      ) : (
        <Fragment>
          {isShowUnAuthView ? (
            <Box
              display="flex"
              width="100%"
              height="80vh"
              alignItems="center"
              justifyContent="center"
            >
              <UnAuthorizeView />
            </Box>
          ) : (
            <Stack direction="row" margin="30px">
              {list.length > 0 && (
                <Box marginRight="41px" marginTop="43px">
                  <SidebarList
                    list={list}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    showSearchbar
                  />
                </Box>
              )}

              <Fragment>
                <Grid container spacing={2} overflow="auto" direction="column">
                  {servicesData.some(
                    (item) =>
                      item.name === selectedItem &&
                      item.collection.some(
                        (service: ServiceType) => service.subscribed
                      )
                  ) && (
                    <>
                      <Typography
                        variant="h1"
                        textAlign="center"
                        marginBottom={1}
                      >
                        {labels.subscribedServices}
                      </Typography>
                      <Divider />
                    </>
                  )}
                  <Grid container spacing={2} maxHeight="70vh" overflow="auto">
                    {servicesData.map((item) => {
                      if (item.name === selectedItem) {
                        return item.collection
                          .filter((service: ServiceType) => service.subscribed)
                          .map((service: ServiceType) => (
                            <Grid
                              item
                              xl={3}
                              lg={4}
                              md={6}
                              sm={12}
                              xs={12}
                              key={service.id}
                              marginTop={1}
                            >
                              <ServiceCard
                                heading={service.name}
                                description={service.originalServiceHead.name}
                                buttonText={labels.cardBtnText}
                                variant="contained"
                                serviceGroup={service.serviceProvider.name}
                                footerText={service.originalServiceHead.name}
                                path={service.swaggerPath}
                                serviceOperations={service.services}
                                logo={service.icon}
                                logoName={service.iconName}
                                subscribed={service.subscribed}
                                serviceHeadId={service.serviceHeadId}
                                logoLoading={isLoadingIcons}
                              />
                            </Grid>
                          ));
                      }
                    })}
                  </Grid>
                  {servicesData.some(
                    (item) =>
                      item.name === selectedItem &&
                      item.collection.some(
                        (service: ServiceType) => !service.subscribed
                      )
                  ) && (
                    <>
                      <Typography
                        variant="h1"
                        textAlign="center"
                        marginBottom={1}
                        marginTop={2}
                      >
                        {labels.unsubscribedServices}
                      </Typography>
                      <Divider />
                    </>
                  )}
                  <Grid container spacing={2} maxHeight="70vh" overflow="auto">
                    {servicesData.map((item) => {
                      if (item.name === selectedItem) {
                        return item.collection
                          .filter(
                            (service: ServiceType) =>
                              service.subscribed === false
                          )
                          .map((service: ServiceType) => (
                            <Grid
                              item
                              xl={3}
                              lg={4}
                              md={6}
                              sm={12}
                              xs={12}
                              key={service.id}
                              marginTop={1}
                            >
                              <ServiceCard
                                heading={service.name}
                                description={service.originalServiceHead.name}
                                buttonText={labels.cardBtnText}
                                variant="contained"
                                serviceGroup={service.serviceProvider.name}
                                footerText={service.originalServiceHead.name}
                                path={service.swaggerPath}
                                serviceOperations={service.services}
                                logo={service.icon}
                                logoName={service.iconName}
                                subscribed={service.subscribed}
                                serviceHeadId={service.serviceHeadId}
                                setTriggerRefetch={setTriggerRefetch}
                                logoLoading={isLoadingIcons}
                              />
                            </Grid>
                          ));
                      }
                    })}
                  </Grid>
                </Grid>
              </Fragment>
            </Stack>
          )}
          {isEmptyView && (
            <PageNotFound pageNotFoundText={labels.noServiceData} />
          )}
        </Fragment>
      )}
    </Box>
  );
};
export default Services;
