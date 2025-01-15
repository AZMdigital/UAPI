import { Fragment, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "dayjs";
import jsPDF from "jspdf";

import { PERMISSION_LOGS_EXPORT } from "~/utils/permissionsConstants";

import { useAppSelector } from "~/state/hooks";

import { useGetCompanyServices } from "~/rest/apiHooks/companies/useCompanies";
import { useGetIntegrationLogs } from "~/rest/apiHooks/reports/useReports";

import { createLogsExcelReport } from "~/modules/invoiceManagement/utils/excelReportHelper";
import LogsDetail from "~/modules/reports/components/LogsDetail";
import {
  addNoneOption,
  logsColumns,
  transactionStatus,
} from "~/modules/reports/utils/helper";
import { labels } from "~/modules/reports/utils/labels";
import { createLogsReport } from "~/modules/reports/utils/pdfHelper";

import FormLoadingButton from "~/core/components/Buttons/FormLoadingButton";
import DateTextFieldController from "~/core/components/FormComponents/DateTextFieldComponent";
import DropDownController from "~/core/components/FormComponents/DropDownComponent";
import ContainerLayout from "~/core/components/Layouts/ContainerLayout";
import LoadingView from "~/core/components/LoadingView";
import { MenuItemStyle } from "~/core/components/style";
import TableComponent from "~/core/components/Table";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";
import { getMomentFormattedDate } from "~/core/utils/helper";

const LogsReports = () => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF("landscape", "mm", "a3");
  const user = useAppSelector((state) => state.core.userInfo);
  const methods = useForm({
    defaultValues: {
      fromDate: "",
      toDate: "",
    },
    reValidateMode: "onBlur",
    mode: "onBlur",
    criteriaMode: "all",
  });
  const { watch } = methods;
  const fromDateStr = watch("fromDate");
  const toDateStr = watch("toDate");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const {
    mutateAsync: getCompanyServiceList,
    data: companyServiceData,
    isLoading: isCompanyServiceDataLoading,
  } = useGetCompanyServices();

  const {
    mutateAsync: getIntegrationLogs,
    data: logsData,
    isLoading: isLogsLoading,
  } = useGetIntegrationLogs();

  const [isShowUnAuthView, setShowUnAuthView] = useState(false);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [serviceNameStr, setServiceName] = useState("");
  const [statusStr, setStatus] = useState("");
  const [logsList, setLogsList] = useState<any[]>([]);
  const [serviceList, setServiceList] = useState<any[]>([]);
  const [selectedLogsData, setSelectedLogData] = useState<any>();
  const [shouldShowLogsDetail, setShowLogsDetail] = useState(false);

  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );

  const userPermissionsStrings: string[] = userPermissions.map(
    (permission) => permission as unknown as string
  );

  const hasExportPermission: boolean = userPermissionsStrings.includes(
    PERMISSION_LOGS_EXPORT
  );

  const isSuperAdmin: any = user?.isSuperAdmin;

  const extractIntegrationLogsObjects: (array: any[]) => any[] = (array) => {
    return array.map((obj) => {
      const mergedObj: any = {
        id: obj.id,
        service: obj.service,
        transactionDate: getMomentFormattedDate(obj.requestTime),
        requestText: JSON.stringify(obj.request),
        responseText: JSON.stringify(obj.response),
        url: obj.url,
      };
      return mergedObj;
    });
  };

  useEffect(() => {
    getCompanyServiceList(
      { companyId: user?.company.id as number },
      {
        onError: (error: any) => {
          const status =
            error?.error?.response?.status || error?.response?.status;
          if (status === 403) {
            setShowUnAuthView(true);
          }
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setShowUnAuthView(false);
    getIntegrationLogs(
      {
        fromDate: fromDateStr,
        toDate: toDateStr,
        companyId: user?.company.id as number,
        serviceName: serviceNameStr,
        callStatus: statusStr,
        pageNumber: paginationModel.page,
        pageSize: paginationModel.pageSize,
      },
      {
        onSuccess: () => {
          setShowUnAuthView(false);
        },
        onError: (error: any) => {
          const status =
            error?.error?.response?.status || error?.response?.status;
          if (status === 403) {
            setShowUnAuthView(true);
          }
        },
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel.page, fromDateStr, toDateStr, serviceNameStr, statusStr]);

  useEffect(() => {
    if (logsData) {
      setTotalRowCount(logsData.count);
      setLogsList(extractIntegrationLogsObjects(logsData.requestLogs));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logsData]);

  useEffect(() => {
    if (companyServiceData) {
      setServiceList(addNoneOption(companyServiceData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyServiceData]);

  const onLogsView = (viewLogs: any) => {
    setSelectedLogData(viewLogs);
    setShowLogsDetail(true);
  };

  const handleLogsDetailAction = (Status: boolean) => {
    setShowLogsDetail(Status);
  };

  const resetPage = () => {
    setPaginationModel({ page: 0, pageSize: 10 });
  };

  const downloadPdfReport = () => {
    createLogsReport(doc, logsList);
  };
  const downloadExcelReport = () => {
    const startIndex = paginationModel.page * paginationModel.pageSize;
    const endIndex = startIndex + paginationModel.pageSize;
    if (logsList && logsList.length > 0) {
      const visibleLogs = logsList.slice(startIndex, endIndex);
      createLogsExcelReport(visibleLogs);
    } else {
      console.log("No logs available to export");
    }
  };
  return (
    <Fragment>
      {isShowUnAuthView ? (
        <UnAuthorizeView hideHomeBtn />
      ) : (
        <ContainerLayout breadCrumbs={[labels.logs]}>
          <Fragment>
            {isCompanyServiceDataLoading ? (
              <LoadingView />
            ) : (
              <Fragment>
                <FormProvider {...methods}>
                  <Grid container item direction="row" xs={12} columnGap={2}>
                    <Grid item xs={2}>
                      <DateTextFieldController
                        key="fromDate"
                        controllerName="fromDate"
                        label="fromDate"
                        isDisabled={false}
                        errorMessage=""
                        isRequired={false}
                        showHeading
                        headingText={labels.fromDate}
                        dateFormat="YYYY-MM-DD"
                        maxDate={toDateStr ? dayjs(toDateStr) : null}
                        handleChange={resetPage}
                        placeHolderText={labels.fromDate}
                        showToolTip
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <DateTextFieldController
                        key="toDate"
                        controllerName="toDate"
                        label="toDate"
                        isDisabled={false}
                        errorMessage=""
                        isRequired={false}
                        showHeading
                        headingText={labels.toDate}
                        dateFormat="YYYY-MM-DD"
                        minDate={fromDateStr ? dayjs(fromDateStr) : dayjs()}
                        handleChange={resetPage}
                        placeHolderText={labels.toDate}
                        showToolTip
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <DropDownController
                        controllerName="transactionStatus"
                        placeHolder={labels.status}
                        showToolTip
                        isRequired={false}
                        disabled={false}
                        label={labels.status}
                        defaultSelectedValue={statusStr}
                        onSelectChange={(selectedValue) => {
                          setStatus(selectedValue.target.value);
                          resetPage();
                        }}
                      >
                        {transactionStatus?.map((data: any) => {
                          return (
                            <MenuItem
                              key={data.label}
                              value={data.label}
                              sx={MenuItemStyle}
                            >
                              {data.label}
                            </MenuItem>
                          );
                        })}
                      </DropDownController>
                    </Grid>
                    <Grid item xs={3}>
                      <DropDownController
                        controllerName="serviceName"
                        placeHolder={labels.serviceName}
                        showToolTip
                        isRequired={false}
                        disabled={false}
                        label={labels.serviceName}
                        defaultSelectedValue={serviceNameStr}
                        onSelectChange={(selectedValue) => {
                          setServiceName(selectedValue.target.value);
                          resetPage();
                        }}
                      >
                        {serviceList?.map((data: any) => {
                          return (
                            <MenuItem
                              key={data.service.id}
                              value={data.service.name}
                              sx={MenuItemStyle}
                            >
                              {data.service.name}
                            </MenuItem>
                          );
                        })}
                      </DropDownController>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid
                      item
                      display="flex"
                      justifyContent="right"
                      alignItems="end"
                    >
                      {(isSuperAdmin || hasExportPermission) && (
                        <Grid
                          item
                          container
                          columnGap={2}
                          justifyContent="right"
                        >
                          <FormLoadingButton
                            buttonVariant="contained"
                            //  isLoading={isPDFInvoiceDataLoading}
                            id="exportPDF"
                            paddingY={0}
                            disabled={logsList.length === 0}
                            backgroundColor="primary.green"
                            onClickEvent={downloadPdfReport}
                          >
                            {labels.download}
                          </FormLoadingButton>
                          <FormLoadingButton
                            buttonVariant="contained"
                            // isLoading={isExcelInvoiceDataLoading}
                            id="exportExcel"
                            paddingY={0}
                            disabled={logsList.length === 0}
                            backgroundColor="primary.green"
                            onClickEvent={downloadExcelReport}
                          >
                            {labels.excelText}
                          </FormLoadingButton>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>

                  <Grid item>
                    <TableComponent
                      columnHeaderHeight={45}
                      columns={logsColumns}
                      rows={logsList}
                      loading={isLogsLoading}
                      deleting={false}
                      rowCount={totalRowCount}
                      paginationMode="server"
                      paginationModel={paginationModel}
                      onPaginationModelChange={setPaginationModel}
                      onView={onLogsView}
                      showActionTitle
                      actions
                      showViewButton
                    />
                  </Grid>
                </FormProvider>
                <LogsDetail
                  isOpen={shouldShowLogsDetail}
                  selectedLogsData={selectedLogsData}
                  handleAction={handleLogsDetailAction}
                />
              </Fragment>
            )}
          </Fragment>
        </ContainerLayout>
      )}
    </Fragment>
  );
};

export default LogsReports;
