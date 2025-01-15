import { Fragment, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";

import { handleErroMessage } from "~/utils/helper";

import { useAppSelector } from "~/state/hooks";

import {
  useGetAllModules,
  useGetAllUserNames,
  useGetAuditLogs,
} from "~/rest/apiHooks/auditLogs";

import AuditLogsDetail from "~/modules/auditLogs/components/AuditLogsDetail";
import { createAuditLogsExcelReport } from "~/modules/auditLogs/utils/excelReportHelper";
import { auditLogsColumns } from "~/modules/auditLogs/utils/helper";
import { labels } from "~/modules/auditLogs/utils/labels";
import { createAuditLogsReport } from "~/modules/auditLogs/utils/pdfHepler";

import FormLoadingButton from "~/core/components/Buttons/FormLoadingButton";
import DateTextFieldController from "~/core/components/FormComponents/DateTextFieldComponent";
import DropDownController from "~/core/components/FormComponents/DropDownComponent";
import ContainerLayout from "~/core/components/Layouts/ContainerLayout";
import { MenuItemStyle } from "~/core/components/style";
import TableComponent from "~/core/components/Table";
import {
  capitalizeFirstLetter,
  getFormattedDateWithTime,
} from "~/core/utils/helper";

const AuditLogs = () => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF("p", "mm", "a4");
  const { data: auditModulesData, isLoading: isLoadingModules } =
    useGetAllModules();

  const { data: userNameData, isLoading: isUserNamesLoading } =
    useGetAllUserNames();

  const {
    mutateAsync: getAuditLogs,
    data: auditLogsData,
    isLoading: isAuditLogsLoading,
  } = useGetAuditLogs();

  const {
    mutateAsync: getAuditLogsForPdfExport,
    isLoading: isAuditLogsForPDFLoading,
  } = useGetAuditLogs();

  const {
    mutateAsync: getAuditLogsForExcelExport,
    isLoading: isAuditLogsForExcelLoading,
  } = useGetAuditLogs();

  const user = useAppSelector((state) => state.core.userInfo);
  const [userIdStr, setUserIdStr] = useState("All");
  const [auditLogsUserList, setAuditLogsUserList] = useState<any[]>([]);
  const [auditModuleStr, setAuditModuleStr] = useState("COMPANY");
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [auditLogsList, setAuditLogsList] = useState<any[]>([]);
  const [selectedAuditLogsData, setSelectedAuditLogData] = useState<any>();
  const [shouldShowAuditLogsDetail, setShowAuditLogsDetail] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

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

  const extractAndCombineJsonString = (
    oldValues: string,
    newValues: string
  ) => {
    const oldValuesArray = JSON.parse(oldValues);
    const newValuesArray = JSON.parse(newValues);

    return oldValuesArray.map((obj1: any, index: number) => {
      const obj2 = newValuesArray[index];

      return {
        operation: obj1.op,
        path: obj1.path,
        oldValue: obj1.value,
        newValue: obj2.value,
        id: index + 1,
      };
    });
  };

  const getUpdatedCompanyName = (data: string | null): string => {
    if (data !== null) {
      return capitalizeFirstLetter(data.toString().toLowerCase());
    } else {
      return "--";
    }
  };

  const extractAuditLogsObjects: (array: any[]) => any[] = (array) => {
    return array.map((obj) => {
      const mergedObj: any = {
        updatedCompanyName: getUpdatedCompanyName(obj.updatedModuleName),
        id: obj.id,
        moduleName: capitalizeFirstLetter(obj.moduleName.toLowerCase()),
        action: capitalizeFirstLetter(obj.action.toLowerCase()),
        description: obj.description,
        updatedByUserName: obj.updatedByUserName.toLowerCase(),
        date: getFormattedDateWithTime(obj.createdAt),
        formValueArray: extractAndCombineJsonString(
          obj.oldValueJson,
          obj.newValueJson
        ),
      };
      return mergedObj;
    });
  };

  useEffect(() => {
    if (user) {
      getAuditLogs({
        companyId: user.company.id,
        userId: userIdStr,
        moduleName: auditModuleStr,
        pageNumber: paginationModel.page,
        pageSize: paginationModel.pageSize,
        fromDate: fromDateStr,
        toDate: toDateStr,
        allowPagination: true,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel.page, auditModuleStr, userIdStr, fromDateStr, toDateStr]);

  useEffect(() => {
    if (auditLogsData) {
      setTotalRowCount(auditLogsData.count);
      setAuditLogsList(extractAuditLogsObjects(auditLogsData.auditLogs));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditLogsData]);

  useEffect(() => {
    if (userNameData) {
      const allOption = {
        userId: -1,
        username: "All",
      };
      setAuditLogsUserList([allOption, ...userNameData]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userNameData]);

  const resetPagination = () => {
    setPaginationModel({ page: 0, pageSize: 10 });
  };
  const sortAuditLogsByDate = (auditLogs: any[]): any[] => {
    return auditLogs.sort(
      (olderLog, latestLog) =>
        new Date(latestLog.date).getTime() - new Date(olderLog.date).getTime()
    );
  };

  const downloadPdfReport = () => {
    if (user) {
      getAuditLogsForPdfExport(
        {
          companyId: user.company.id,
          userId: userIdStr,
          moduleName: auditModuleStr,
          pageNumber: paginationModel.page,
          pageSize: paginationModel.pageSize,
          fromDate: fromDateStr,
          toDate: toDateStr,
          allowPagination: false,
        },
        {
          onSuccess: (data) => {
            const auditDataList = sortAuditLogsByDate(
              extractAuditLogsObjects(data.auditLogs)
            );

            if (auditDataList.length > 0) {
              createAuditLogsReport(doc, auditDataList);
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
      getAuditLogsForExcelExport(
        {
          companyId: user.company.id,
          userId: userIdStr,
          moduleName: auditModuleStr,
          pageNumber: paginationModel.page,
          pageSize: paginationModel.pageSize,
          fromDate: fromDateStr,
          toDate: toDateStr,
          allowPagination: false,
        },
        {
          onSuccess: (data) => {
            const auditDataList = sortAuditLogsByDate(
              extractAuditLogsObjects(data.auditLogs)
            );

            if (auditDataList.length > 0) {
              createAuditLogsExcelReport(auditDataList);
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

  const onLogsView = (viewLogs: any) => {
    setSelectedAuditLogData(viewLogs);
    setShowAuditLogsDetail(true);
  };

  const handleLogsDetailAction = (Status: boolean) => {
    setShowAuditLogsDetail(Status);
  };
  return (
    <Fragment>
      <ContainerLayout breadCrumbs={[labels.auditLogs]}>
        {isLoadingModules || isUserNamesLoading ? (
          <Box display="flex" alignItems="center" justifyContent="center">
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Fragment>
            <FormProvider {...methods}>
              <Grid container item direction="row" xs={12} columnGap={2}>
                <Grid item xs={3}>
                  <DropDownController
                    controllerName="auditModules"
                    placeHolder={labels.selectModule}
                    isRequired={false}
                    disabled={false}
                    showToolTip
                    label={labels.moduleName}
                    defaultSelectedValue={auditModuleStr}
                    onSelectChange={(selectedValue) => {
                      setAuditModuleStr(selectedValue.target.value);
                      resetPagination();
                    }}
                  >
                    {auditModulesData?.map((data: any) => {
                      return (
                        <MenuItem
                          key={data.moduleHandle}
                          value={data.moduleHandle}
                          sx={MenuItemStyle}
                        >
                          {capitalizeFirstLetter(
                            data.moduleHandle.toString().toLowerCase()
                          )}
                        </MenuItem>
                      );
                    })}
                  </DropDownController>
                </Grid>

                <Grid item xs={3}>
                  <DropDownController
                    controllerName="userId"
                    placeHolder={labels.selectUser}
                    isRequired={false}
                    disabled={false}
                    showToolTip
                    label={labels.user}
                    defaultSelectedValue={userIdStr}
                    onSelectChange={(selectedValue) => {
                      setUserIdStr(selectedValue.target.value);
                      resetPagination();
                    }}
                  >
                    {auditLogsUserList?.map((data: any) => {
                      return (
                        <MenuItem
                          key={data.userId}
                          value={data.username}
                          sx={MenuItemStyle}
                        >
                          {data.username}
                        </MenuItem>
                      );
                    })}
                  </DropDownController>
                </Grid>

                <Grid item xs={2}>
                  <DateTextFieldController
                    key="fromDate"
                    controllerName="fromDate"
                    label="fromDate"
                    isDisabled={false}
                    errorMessage=""
                    isRequired={false}
                    dateFormat="YYYY-MM-DD"
                    maxDate={toDateStr ? dayjs(toDateStr) : null}
                    handleChange={resetPagination}
                    showHeading
                    headingText={labels.fromDate}
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
                    dateFormat="YYYY-MM-DD"
                    minDate={fromDateStr ? dayjs(fromDateStr) : dayjs()}
                    handleChange={resetPagination}
                    showHeading
                    headingText={labels.toDate}
                  />
                </Grid>
              </Grid>

              <Grid item>
                <Grid
                  item
                  display="flex"
                  justifyContent="right"
                  alignItems="end"
                >
                  <Grid item container columnGap={2} justifyContent="right">
                    <FormLoadingButton
                      buttonVariant="contained"
                      isLoading={isAuditLogsForPDFLoading}
                      id="exportPDF"
                      disabled={auditLogsList.length === 0}
                      onClickEvent={downloadPdfReport}
                    >
                      {labels.download}
                    </FormLoadingButton>
                    <FormLoadingButton
                      buttonVariant="contained"
                      isLoading={isAuditLogsForExcelLoading}
                      id="exportExcel"
                      disabled={auditLogsList.length === 0}
                      onClickEvent={downloadExcelReport}
                    >
                      {labels.excelText}
                    </FormLoadingButton>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <TableComponent
                  columnHeaderHeight={48}
                  columns={auditLogsColumns}
                  rows={auditLogsList}
                  loading={isAuditLogsLoading}
                  deleting={false}
                  rowCount={totalRowCount}
                  paginationMode="server"
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  actions
                  onView={onLogsView}
                  showViewButton
                />
              </Grid>
            </FormProvider>
            <AuditLogsDetail
              isOpen={shouldShowAuditLogsDetail}
              selectedLogsData={selectedAuditLogsData}
              handleAction={handleLogsDetailAction}
            />
          </Fragment>
        )}
      </ContainerLayout>
    </Fragment>
  );
};

export default AuditLogs;
