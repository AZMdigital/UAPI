import autoTable from "jspdf-autotable";
import moment from "moment";

const auditLogsListHeader = [
  ["Account", "User Name", "Modules", "Activity", "Activity Date/Time"],
];

const headerImageUrl = "/assets/logo.png";
const footerImageUrl = "/assets/azmlogo.png";

const auditLogsFileName = "AuditLogsReport.pdf";
const auditLogsTitle = "Audit Logs Report";

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

    // Add title of the report in main color
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.setTextColor(21, 65, 110);
    doc.text(title, pageWidth / 2, 39, {
      align: "center",
    });

    // Add divider line
    doc.line(0, 48, pageWidth, 48);

    // Save the doc after adding everything
    doc.save(fileName);
  };
};

const addFooters = async (doc: any) => {
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

export const getFormattedDate = (date: string) => {
  return moment(date).format("YYYY-MM-DD");
};

const convertAuditLogsData = (data: any) => {
  return data.map((obj: any) => {
    return [
      obj.updatedCompanyName,
      obj.updatedByUserName,
      obj.moduleName,
      obj.description,
      obj.date,
    ];
  });
};

export const createAuditLogsReport = async (doc: any, data: any) => {
  // Data Table
  await autoTable(doc, {
    head: auditLogsListHeader,
    body: convertAuditLogsData(data),
    bodyStyles: {
      minCellHeight: 12,
      valign: "middle",
      fontSize: 10,
    },
    headStyles: {
      fillColor: [21, 65, 110],
      minCellHeight: 12,
      cellWidth: 35,
      valign: "middle",
    },
    startY: 55,
    rowPageBreak: "avoid",
  });

  // Add footer
  await addFooters(doc);

  // Add  Header
  await addHeader(doc, auditLogsTitle, auditLogsFileName);
};
