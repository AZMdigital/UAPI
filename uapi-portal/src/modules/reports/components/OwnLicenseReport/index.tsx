import { Fragment, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";

import { handleErroMessage } from "~/utils/helper";
import { PERMISSION_CONSUMPTION_EXPORT } from "~/utils/permissionsConstants";

import { useAppSelector } from "~/state/hooks";

import { useConsumptionDetailOwnCredentails } from "~/rest/apiHooks/reports/useReports";
import { ConsumptionAccountType } from "~/rest/models/reports";

import { createConsumptionDetailExeclReport } from "~/modules/reports/utils/excelReportHelper";
import {
  consumptionDetailColumns,
  getSumOfAllValues,
} from "~/modules/reports/utils/helper";
import { labels } from "~/modules/reports/utils/labels";
import { createConsumptionDetailReport } from "~/modules/reports/utils/pdfHelper";

import FormLoadingButton from "~/core/components/Buttons/FormLoadingButton";
import DateTextFieldController from "~/core/components/FormComponents/DateTextFieldComponent";
import ContainerLayout from "~/core/components/Layouts/ContainerLayout";
import TableComponent from "~/core/components/Table";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";

const OwnLicenseReport = () => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF("p", "mm", "a4");
  const methods = useForm({
    defaultValues: {
      month: "", // dayjs().format?.("MM"),
      year: "", // dayjs().format?.("YYYY"),
    },
    reValidateMode: "onBlur",
    mode: "onBlur",
    criteriaMode: "all",
  });
  //  const consumptionReportTitle = "Consumption Details (My Own License) of ";
  const [isShowUnAuthView, setShowUnAuthView] = useState(false);
  const user = useAppSelector((state) => state.core.userInfo);
  const { watch, setValue } = methods;
  const currentMonth = watch("month");
  const currentYear = watch("year");
  const [consumptionData, setConsumptionData] = useState([]);
  const [successTransactionCount, setSuccessTransactionCount] = useState(0);
  const [failureTransactionCount, setFailureTransactionCount] = useState(0);
  const [totalTransactionCount, setTotalTransactionCount] = useState(0);
  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );

  const userPermissionsStrings: string[] = userPermissions.map(
    (permission) => permission as unknown as string
  );

  const hasExportPermission: boolean = userPermissionsStrings.includes(
    PERMISSION_CONSUMPTION_EXPORT
  );

  const isSuperAdmin: any = user?.isSuperAdmin;
  const { data, isLoading, error, isError } =
    useConsumptionDetailOwnCredentails(currentMonth, currentYear, {
      enabled: true,
    });

  useEffect(() => {
    if (data) {
      const updatedData = data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
      }));

      // SuccessTransactionCount
      setSuccessTransactionCount(
        getSumOfAllValues("successTransaction", updatedData)
      );
      // failureTransactionCount
      setFailureTransactionCount(
        getSumOfAllValues("failedTransactions", updatedData)
      );
      // totalTransactionCount
      setTotalTransactionCount(
        getSumOfAllValues("totalTransactions", updatedData)
      );

      setConsumptionData(updatedData);
      setShowUnAuthView(false);
    }
    if (isError) {
      setConsumptionData([]);
      const errorObj: any = error;
      const status =
        errorObj?.error?.response?.status || errorObj?.response?.status;
      if (status === 403) {
        setShowUnAuthView(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isError]);

  useEffect(() => {
    if (currentMonth && (!currentYear || currentYear === "")) {
      setConsumptionData([]);
      handleErroMessage(labels.pleaseSelectYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, currentYear]);

  useEffect(() => {
    if (data) {
      const updatedData = data.map((item: any, index: number) => ({
        ...item,
        id: index + 1,
      }));
      setConsumptionData(updatedData);
    }
  }, [data]);

  const downloadPdfReport = () => {
    // Add the summary footer row
    const accountConsumptionData: ConsumptionAccountType[] = Object.assign(
      [],
      consumptionData
    );

    const summaryRow = {} as ConsumptionAccountType;
    summaryRow.serviceCode = "";
    summaryRow.serviceName = labels.total;
    summaryRow.successTransaction = successTransactionCount;
    summaryRow.failedTransactions = failureTransactionCount;
    summaryRow.totalTransactions = totalTransactionCount;
    summaryRow.totalAmount = 0;
    accountConsumptionData.push(summaryRow);

    createConsumptionDetailReport(
      doc,
      accountConsumptionData,
      user?.company.companyName || "",
      labels.consumptionReportTitleForOwnCredentails
    );
  };

  const downloadExcelReport = () => {
    // Add the summary footer row
    const accountConsumptionData: ConsumptionAccountType[] = Object.assign(
      [],
      consumptionData
    );

    const summaryRow = {} as ConsumptionAccountType;
    summaryRow.serviceCode = "";
    summaryRow.serviceName = labels.total;
    summaryRow.successTransaction = successTransactionCount;
    summaryRow.failedTransactions = failureTransactionCount;
    summaryRow.totalTransactions = totalTransactionCount;
    summaryRow.totalAmount = 0;
    summaryRow.dueMonth = -1;
    accountConsumptionData.push(summaryRow);

    createConsumptionDetailExeclReport(
      accountConsumptionData,
      user?.company.companyName || "",
      labels.consumptionReportTitleForOwnCredentails
    );
  };

  const footerSummary = () => {
    return (
      <Fragment>
        <Divider />
        {consumptionData.length > 0 && (
          <Grid
            container
            xs={12}
            paddingX={1.2}
            height={45}
            alignItems="center"
            sx={{ backgroundColor: "primary.greyFooterBackground" }}
          >
            <Grid item xs={2.4}>
              <Typography variant="h2" display="inline">
                {labels.total}
              </Typography>
            </Grid>
            <Grid item xs={2.4} paddingLeft={0.5}>
              <Typography variant="h2" display="inline">
                {successTransactionCount}
              </Typography>
            </Grid>
            <Grid item xs={2.4} paddingLeft={1}>
              <Typography variant="h2" display="inline">
                {failureTransactionCount}
              </Typography>
            </Grid>
            <Grid item xs={2.4} paddingLeft={1.5}>
              <Typography variant="h2" display="inline">
                {totalTransactionCount}
              </Typography>
            </Grid>
            <Grid item xs={2.4} paddingLeft={2}>
              <Typography variant="h2" display="inline" />
            </Grid>
          </Grid>
        )}
      </Fragment>
    );
  };

  const setMonthYear = (yearValue: any) => {
    if (currentMonth !== null && currentMonth !== "" && yearValue !== null) {
      let updatedDate = dayjs(yearValue);
      updatedDate = updatedDate.set("month", dayjs(currentMonth).month());
      setValue("month", updatedDate as any);
    }
  };

  return (
    <Fragment>
      {isShowUnAuthView ? (
        <UnAuthorizeView hideHomeBtn />
      ) : (
        <Fragment>
          <FormProvider {...methods}>
            <ContainerLayout breadCrumbs={[labels.consumptionDetailOwnLicense]}>
              <Grid
                container
                item
                direction="row"
                xs={12}
                justifyContent="space-between"
              >
                <Grid columnGap={2} item container direction="row" xs={8}>
                  <Grid item xs={4}>
                    <DateTextFieldController
                      key="month"
                      controllerName="month"
                      label=""
                      isDisabled={false}
                      errorMessage=""
                      isRequired={false}
                      showHeading
                      headingText={labels.searchByMonth}
                      dateFormat="MMM"
                      dateViews={["month"]}
                      placeHolderText={labels.searchByMonth}
                      showToolTip
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <DateTextFieldController
                      key="year"
                      controllerName="year"
                      label="year"
                      isDisabled={false}
                      errorMessage=""
                      isRequired={false}
                      showHeading
                      headingText={labels.searchByYear}
                      dateFormat="YYYY"
                      dateViews={["year"]}
                      handleChange={setMonthYear}
                      placeHolderText={labels.searchByYear}
                      showToolTip
                    />
                  </Grid>
                </Grid>
                <Grid item display="flex" alignItems="end">
                  {(isSuperAdmin || hasExportPermission) && (
                    <Grid item container columnGap={2} justifyContent="right">
                      <FormLoadingButton
                        buttonVariant="contained"
                        isLoading={false}
                        id="exportPDF"
                        disabled={consumptionData.length === 0}
                        backgroundColor="primary.green"
                        onClickEvent={downloadPdfReport}
                      >
                        {labels.download}
                      </FormLoadingButton>
                      <FormLoadingButton
                        buttonVariant="contained"
                        isLoading={false}
                        id="exportExcel"
                        disabled={consumptionData.length === 0}
                        backgroundColor="primary.green"
                        onClickEvent={downloadExcelReport}
                      >
                        {labels.excelText}
                      </FormLoadingButton>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} marginBottom={30}>
                <TableComponent
                  columnHeaderHeight={48}
                  columns={consumptionDetailColumns}
                  rows={consumptionData}
                  loading={isLoading}
                  deleting={false}
                  showFooterRow
                  footerView={footerSummary()}
                />
              </Grid>
            </ContainerLayout>
          </FormProvider>
        </Fragment>
      )}
    </Fragment>
  );
};
export default OwnLicenseReport;
