// useDamageReport.ts (if you're using TypeScript, otherwise use .js)
import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { getDamageReportsByStatus } from './damage-reports';
import { DamageReportResponse, ReportStatus } from './types';

export const useDamageReport = (status: ReportStatus) => {
  const [data, setData] = useState<DamageReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = async () => {
    try {
      const reportsData = await getDamageReportsByStatus(status);
      setData(reportsData);
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, refetch: fetchData };
};
