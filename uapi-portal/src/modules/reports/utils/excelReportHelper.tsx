/* eslint-disable no-nested-ternary */
/* eslint-disable id-length */
/* eslint-disable @typescript-eslint/dot-notation */
import moment from "moment";
import XLSX from "xlsx-js-style";

import { ConsumptionAccountType } from "~/rest/models/reports";
/* eslint-disable @typescript-eslint/naming-convention */

const consumptionReportForOneAccountFileName = "ConsumptionReport_";

const paddingRow = [""];

const merge = [
  { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
  { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
];

const consumptionDetailHeader = [
  {
    v: "Service",
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
    v: "Success Transactions",
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
    v: "Failure Transactions",
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
    v: "Total Transactions",
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
    v: "Due Month",
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

const getDueMonth = (month: number) => {
  if (month !== -1) {
    return moment()
      .month(month - 1)
      .format("MMMM");
  } else {
    return "";
  }
};

const convertConsumptionDetailData = (
  data: ConsumptionAccountType[]
): any[] => {
  let isAlternate = true;
  return data.map(
    (
      {
        serviceName,
        successTransaction,
        failedTransactions,
        totalTransactions,
        dueMonth,
      },
      index,
      array
    ) => {
      const updatedDueMonth = getDueMonth(dueMonth!);
      const mappedObject = {
        serviceName,
        successTransaction,
        failedTransactions,
        totalTransactions,
        updatedDueMonth,
      };
      const fillRgb =
        index === array.length - 1
          ? "D4D4D3"
          : index % 2 === 0
          ? "F5F5F5"
          : "FFFFFF";
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
    }
  );
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

export const createConsumptionDetailExeclReport = (
  data: any,
  accountName: string,
  title: string
) => {
  const workBook = XLSX.utils.book_new();
  const headerArray = [
    paddingRow,
    createTitleRow([title + accountName]),
    paddingRow,
    consumptionDetailHeader,
  ];
  const dataArray = headerArray.concat(convertConsumptionDetailData(data));
  const worksheet = XLSX.utils.aoa_to_sheet(dataArray);
  worksheet["!cols"] = getColumnWidth(dataArray);
  worksheet["!rows"] = getRowHeight(dataArray);
  worksheet["!merges"] = merge;
  XLSX.utils.book_append_sheet(workBook, worksheet, accountName);
  XLSX.writeFile(
    workBook,
    `${consumptionReportForOneAccountFileName + accountName}.xlsx`
  );
};
