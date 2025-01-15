/* eslint-disable no-nested-ternary */
/* eslint-disable id-length */
/* eslint-disable @typescript-eslint/dot-notation */
import moment from "moment";
import XLSX from "xlsx-js-style";

import { convertToTitleCase } from "~/core/utils/helper";

const logsListTitle = "Logs";
const logsListFileName = "LogsReport";
const invoiceListForAllAccountsTitle = "My Invoices";
const invoiceReportForAllFileName = "InvoiceList";
const sheetName = "Invoice Lists";
const logsSheetName = "Request Logs";
const paddingRow = [""];

const merge = [
  { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
  { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
  { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } },
];

const logsListHeader = [
  {
    v: "Transactions Date",
    t: "s",
    s: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "15416e" } },
      alignment: {
        vertical: "center",
      },
    },
  },
  {
    v: "Request Message",
    t: "s",
    s: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "15416e" } },
      alignment: {
        vertical: "center",
      },
    },
  },
  {
    v: "Response Message",
    t: "s",
    s: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "15416e" } },
      alignment: {
        vertical: "center",
      },
    },
  },
  {
    v: "Endpoint URL",
    t: "s",
    s: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "15416e" } },
      alignment: {
        vertical: "center",
      },
    },
  },
];

const invoiceListHeaders = [
  {
    v: "Invoice No",
    t: "s",
    s: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "15416e" } },
      alignment: {
        vertical: "center",
      },
    },
  },
  {
    v: "Sadad Invoice",
    t: "s",
    s: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "15416e" } },
      alignment: {
        vertical: "center",
      },
    },
  },
  {
    v: "Invoice Type",
    t: "s",
    s: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "15416e" } },
      alignment: {
        vertical: "center",
      },
    },
  },
  {
    v: "Package Name",
    t: "s",
    s: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "15416e" } },
      alignment: {
        vertical: "center",
      },
    },
  },
  {
    v: "Account Name",
    t: "s",
    s: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "15416e" } },
      alignment: {
        vertical: "center",
      },
    },
  },
  {
    v: "Sub Account Name",
    t: "s",
    s: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "15416e" } },
      alignment: {
        vertical: "center",
      },
    },
  },
  {
    v: "Amount",
    t: "s",
    s: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "15416e" } },
      alignment: {
        vertical: "center",
      },
    },
  },
  {
    v: "Invoice Issue Date",
    t: "s",
    s: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "15416e" } },
      alignment: {
        vertical: "center",
      },
    },
  },
  {
    v: "Status",
    t: "s",
    s: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "15416e" } },
      alignment: {
        vertical: "center",
      },
    },
  },
];

const createTitleRow = (data: any[]) => {
  return data.map((value) => {
    return {
      v: value,
      t: "s",
      s: {
        font: { bold: true, color: { rgb: "15416e" }, sz: 18 },
        alignment: {
          vertical: "center",
          horizontal: "center",
        },
      },
    };
  });
};

const getRowHeight = (data: any) => {
  return data.map(() => {
    return { hpt: 30 };
  });
};

const getColumnWidth = (data: any) => {
  return data.map(() => {
    return { wch: 30 };
  });
};

const mapAndUpdateInvoiceList = (invoiceArray: any[]): any[] => {
  let isAlternate = true;
  return invoiceArray.map((obj) => {
    const updatedInvoiceNumber = obj.invoiceNumber;
    const updatedSadadInvoiceNumber = obj.sadadInvoiceNumber;
    const updatedInvoiceType = convertToTitleCase(obj.invoiceType);
    const updatedPackageName = obj.packageName;
    const updatedAccountName = obj.accountName;
    const updatedSubAccountName = obj.subAccountName;
    const updatedAmount = `${obj.amount} SAR`;
    const updatedDueDate = moment(obj.dueDate).format("YYYY-MM-DD");
    const updatedInvoiceStatus = convertToTitleCase(obj.invoiceStatus);

    const mappedObject = {
      updatedInvoiceNumber,
      updatedSadadInvoiceNumber,
      updatedInvoiceType,
      updatedPackageName,
      updatedAccountName,
      updatedSubAccountName,
      updatedAmount,
      updatedDueDate,
      updatedInvoiceStatus,
    };
    const fillRgb = isAlternate ? "F5F5F5" : "FFFFFF";
    isAlternate = !isAlternate;
    const customObjects = Object.values(mappedObject).map((value) => ({
      v: value,
      t: "s",
      s: {
        font: { bold: false },
        fill: { fgColor: { rgb: fillRgb } },
        alignment: {
          vertical: "center",
        },
      },
    }));
    return customObjects;
  });
};

export const createInvoiceListExcelReport = (data: any) => {
  const workBook = XLSX.utils.book_new();
  const headerArray = [
    paddingRow,
    createTitleRow([invoiceListForAllAccountsTitle]),
    paddingRow,
    invoiceListHeaders,
  ];
  const dataArray = headerArray.concat(mapAndUpdateInvoiceList(data));
  const worksheet = XLSX.utils.aoa_to_sheet(dataArray);
  worksheet["!cols"] = getColumnWidth(dataArray);
  worksheet["!rows"] = getRowHeight(dataArray);
  worksheet["!merges"] = merge;
  XLSX.utils.book_append_sheet(workBook, worksheet, sheetName);
  XLSX.writeFile(workBook, `${invoiceReportForAllFileName}.xlsx`);
};

const mapAndUpdateLogsList = (logsList: any[]): any[] => {
  let isAlternate = true;
  return logsList.map((obj) => {
    const updatedTransactionDate = obj.transactionDate;
    const updatedRequestText = obj.requestText;
    const updatedResponseText = obj.responseText;
    const updatedURL = obj.url;

    const mappedObject = {
      updatedTransactionDate,
      updatedRequestText,
      updatedResponseText,
      updatedURL,
    };
    const fillRgb = isAlternate ? "F5F5F5" : "FFFFFF";
    isAlternate = !isAlternate;
    const customObjects = Object.values(mappedObject).map((value) => ({
      v: value,
      t: "s",
      s: {
        font: { bold: false },
        fill: { fgColor: { rgb: fillRgb } },
        alignment: {
          vertical: "center",
        },
      },
    }));
    return customObjects;
  });
};

export const createLogsExcelReport = (data: any) => {
  const workBook = XLSX.utils.book_new();
  const headerArray = [
    paddingRow,
    createTitleRow([logsListTitle]),
    paddingRow,
    logsListHeader,
  ];
  const dataArray = headerArray.concat(mapAndUpdateLogsList(data));
  const worksheet = XLSX.utils.aoa_to_sheet(dataArray);
  worksheet["!cols"] = getColumnWidth(dataArray);
  worksheet["!rows"] = getRowHeight(dataArray);
  worksheet["!merges"] = merge;
  XLSX.utils.book_append_sheet(workBook, worksheet, logsSheetName);
  XLSX.writeFile(workBook, `${logsListFileName}.xlsx`);
};
