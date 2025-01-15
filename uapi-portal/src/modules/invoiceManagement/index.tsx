import { Fragment, SetStateAction, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import { jsPDF } from "jspdf";

import { handleErroMessage } from "~/utils/helper";
import { PERMISSION_INVOICE_EXPORT } from "~/utils/permissionsConstants";

import { useAppDispatch, useAppSelector } from "~/state/hooks";

import {
  useDownloadInvoiceSlip,
  useDownloadTaxInvoice,
  useGenerateInvoice,
  useGetInvoices,
} from "~/rest/apiHooks/invoices/useInvoices";

import InvoiceUploadModal from "~/modules/invoiceManagement/components/InvoiceUploadModal";
import { createInvoiceListExcelReport } from "~/modules/invoiceManagement/utils/excelReportHelper";
import {
  formatCurrency,
  invoiceStatus,
  invoiceType,
  uploadSlipStatusCriteria,
} from "~/modules/invoiceManagement/utils/helper";
import { labels } from "~/modules/invoiceManagement/utils/labels";
import { createInvoiceListReport } from "~/modules/invoiceManagement/utils/pdfHepler";

import DownloadFileIcon from "~/public/assets/download-file.svg";

import FormLoadingButton from "~/core/components/Buttons/FormLoadingButton";
import DropDownController from "~/core/components/FormComponents/DropDownComponent";
import SearchTextField from "~/core/components/FormComponents/SearchTextField";
import ContainerLayout from "~/core/components/Layouts/ContainerLayout";
import { MenuItemStyle } from "~/core/components/style";
import TableComponent from "~/core/components/Table";
import UnAuthorizeView from "~/core/components/UnAuthorizesView";
import { toggleUploadModal } from "~/core/state/coreSlice";
import {
  AccountType,
  convertToTitleCase,
  getFormattedDate,
} from "~/core/utils/helper";

const InvoiceManagement = () => {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line new-cap
  const doc = new jsPDF("p", "mm", "a4");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const userPermissions = useAppSelector(
    (state) => state.core.userRolePermissions
  );

  const userPermissionsStrings: string[] = userPermissions.map(
    (permission) => permission as unknown as string
  );

  const hasExportPermission: boolean = userPermissionsStrings.includes(
    PERMISSION_INVOICE_EXPORT
  );

  const user = useAppSelector((state) => state.core.userInfo);

  const isSuperAdmin: any = user?.isSuperAdmin;

  const invoiceColumns: GridColDef[] = [
    {
      headerName: labels.invoiceNo,
      field: "invoiceNumber",
      flex: 1,
      renderCell: ({ value }) => (
        <Tooltip title={value}>
          <Typography variant="h2" display="inline">
            {value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      headerName: labels.sadadInvoiceNo,
      field: "sadadInvoiceNumber",
      flex: 1,
      renderCell: ({ value }) => (
        <Tooltip title={value}>
          <Typography variant="h2" display="inline">
            {value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      headerName: labels.invoiceType,
      field: "invoiceType",
      flex: 1,
      renderCell: ({ value }) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Tooltip title={convertToTitleCase(value)}>
            <Typography
              variant="h2"
              sx={{
                color: "primary.blackishGray",
              }}
            >
              {convertToTitleCase(value)}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },
    {
      headerName: labels.packageName,
      field: "packageName",
      flex: 1,
      renderCell: ({ value }) => (
        <Tooltip title={value}>
          <Typography variant="h2" display="inline">
            {value}
          </Typography>
        </Tooltip>
      ),
    },

    {
      headerName: labels.accountName,
      field: "accountName",
      flex: 1,
      renderCell: ({ value }) => (
        <Tooltip title={value}>
          <Typography variant="h2" display="inline">
            {value}
          </Typography>
        </Tooltip>
      ),
    },

    {
      headerName: labels.subAccountName,
      field: "subAccountName",
      flex: 1,
      renderCell: ({ value }) => (
        <Tooltip title={value}>
          <Typography variant="h2" display="inline">
            {value}
          </Typography>
        </Tooltip>
      ),
    },

    {
      headerName: labels.amount,
      field: "amount",
      flex: 1,
      renderCell: ({ value }) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Tooltip title={`${formatCurrency(value)}`}>
            <Typography
              variant="h2"
              sx={{
                color: "primary.blackishGray",
              }}
            >
              {`${formatCurrency(value)}`}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },
    {
      headerName: labels.dueDate,
      field: "dueDate",
      flex: 1,
      renderCell: ({ value }) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Tooltip title={getFormattedDate(value)}>
            <Typography
              variant="h2"
              sx={{
                // marginTop: 1.8,
                color: "primary.blackishGray",
              }}
            >
              {getFormattedDate(value)}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },

    {
      headerName: labels.status,
      field: "invoiceStatus",
      flex: 1,
      renderCell: ({ value }) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Tooltip title={convertToTitleCase(value)}>
            <Typography
              variant="h2"
              sx={{
                color: "primary.blackishGray",
              }}
            >
              {convertToTitleCase(value)}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },

    {
      headerName: labels.slipStatus,
      field: "slipStatus",
      flex: 1,
      renderCell: ({ value }) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Tooltip title={convertToTitleCase(value)}>
            <Typography
              variant="h2"
              sx={{
                color: "primary.blackishGray",
              }}
            >
              {convertToTitleCase(value)}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },
    {
      headerName: labels.slipTitle,
      field: "paymentSlip",
      flex: 1,
      renderCell: ({ value }) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {value && (
            <IconButton
              onClick={() => downloadAttachment(value)} // Call a function when clicked
              sx={{
                marginLeft: 1,
                color: "primary.main", // Optional: Customize icon color
              }}
            >
              <Image
                src={DownloadFileIcon}
                alt="DownloadFileIcon"
                style={{ width: 24, height: 24 }}
              />
            </IconButton>
          )}
        </Box>
      ),
    },
    {
      headerName: labels.taxInvoice,
      field: "taxCertificate",
      flex: 1,
      renderCell: ({ value }) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {value && (
            <IconButton
              onClick={() => downloadTaxInvoice(value)} // Call a function when clicked
              sx={{
                marginLeft: 1,
                color: "primary.main", // Optional: Customize icon color
              }}
            >
              <Image
                src={DownloadFileIcon}
                alt="DownloadFileIcon"
                style={{ width: 24, height: 24 }}
              />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  const {
    mutateAsync: getInvoices,
    data: invoiceData,
    isLoading: isInvoiceLoading,
  } = useGetInvoices();

  const {
    mutateAsync: getInvoicesListForPdf,
    isLoading: isPDFInvoiceDataLoading,
  } = useGetInvoices();

  const {
    mutateAsync: getInvoicesListForExcel,
    isLoading: isExcelInvoiceDataLoading,
  } = useGetInvoices();

  const { mutateAsync: getInvoiceSlip } = useDownloadInvoiceSlip();
  const { mutateAsync: getGenerateInvoice } = useGenerateInvoice();
  const { mutateAsync: getTaxInvoice } = useDownloadTaxInvoice();
  const [invoiceList, setInvoiceList] = useState<any[]>([]);
  const [isShowUnAuthView, setShowUnAuthView] = useState(false);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [isSearchLoading, setSearchLoading] = useState(false);
  const [packageNameStr, setPackageNameStr] = useState("");
  const [invoiceStatusStr, setInvoiceStatusStr] = useState("");
  const [invoiceStatusType, setInvoiceStatusType] = useState("");
  const shouldShowInvoiceUploadModal = useAppSelector(
    (state) => state.core.openUploadModal
  );
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [shouldTriggerRefetch, setTriggerRefetch] = useState(false);

  const handleSearch = (query: SetStateAction<string>) => {
    // Set the query
    setPackageNameStr(query);

    // start the loader
    if (query) setSearchLoading(true);

    // Reset the Pagination
    setPaginationModel({ page: 0, pageSize: 10 });
  };

  const methods = useForm();

  const extractInvoiceObjects: (array: any[]) => any[] = (array) => {
    return array.map((obj) => {
      const mergedObj: any = {
        ...obj,
        packageName: obj?.companyPackageSelected?.package?.name ?? "",
        accountId: obj?.company.id,
        accountName:
          obj.company.accountType === AccountType.MAIN
            ? obj.company.companyName
            : "",
        subAccountName:
          obj.company.accountType === AccountType.SUB
            ? obj.company.companyName
            : "",
        taxCertificate:
          obj.taxCertificate !== null
            ? `${obj.id}***${obj.taxCertificate}***${obj.company?.id}`
            : null,
        paymentSlip:
          obj.paymentSlip !== null
            ? `${obj.id}***${obj.paymentSlip}***${obj.company?.id}`
            : null,
      };
      return mergedObj;
    });
  };

  const extractInvoiceObjectsForReports: (array: any[]) => any[] = (array) => {
    return array.map((obj) => {
      const mergedObj: any = {
        invoiceNumber: obj.invoiceNumber,
        sadadInvoiceNumber: obj.sadadInvoiceNumber,
        invoiceType: obj.invoiceType,
        packageName: obj?.companyPackageSelected?.package?.name ?? "",
        accountId: obj?.company.id,
        accountName:
          obj.company.accountType === AccountType.MAIN
            ? obj.company.companyName
            : "",
        subAccountName:
          obj.company.accountType === AccountType.SUB
            ? obj.company.companyName
            : "",
        amount: obj.amount,
        dueDate: obj.dueDate,
        invoiceStatus: obj.invoiceStatus,
      };
      return mergedObj;
    });
  };

  useEffect(() => {
    getInvoices(
      {
        packageName: packageNameStr,
        invoiceStatus: invoiceStatusStr,
        invoiceType: invoiceStatusType,
        pageNumber: paginationModel.page,
        pageSize: paginationModel.pageSize,
        allowPagination: true,
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
  }, [
    paginationModel.page,
    packageNameStr,
    invoiceStatusStr,
    invoiceStatusType,
    shouldTriggerRefetch,
  ]);

  useEffect(() => {
    if (invoiceData) {
      setTotalRowCount(invoiceData.totalRecords);
      setSearchLoading(false);
      setInvoiceList(extractInvoiceObjects(invoiceData.invoiceList));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceData]);

  const downloadPdfReport = () => {
    // Let call the API to get non-paginated data
    getInvoicesListForPdf(
      {
        packageName: packageNameStr,
        invoiceStatus: invoiceStatusStr,
        invoiceType: invoiceStatusType,
        pageNumber: paginationModel.page,
        pageSize: paginationModel.pageSize,
        allowPagination: false,
      },
      {
        onSuccess: (data) => {
          const invoiceDataList = extractInvoiceObjects(data.invoiceList);
          createInvoiceListReport(
            doc,
            extractInvoiceObjectsForReports(invoiceDataList)
          );
        },
        onError: () => {
          handleErroMessage(labels.exportError);
        },
      }
    );
  };

  const downloadExcelReport = () => {
    // Let call the API to get non-paginated data
    getInvoicesListForExcel(
      {
        packageName: packageNameStr,
        invoiceStatus: invoiceStatusStr,
        invoiceType: invoiceStatusType,
        pageNumber: paginationModel.page,
        pageSize: paginationModel.pageSize,
        allowPagination: false,
      },
      {
        onSuccess: (data) => {
          const invoiceDataList = extractInvoiceObjects(data.invoiceList);
          createInvoiceListExcelReport(
            extractInvoiceObjectsForReports(invoiceDataList)
          );
        },
        onError: () => {
          handleErroMessage(labels.exportError);
        },
      }
    );
  };

  const handleUploadSlip = (input: any) => {
    setSelectedInvoice(input);
    dispatch(toggleUploadModal(true));
  };

  const onView = (input: any) => {
    getGenerateInvoice({
      invoiceId: Number(input.id),
      invoiceTitle: input.invoiceNumber,
    });
  };

  const downloadAttachment = (value: string) => {
    // Extract the invoice ID
    const tokens = value.split("***");
    if (tokens.length > 0) {
      const [invoiceId, slipId, companyId] = tokens;
      getInvoiceSlip({
        accountId: Number(companyId),
        invoiceId: Number(invoiceId),
        slipId,
      });
    }
  };

  const downloadTaxInvoice = (value: string) => {
    // Extract the invoice ID
    const tokens = value.split("***");
    if (tokens.length > 0) {
      const [invoiceId, slipId, companyId] = tokens;
      getTaxInvoice({
        accountId: Number(companyId),
        invoiceId: Number(invoiceId),
        slipId,
      });
    }
  };

  const handleUploadModalAction = (Status: boolean) => {
    dispatch(toggleUploadModal(Status));
    setTriggerRefetch((value) => !value);
  };

  return (
    <Fragment>
      {isShowUnAuthView ? (
        <UnAuthorizeView hideHomeBtn />
      ) : (
        <ContainerLayout breadCrumbs={[labels.myInvoices]}>
          <FormProvider {...methods}>
            <Grid
              container
              item
              direction="row"
              xs={12}
              justifyContent="space-between"
            >
              <Grid columnGap={2} item container direction="row" xs={8}>
                <Grid item xs={4}>
                  <SearchTextField
                    searchPlaceHolder={labels.searchPackageName}
                    onSearch={handleSearch}
                    interval={300}
                    isSearchLoading={isSearchLoading}
                  />
                </Grid>
                <Grid item xs={3}>
                  <DropDownController
                    controllerName="invoiceStatus"
                    placeHolder={labels.selectInvoiceStatus}
                    isRequired={false}
                    disabled={false}
                    showToolTip
                    defaultSelectedValue={invoiceStatusStr}
                    onSelectChange={(selectedValue) =>
                      setInvoiceStatusStr(selectedValue.target.value)
                    }
                  >
                    {invoiceStatus?.map((data: any) => {
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
                    controllerName="invoiceType"
                    placeHolder={labels.selectInvoiceType}
                    isRequired={false}
                    disabled={false}
                    showToolTip
                    defaultSelectedValue={invoiceStatusType}
                    onSelectChange={(selectedValue) =>
                      setInvoiceStatusType(selectedValue.target.value)
                    }
                  >
                    {invoiceType?.map((data: any) => {
                      return (
                        <MenuItem
                          key={data.label}
                          value={data.label}
                          disabled={data.disabled}
                          sx={MenuItemStyle}
                        >
                          {data.label}
                        </MenuItem>
                      );
                    })}
                  </DropDownController>
                </Grid>
              </Grid>
              <Grid item>
                {(isSuperAdmin || hasExportPermission) && (
                  <Grid item container columnGap={2} justifyContent="right">
                    <FormLoadingButton
                      buttonVariant="contained"
                      isLoading={isPDFInvoiceDataLoading}
                      id="exportPDF"
                      paddingY={0}
                      disabled={invoiceList.length === 0}
                      backgroundColor="primary.green"
                      onClickEvent={downloadPdfReport}
                    >
                      {labels.download}
                    </FormLoadingButton>
                    <FormLoadingButton
                      buttonVariant="contained"
                      isLoading={isExcelInvoiceDataLoading}
                      id="exportExcel"
                      paddingY={0}
                      disabled={invoiceList.length === 0}
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
                columns={invoiceColumns}
                rows={invoiceList}
                loading={isInvoiceLoading}
                deleting={false}
                rowCount={totalRowCount}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                showActionTitle
                actions
                showViewButton
                onView={onView}
                onCustomAction={handleUploadSlip}
                showCustomActionButton
                customActionTitle="Upload Slip"
                actionCriteria={uploadSlipStatusCriteria}
              />
            </Grid>
          </FormProvider>

          <InvoiceUploadModal
            selectedInvoice={selectedInvoice}
            modalHeading={labels.uploadInvoice}
            isOpen={shouldShowInvoiceUploadModal}
            handleAction={handleUploadModalAction}
          />
        </ContainerLayout>
      )}
    </Fragment>
  );
};
export default InvoiceManagement;
