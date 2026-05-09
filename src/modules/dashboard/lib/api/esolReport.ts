import { toast } from "sonner";
import { axios } from "../../../../lib/network/axios";

export const downloadIlrCsv = async (params: {
  orgId: string;
  periodStart: string;
  periodEnd: string;
}) => {
  try {
    const qs = new URLSearchParams(params).toString();
    const response = await axios.get(`/esol/reports/ilr?${qs}`, {
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Try to extract filename from content-disposition header
    const disposition = response.headers["content-disposition"];
    const match = disposition?.match(/filename="?([^";]+)"?/);
    link.download = match?.[1] ?? "ilr-report.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    toast.success("Report downloaded");
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to download report");
  }
};
