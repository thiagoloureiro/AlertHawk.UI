export const getMetricName = (
  metricKey:
    | "uptime1Hr"
    | "uptime24Hrs"
    | "uptime7Days"
    | "uptime30Days"
    | "uptime3Months"
    | "uptime6Months"
): string => {
  switch (metricKey) {
    case "uptime1Hr":
      return "1 Hours";
    case "uptime24Hrs":
      return "24 Hours";
    case "uptime7Days":
      return "7 Days";
    case "uptime30Days":
      return "30 Days";
    case "uptime3Months":
      return "3 Months";
    case "uptime6Months":
      return "6 Months";
    default:
      return "";
  }
};
