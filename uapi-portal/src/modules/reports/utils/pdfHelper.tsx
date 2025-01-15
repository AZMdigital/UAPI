/* eslint-disable @typescript-eslint/naming-convention */
import autoTable from "jspdf-autotable";
import moment from "moment";

import { ConsumptionAccountType } from "~/rest/models/reports";

import { truncateString } from "~/modules/reports/utils/helper";

const logsReportTitle = "Log Report";
const LogsReportFileName = "LogsReport";
const consumptionReportForOneAccountFileName = "ConsumptionReport_";

const consumptionDetailHeader = [
  [
    "Service",
    "Success Transactions",
    "Failure Transactions",
    "Total Transactions",
    "Due Month",
  ],
];

const logsReportHeader = [
  ["Transactions Date", "Request Message", "Response Message", "Endpoint URL"],
];

const headerImageUrl = "/assets/logo.png";
const footerImageUrl = "/assets/azmlogo.png";

const addHeader = (doc: any, title: string) => {
  const pageWidth =
    doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

  // Add Header Image
  const headerImage = new Image();
  headerImage.src = headerImageUrl;
  doc.addImage(headerImage, "PNG", 5, 5, 33, 24);

  // Add title of the report in main color
  doc.setFont("helvetica", "normal");
  doc.setFontSize(18);
  doc.setTextColor(21, 65, 110);
  doc.text(title, pageWidth / 2, 39, { align: "center" });

  // Add divider line
  doc.line(0, 48, pageWidth, 48);
};

const drawCell = (data: any): void => {
  const { doc } = data;
  const rows = data.table.body;

  if (rows.length === 1) {
    // Handle the case when there's only one row if needed
  } else if (data.row.index === rows.length - 1) {
    doc.setFillColor(212, 212, 211);
  }
};

const addFooterImage = (doc: any, centerX: number) => {
  const footerImage = new Image();
  footerImage.src = footerImageUrl;
  doc.addImage(footerImage, "PNG", centerX, 288, 6, 8);
};

const addFooters = (doc: any) => {
  const pageCount = doc.internal.getNumberOfPages();
  const pageWidth =
    doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

  for (let index = 1; index <= pageCount; index++) {
    doc.setPage(index);

    // Page number on footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text(
      `Page ${String(index)} of ${String(pageCount)}`,
      doc.internal.pageSize.width / 2,
      283,
      {
        align: "center",
      }
    );
    // Footer main color border
    doc.setDrawColor(0);
    doc.setFillColor(21, 65, 110);
    doc.rect(0, 287, pageWidth, 30, "F");

    // adding footer logo
    addFooterImage(doc, doc.internal.pageSize.width / 2);
  }
};

const convertConsumptionDetailData = (
  data: ConsumptionAccountType[]
): any[][] =>
  data.map((obj) =>
    Object.entries(obj)
      .filter(
        ([key]) =>
          key !== "year" &&
          key !== "id" &&
          key !== "serviceCode" &&
          key !== "totalAmount"
      )
      .map(([key, value]) => {
        if (value === null || value === undefined) {
          return "";
        } else if (key === "dueMonth") {
          return `${moment(value, "MM").format("MMMM")}`;
        }
        return value;
      })
  );

const convertLogsReportData = (data: any[]): any[][] =>
  data.map((obj) =>
    Object.entries(obj)
      .filter(([key]) => key !== "id" && key !== "service")
      .map(([key, value]) => {
        if (value === null || value === undefined) {
          return "";
        } else if (key === "requestText") {
          return truncateString(value as string, 90);
        } else if (key === "responseText") {
          return truncateString(value as string, 90);
        } else if (key === "url") {
          return truncateString(value as string, 90);
        }
        return value;
      })
  );

export const createLogsReport = (doc: any, data: any) => {
  // Add Header first
  addHeader(doc, logsReportTitle);
  // Data Table
  autoTable(doc, {
    head: logsReportHeader,
    body: convertLogsReportData(data),
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: "linebreak",
    },
    bodyStyles: {
      minCellHeight: 10,
      valign: "middle",
    },
    headStyles: {
      fillColor: [21, 65, 110],
      minCellHeight: 12,
      valign: "middle",
    },
    startY: 55,
    rowPageBreak: "avoid",
  });

  // Add footer
  addFooters(doc);

  // Save the document
  doc.save(`${LogsReportFileName}.pdf`);
};

export const createConsumptionDetailReport = (
  doc: any,
  data: any,
  accountName: string,
  title: string
) => {
  // Add Header before table
  addHeader(doc, title + accountName);

  // Data Table
  autoTable(doc, {
    head: consumptionDetailHeader,
    body: convertConsumptionDetailData(data),
    bodyStyles: {
      minCellHeight: 10,
      valign: "middle",
    },
    headStyles: {
      fillColor: [21, 65, 110],
      minCellHeight: 12,
      valign: "middle",
    },
    startY: 55,
    rowPageBreak: "avoid",
    willDrawCell: drawCell,
  });

  // Add footer
  addFooters(doc);

  // Save the document (move saving outside `addHeader`)
  doc.save(`${consumptionReportForOneAccountFileName + accountName}.pdf`);
};
