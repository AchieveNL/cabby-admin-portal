import { useCallback, useState } from 'react';
import { requestPasswordReset, verifyOtp, loginUser } from './auth';
import { AxiosError } from 'axios';

// Hook for Requesting Password Reset
export const useRequestPasswordReset = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const requestReset = useCallback(async (email: string) => {
    setLoading(true);
    try {
      await requestPasswordReset(email);
    } catch (error) {
      setError(error as unknown as AxiosError);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, requestReset };
};

// Hook for Verifying OTP
export const useVerifyOtp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const verify = useCallback(async (email: string, otp: string) => {
    setLoading(true);
    try {
      await verifyOtp(email, otp);
    } catch (error) {
      setError(error as unknown as AxiosError);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, verify };
};

// Hook for Logging User In
export const useLogin = () => {
  const [data, setData] = useState<any | null>(null); // Replace 'any' with the expected shape of your user data
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await loginUser(email, password);
      setData(userData);
    } catch (error) {
      setError(error as unknown as AxiosError);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, login };
};
