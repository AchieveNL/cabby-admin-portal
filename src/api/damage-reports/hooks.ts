// useDamageReport.ts (if you're using TypeScript, otherwise use .js)
import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import {
  getDamageReportsById,
  getDamageReportsByStatus,
} from './damage-reports';
import {
  DamageReportDetailsResponse,
  DamageReportResponse,
  ReportStatus,
} from './types';

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

export const useDamageReportDetails = (id: string) => {
  const [data, setData] = useState<DamageReportDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = async () => {
    try {
      const reportsData = await getDamageReportsById(id);
      setData(reportsData);
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { data, loading, error, refetch: fetchData };
};
