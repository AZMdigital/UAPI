import { Fragment, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "dayjs";
import jsPDF from "jspdf";

import { handleErroMessage } from "~/utils/helper";
import { PERMISSION_LOGS_EXPORT } from "~/utils/permissionsConstants";

import { useAppSelector } from "~/state/hooks";

import { useGetCallbackLogs } from "~/rest/apiHooks/callbackLogs";
import { useGetCompanyServices } from "~/rest/apiHooks/companies/useCompanies";

import CallbackLogsDetail from "~/modules/callbackLogs/components/CallbackLogsDetails";
import { createCallbackLogsExcelReport } from "~/modules/callbackLogs/utils/excelReportHelper";
import { callbackLogsColumns } from "~/modules/callbackLogs/utils/helper";
import { labels } from "~/modules/callbackLogs/utils/labels";
import { createCallbackLogsReport } from "~/modules/callbackLogs/utils/pdfHelper";

import FormLoadingButton from "~/core/components/Buttons/FormLoadingButton";
import DateTextFieldController from "~/core/components/FormComponents/DateTextFieldComponent";
import DropDownController from "~/core/components/FormComponents/DropDownComponent";
import ContainerLayout from "~/core/components/Layouts/ContainerLayout";
import LoadingView from "~/core/components/LoadingView";
import { MenuItemStyle } from "~/core/components/style";
import TableComponent from "~/core/components/Table";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";
import { getFormattedDateWithTime } from "~/core/utils/helper";

const CallbackLogs = () => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF("landscape", "mm", "a3");
  const user = useAppSelector((state) => state.core.userInfo);
  const methods = useForm({
    defaultValues: {
      serviceId: "",
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

  const {
    mutateAsync: getCompanyServiceList,
    data: companyServiceData,
    isLoading: isCompanyServiceDataLoading,
  } = useGetCompanyServices();

  const {
    mutateAsync: getCallbackLogs,
    data: callbackLogsData,
    isLoading: isCallbackLogsLoading,
  } = useGetCallbackLogs();

  const {
    mutateAsync: getCallbackLogsForPdfExport,
    isLoading: isCallbackLogsForPDFLoading,
  } = useGetCallbackLogs();

  const {
    mutateAsync: getCallbackLogsForExcelExport,
    isLoading: isCallbackLogsForExcelLoading,
  } = useGetCallbackLogs();

  useEffect(() => {
    if (callbackLogsData) {
      setTotalRowCount(callbackLogsData.count);

      const sortedLogs = extractCallbackLogsObjects(
        callbackLogsData.callLogs
      ).sort((newDate, oldDate) => {
        const newCreatedDate = dayjs(newDate.createdAt);
        const oldCreatedDate = dayjs(oldDate.createdAt);
        if (newCreatedDate.isValid() && oldCreatedDate.isValid()) {
          return oldCreatedDate.isAfter(newCreatedDate) ? 1 : -1;
        }
        if (!newCreatedDate.isValid() && oldCreatedDate.isValid()) return 1;
        if (newCreatedDate.isValid() && !oldCreatedDate.isValid()) return -1;
        return 0;
      });

      setCallbackLogsList(sortedLogs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callbackLogsData]);

  const [isShowUnAuthView, setShowUnAuthView] = useState(false);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [servicesList, setServicesList] = useState<any[]>(companyServiceData);
  const [callbackLogsList, setCallbackLogsList] = useState<any[]>([]);
  const [selectedCallbackLogData, setSelectedCallbackLogData] = useState<any>();
  const [selectedService, setSelectedService] = useState(0);
  const [shouldShowCallbackLogsDetail, setShowCallbackLogsDetail] =
    useState(false);
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
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  useEffect(() => {
    if (companyServiceData) {
      setServicesList(companyServiceData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyServiceData]);
  const getServiceName = (id: number) => {
    const service = servicesList.find((service) => service.service.id === id);
    if (service) {
      const serviceName = service ? service.service.name : "-";
      return serviceName;
    } else {
      return "-";
    }
  };
  const extractCallbackLogsObjects: (array: any[]) => any[] = (array) => {
    if (!Array.isArray(array)) {
      return [];
    }
    return array
      .map((obj) => {
        if (!obj || typeof obj !== "object") {
          return null;
        }
        return {
          id: obj.id,
          inboundEndpoint: obj.inboundEndpoint,
          inboundRequestData: obj.inboundRequestData,
          authData: obj.authData,
          companyId: obj.companyId,
          serviceId: obj.serviceId,
          serviceName: getServiceName(obj.serviceId),
          serviceCallbackId: obj.serviceCallbackId,
          outboundUrl: obj.outboundUrl,
          outboundResponse: obj.outboundResponse,
          outboundRequestData: obj.outboundRequestData,
          header: obj.header,
          payload: obj.payload,
          error: obj.error,
          createdAt: obj.createdAt && getFormattedDateWithTime(obj.createdAt),
          inboundRequestReceivedAt:
            obj.inboundRequestReceivedAt &&
            getFormattedDateWithTime(obj.inboundRequestReceivedAt),
          outboundRequestSentAt:
            obj.outboundRequestReceievedAt &&
            getFormattedDateWithTime(obj.outboundRequestReceievedAt),
          outboundResponseReceivedAt:
            obj.outboundResponseReceivedAt &&
            getFormattedDateWithTime(obj.outboundResponseReceivedAt),
        };
      })
      .filter(Boolean);
  };
  useEffect(() => {
    if (user && companyServiceData) {
      getCallbackLogs({
        companyId: user.company.id,
        serviceId: selectedService,
        pageNumber: paginationModel.page,
        pageSize: paginationModel.pageSize,
        fromDate: fromDateStr,
        toDate: toDateStr,
        allowPagination: true,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyServiceData, paginationModel, fromDateStr, toDateStr]);
  useEffect(() => {
    getCompanyServiceList(
      { companyId: user?.company.id as number },
      {
        onSuccess: (data) => {
          setServicesList(data || []);
        },
        onError: (error: any) => {
          const status = error?.response?.status;
          if (status === 403) setShowUnAuthView(true);
        },
      }
    );
  }, [getCompanyServiceList, user]);

  const onLogsView = (viewLogs: any) => {
    setSelectedCallbackLogData(viewLogs);
    setShowCallbackLogsDetail(true);
  };
  const resetPage = () => setPaginationModel({ page: 0, pageSize: 10 });

  const downloadPdfReport = () => {
    if (user) {
      getCallbackLogsForPdfExport(
        {
          companyId: user.company.id,
          serviceId: selectedService,
          pageNumber: paginationModel.page,
          pageSize: paginationModel.pageSize,
          fromDate: fromDateStr,
          toDate: toDateStr,
          allowPagination: true,
        },
        {
          onSuccess: (data: { callLogs: any[] }) => {
            const callbackDataList = extractCallbackLogsObjects(data.callLogs);
            if (callbackDataList.length > 0) {
              createCallbackLogsReport(doc, callbackDataList);
            } else {
              handleErroMessage(labels.noDataFound);
            }
          },
          onError: () => {
            handleErroMessage(labels.exportError);
          },
        }
      );
    }
  };

  const downloadExcelReport = () => {
    if (user) {
      getCallbackLogsForExcelExport(
        {
          companyId: user.company.id,
          serviceId: selectedService,
          pageNumber: paginationModel.page,
          pageSize: paginationModel.pageSize,
          fromDate: fromDateStr,
          toDate: toDateStr,
          allowPagination: false,
        },
        {
          onSuccess: (data: { callLogs: any[] }) => {
            const callbackDataList = extractCallbackLogsObjects(data.callLogs);
            if (callbackDataList.length > 0) {
              createCallbackLogsExcelReport(callbackDataList);
            } else {
              handleErroMessage(labels.noDataFound);
            }
          },
          onError: () => {
            handleErroMessage(labels.exportError);
          },
        }
      );
    }
  };

  const handleLogsDetailAction = () => {
    setShowCallbackLogsDetail(false);
  };

  return (
    <Fragment>
      {isShowUnAuthView ? (
        <UnAuthorizeView hideHomeBtn />
      ) : (
        <ContainerLayout breadCrumbs={[labels.callbackLogs]}>
          {isCompanyServiceDataLoading ? (
            <LoadingView />
          ) : (
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
                <Grid item xs={3}>
                  <DropDownController
                    controllerName="serviceId"
                    placeHolder={labels.serviceName}
                    showToolTip
                    isRequired={false}
                    disabled={false}
                    label={labels.serviceName}
                    onSelectChange={(selectedValue) => {
                      setSelectedService(selectedValue.target.value);
                      resetPage();
                    }}
                  >
                    {servicesList?.map((data: any) => {
                      return (
                        <MenuItem
                          key={data.service.id}
                          value={data.service.id}
                          sx={MenuItemStyle}
                        >
                          {data.service.name}
                        </MenuItem>
                      );
                    })}
                  </DropDownController>
                </Grid>
              </Grid>
              {(isSuperAdmin || hasExportPermission) && (
                <Grid container justifyContent="flex-end" spacing={2}>
                  <Grid item>
                    <FormLoadingButton
                      buttonVariant="contained"
                      isLoading={isCallbackLogsForPDFLoading}
                      id="exportPDF"
                      disabled={callbackLogsList.length === 0}
                      onClickEvent={downloadPdfReport}
                    >
                      {labels.download}
                    </FormLoadingButton>
                  </Grid>
                  <Grid item>
                    <FormLoadingButton
                      buttonVariant="contained"
                      isLoading={isCallbackLogsForExcelLoading}
                      id="exportExcel"
                      disabled={callbackLogsList.length === 0}
                      onClickEvent={downloadExcelReport}
                    >
                      {labels.excelText}
                    </FormLoadingButton>
                  </Grid>
                </Grid>
              )}
              <Grid item>
                <TableComponent
                  columnHeaderHeight={48}
                  columns={callbackLogsColumns}
                  rows={callbackLogsList}
                  loading={isCallbackLogsLoading}
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

              <CallbackLogsDetail
                isOpen={shouldShowCallbackLogsDetail}
                handleAction={handleLogsDetailAction}
                selectedLogsData={selectedCallbackLogData}
              />
            </FormProvider>
          )}
        </ContainerLayout>
      )}
    </Fragment>
  );
};

export default CallbackLogs;
