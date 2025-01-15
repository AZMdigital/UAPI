/* eslint-disable no-nested-ternary */
/* eslint-disable id-length */
/* eslint-disable @typescript-eslint/dot-notation */
import XLSX from "xlsx-js-style";

const callbackLogsTitle = "Callback Logs Report";
const callbackLogsFileName = "CallbackLogsReport";
const sheetName = "Callback Logs";
const paddingRow = [""];

const merge = [
  { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
  { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
  { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } },
];

const callbackLogsListHeader = [
  {
    v: "Service Name",
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
    v: "Created At",
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

const mapAndUpdateCallbackLogsList = (callbackLogsArray: any[]): any[] => {
  let isAlternate = true;
  return callbackLogsArray.map((obj) => {
    const { serviceName, createdAt } = obj;

    const mappedObject = {
      serviceName,
      createdAt,
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

export const createCallbackLogsExcelReport = (data: any) => {
  const workBook = XLSX.utils.book_new();
  const headerArray = [
    paddingRow,
    createTitleRow([callbackLogsTitle]),
    paddingRow,
    callbackLogsListHeader,
  ];
  const dataArray = headerArray.concat(mapAndUpdateCallbackLogsList(data));
  const worksheet = XLSX.utils.aoa_to_sheet(dataArray);
  worksheet["!cols"] = getColumnWidth(dataArray);
  worksheet["!rows"] = getRowHeight(dataArray);
  worksheet["!merges"] = merge;
  XLSX.utils.book_append_sheet(workBook, worksheet, sheetName);
  XLSX.writeFile(workBook, `${callbackLogsFileName}.xlsx`);
};
