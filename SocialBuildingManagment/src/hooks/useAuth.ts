import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { login, register, logout, getMe, LoginData, RegisterData } from '@/services/auth';
import { getToken } from '@/services/api';
import { useEffect, useState } from 'react';

export function useAuth() {
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    getToken().then((token) => setHasToken(!!token));
  }, []);

  const userQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: getMe,
    enabled: hasToken === true,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => login(data),
    onSuccess: () => {
      setHasToken(true);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => register(data),
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setHasToken(false);
      queryClient.clear();
    },
  });

  return {
    user: userQuery.data,
    isAuthenticated: hasToken === true && !!userQuery.data,
    isLoading: hasToken === null || (hasToken && userQuery.isLoading),
    loginMutation,
    registerMutation,
    logoutMutation,
  };
}
