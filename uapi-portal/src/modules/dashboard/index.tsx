/* eslint-disable @typescript-eslint/naming-convention */
"use client";
import { Fragment, useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  useGetInvoicesByStatus,
  useGetServicesCountByUser,
  useGetTopConsumedServices,
} from "~/rest/apiHooks/dashboard/useDashboard";

import DashboardCard from "~/modules/dashboard/components/DashboardCard";
import {
  barChartOptions,
  doughnetChartOptions,
  getComsumedServicesData,
  getInvoicesDataByStatus,
  pieLabelsLine,
} from "~/modules/dashboard/utils/helper";
import { labels } from "~/modules/dashboard/utils/labels";

// import "chartjs-plugin-piechart-outlabels";

export default function Dashboard() {
  ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ChartDataLabels
  );

  const { data: servicesCountData, isLoading: isLoadingServicesCount } =
    useGetServicesCountByUser();
  const {
    data: consumedServicesData,
    isLoading: isLoadingConsumedServicesData,
  } = useGetTopConsumedServices();
  const { data: invoicesByStatusData, isLoading: isLoadingInvoicesByStatus } =
    useGetInvoicesByStatus();

  const [subscibedServices, setSubscibedServices] = useState(0);
  const [unSubscibedServices, setUnSubscibedServices] = useState(0);
  const [invoiceDataByStatus, setInvoiceDataByStatus] = useState<any[]>([]);
  const [consumedServices, setConsumedServices] = useState<any[]>([]);

  useEffect(() => {
    if (servicesCountData) {
      setSubscibedServices(servicesCountData.subscribedServicesCount);
      setUnSubscibedServices(servicesCountData.unsubscribedServicesCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicesCountData]);

  useEffect(() => {
    if (consumedServicesData) {
      setConsumedServices(getComsumedServicesData(consumedServicesData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consumedServicesData]);

  useEffect(() => {
    if (invoicesByStatusData) {
      setInvoiceDataByStatus(getInvoicesDataByStatus(invoicesByStatusData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoicesByStatusData]);

  const getConsumedServicesData = {
    labels: consumedServices.map((item) => item.label),
    datasets: [
      {
        data: consumedServices.map((item) => Math.round(item.value)),
        backgroundColor: consumedServices.map((item) => item.color),
        borderColor: consumedServices.map((item) => item.color),
        borderWidth: 1,
        dataVisibility: new Array(consumedServices.length).fill(true),
      },
    ],
  };

  const getInvoiceDataByStatus = {
    labels: invoiceDataByStatus.map((item) => item.label),
    datasets: [
      {
        data: invoiceDataByStatus.map((item) => Math.round(item.value)),
        backgroundColor: invoiceDataByStatus.map((item) => item.color),
        borderColor: invoiceDataByStatus.map((item) => item.color),
        dataVisibility: new Array(invoiceDataByStatus.length).fill(true),
        borderWidth: 1,
        borderJoinStyle: "round" as const,
      },
    ],
  };

  return (
    <Fragment>
      {isLoadingServicesCount ||
      isLoadingConsumedServicesData ||
      isLoadingInvoicesByStatus ? (
        <Box
          height="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress size={40} />
        </Box>
      ) : (
        <Fragment>
          <Typography
            paddingY={2}
            fontWeight={700}
            fontSize={20}
            color="primary"
            fontFamily="SegoeUI"
            lineHeight="18.88px"
          >
            {labels.dashboard}
          </Typography>
          <Grid
            container
            justifyContent="center"
            direction="row"
            rowGap={3}
            marginTop={1}
          >
            <DashboardCard
              label={labels.numberOfSubscribeServices}
              value={subscibedServices}
            />

            <DashboardCard
              label={labels.numberOfAvailableServices}
              value={unSubscibedServices}
            />

            <Grid item sm={12} lg={4} paddingX={2}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 4,
                  borderColor: "white",
                  height: 180,
                }}
              >
                <CardContent>
                  <Typography
                    color="primary.blackishGray"
                    sx={{
                      paddingLeft: 1,
                      paddingBottom: 2,
                      fontSize: "1.1rem",
                    }}
                  >
                    {labels.accountsPerInvoiceStatus}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      height: "110px",
                    }}
                  >
                    <Doughnut
                      data={getInvoiceDataByStatus}
                      options={doughnetChartOptions}
                      plugins={[pieLabelsLine]}
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container marginTop={4} paddingX={2}>
            <Grid item sm={12} lg={12}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 4,
                  borderColor: "white",
                  height: 400,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h1"
                    color="black"
                    sx={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      paddingBottom: 3,
                    }}
                  >
                    {labels.serviceConsumption}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      height: "300px",
                    }}
                  >
                    <Bar
                      data={getConsumedServicesData}
                      options={barChartOptions}
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Fragment>
      )}
    </Fragment>
  );
}
