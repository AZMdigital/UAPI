/* eslint-disable @typescript-eslint/naming-convention */
import autoTable from "jspdf-autotable";
import moment from "moment";

const callbackLogsListHeader = [["Service Name", "Created At"]];

const headerImageUrl = "/assets/logo.png";
const footerImageUrl = "/assets/azmlogo.png";

const callbackLogsFileName = "CallbackLogsReport.pdf";
const callbackLogsTitle = "Callback Logs Report";

const addFooterImage = (doc: any, centerX: number) => {
  const footerImage = new Image();
  footerImage.src = footerImageUrl;
  doc.addImage(footerImage, "PNG", centerX, 288, 6, 8);
};

const addHeader = async (doc: any, title: string, fileName: string) => {
  // SetPage
  doc.setPage(1);
  const pageWidth =
    doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

  // Add Header Image
  const headerImage = new Image();
  headerImage.src = headerImageUrl;
  headerImage.onload = () => {
    doc.addImage(headerImage, "PNG", 5, 5, 33, 24);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.setTextColor(21, 65, 110);
    doc.text(title, pageWidth / 2, 39, { align: "center" });

    doc.line(0, 48, pageWidth, 48);
    doc.save(fileName);
  };
};

const addFooters = async (doc: any) => {
  const pageCount = doc.internal.getNumberOfPages();
  const pageWidth =
    doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

  for (let index = 1; index <= pageCount; index++) {
    doc.setPage(index);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text(`Page ${index} of ${pageCount}`, pageWidth / 2, 283, {
      align: "center",
    });

    doc.setDrawColor(0);
    doc.setFillColor(21, 65, 110);
    doc.rect(0, 287, pageWidth, 30, "F");

    addFooterImage(doc, pageWidth / 2);
  }
};

export const getFormattedDate = (date: string) => {
  return moment(date).format("YYYY-MM-DD");
};

const convertCallbackLogsData = (data: any) => {
  return data.map((obj: any) => {
    return [obj.serviceName, obj.createdAt];
  });
};

export const createCallbackLogsReport = (doc: any, data: any) => {
  const pageWidth =
    doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

  autoTable(doc, {
    head: callbackLogsListHeader,
    body: convertCallbackLogsData(data),
    startY: 55,
    margin: { left: (pageWidth - 200) / 2, right: (pageWidth - 200) / 2 },
    rowPageBreak: "auto",
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 100 },
    },
    bodyStyles: {
      minCellHeight: 15,
      valign: "middle",
    },
    headStyles: {
      fillColor: [21, 65, 110],
      textColor: [255, 255, 255],
      fontSize: 14,
      minCellHeight: 15,
      valign: "middle",
    },
    styles: {
      overflow: "linebreak",
      fontSize: 12,
    },
  });

  addFooters(doc);
  addHeader(doc, callbackLogsTitle, callbackLogsFileName);
};
