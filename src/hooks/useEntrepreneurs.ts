import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEntrepreneurs, getEntrepreneur, createEntrepreneurProfile, updateEntrepreneurProfile, deleteEntrepreneurProfile } from '@/services/entrepreneurs';
import { CreateEntrepreneurData } from '@/models/entrepreneur';

export function useEntrepreneursQuery(category?: string) {
  return useInfiniteQuery({
    queryKey: ['entrepreneurs', { category }],
    queryFn: ({ pageParam = 1 }) => getEntrepreneurs({ category, page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return nextPage * lastPage.limit < lastPage.total ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
}

export function useEntrepreneurQuery(id: string) {
  return useQuery({
    queryKey: ['entrepreneurs', id],
    queryFn: () => getEntrepreneur(id),
    enabled: !!id,
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEntrepreneurData) => createEntrepreneurProfile(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entrepreneurs'] }),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEntrepreneurData> }) => updateEntrepreneurProfile(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entrepreneurs'] }),
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEntrepreneurProfile(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entrepreneurs'] }),
  });
}
