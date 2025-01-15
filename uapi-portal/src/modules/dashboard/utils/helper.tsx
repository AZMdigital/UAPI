/* eslint-disable id-length */
import { convertToTitleCase } from "~/core/utils/helper";

export const annualPackage = "ANNUAL";
export const serviceBundelPackage = "SERVICES";

export const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      color: "white",
      font: {
        weight: "bold" as const,
        size: 14,
      },
    },
    tooltip: {
      callbacks: {
        title() {
          return "";
        },
        label(context: any) {
          const label = context.label || "";
          const value = context.raw;
          const alteredLabel = label.replace(/,/g, "");
          return `${alteredLabel}: ${value}`;
        },
      },
    },
  },
};

export const doughnetChartOptions: any = {
  cutout: "65%",
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 15,
  },
  plugins: {
    datalabels: {
      display: false,
    },
    legend: {
      position: "right" as const,
      labels: {
        usePointStyle: true,
        padding: 10,
      },
      onClick: null,
    },
  },
  elements: {
    arc: {
      borderWidth: 2, // Ensures the connecting lines are visible
    },
  },
};

export const pieLabelsLine = {
  id: "pieLabelsLine",
  afterDraw(chart: any) {
    const {
      ctx,
      chartArea: { width, height },
    } = chart;

    chart.data.datasets.forEach((dataset: any, index: number) => {
      chart
        .getDatasetMeta(index)
        .data.forEach((datapoint: any, index: number) => {
          const { x, y } = datapoint.tooltipPosition();

          const halfwidth = width / 2;
          const halfheight = height / 2;

          const xLine = x >= halfwidth ? x + 15 : x - 15;
          const yLine = y >= halfheight ? y + 15 : y - 15;
          const extraLine = x >= halfwidth ? 15 : -15;

          // Draw connecting line
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(xLine, yLine);
          ctx.lineTo(xLine + extraLine, yLine);
          ctx.strokeStyle = dataset.borderColor[index];
          ctx.stroke();

          // text
          ctx.font = "bold 12px Arial";
          const textPosition = x >= halfwidth ? "left" : "right";
          const plusFivePx = x >= halfwidth ? 5 : -5;
          ctx.textAlign = textPosition;
          ctx.textBaseLine = "middle";
          ctx.fillStyle = dataset.borderColor[index];
          ctx.fillText(
            chart.data.datasets[0].data[index],
            xLine + extraLine + plusFivePx,
            yLine
          );
        });
    });
  },
};

const truncateStringPreserveWords = (
  input: string,
  maxLength: number
): string[] => {
  const result: string[] = [];
  const words = input.split(" "); // Split the input into words

  let currentChunk = "";

  words.forEach((word) => {
    // Check if adding this word would exceed the maxLength
    if ((currentChunk + word).length + 1 <= maxLength) {
      // Add the word to the current chunk
      currentChunk += (currentChunk ? " " : "") + word;
    } else {
      // Push the current chunk to the result array
      result.push(currentChunk);
      // Start a new chunk with the current word
      currentChunk = word;
    }
  });

  // Add the last chunk to the result array if it's not empty
  if (currentChunk) {
    result.push(currentChunk);
  }

  return result;
};

export const getComsumedServicesData = (input: any[]): any[] => {
  const colors = [
    "rgba(211, 47, 47, 1)",
    "rgba(245, 124, 0, 1)",
    "rgba(255, 183, 77, 1)",
    "rgba(255, 160, 0, 1)",
    "rgba(255, 235, 59, 1)",
    "rgba(251, 192, 45, 1)",
    "rgba(255, 112, 67, 1)",
    "rgba(134, 188, 182, 1)",
    "rgba(176, 122, 161, 1)",
    "rgba(186, 176, 172, 1)",
    "rgba(78, 121, 167, 1)",
    "rgba(204, 121, 167, 1)",
  ];

  return input.map((item, index) => ({
    label: truncateStringPreserveWords(
      convertToTitleCase(item.serviceName),
      15
    ),
    value: item.noOfHits,
    color: colors[index % colors.length],
    cutout: "50%",
  }));
};

export const getInvoicesDataByStatus = (input: any[]): any[] => {
  const colors = [
    "rgba(0, 186, 190, 1)",
    "rgba(19, 65, 111, 1)",
    "rgba(15, 104, 169,1)",
  ];

  return input.map((item, index) => ({
    label: convertToTitleCase(item.invoiceStatus),
    value: item.noOfInvoices,
    color: colors[index % colors.length],
  }));
};
