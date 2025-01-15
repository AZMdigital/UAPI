/* eslint-disable no-nested-ternary */
/* eslint-disable id-length */
/* eslint-disable @typescript-eslint/dot-notation */
import XLSX from "xlsx-js-style";

const auditLogsTitle = "Audit Logs Report";
const auditLogsFileName = "AuditLogsReport";
const sheetName = "Audit Logs";
const paddingRow = [""];

const merge = [
  { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
  { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
  { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } },
];

const auditLogsListHeader = [
  {
    v: "Account",
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
    v: "User Name",
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
    v: "Modules",
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
    v: "Activity",
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
    v: "Activity Date/Time",
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

const mapAndUpdateAuditLogsList = (auditLogsArray: any[]): any[] => {
  let isAlternate = true;
  return auditLogsArray.map((obj) => {
    const updatedAccount = obj.updatedCompanyName;
    const updatedUserName = obj.updatedByUserName;
    const updatedModuleName = obj.moduleName;
    const updateDescription = obj.description;
    const updatedDate = obj.date;

    const mappedObject = {
      updatedAccount,
      updatedUserName,
      updatedModuleName,
      updateDescription,
      updatedDate,
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

export const createAuditLogsExcelReport = (data: any) => {
  const workBook = XLSX.utils.book_new();
  const headerArray = [
    paddingRow,
    createTitleRow([auditLogsTitle]),
    paddingRow,
    auditLogsListHeader,
  ];
  const dataArray = headerArray.concat(mapAndUpdateAuditLogsList(data));
  const worksheet = XLSX.utils.aoa_to_sheet(dataArray);
  worksheet["!cols"] = getColumnWidth(dataArray);
  worksheet["!rows"] = getRowHeight(dataArray);
  worksheet["!merges"] = merge;
  XLSX.utils.book_append_sheet(workBook, worksheet, sheetName);
  XLSX.writeFile(workBook, `${auditLogsFileName}.xlsx`);
};
