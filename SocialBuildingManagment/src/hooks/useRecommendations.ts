import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRecommendations, getRecommendation, createRecommendation } from '@/services/recommendations';
import { CreateRecommendationData } from '@/models/recommendation';

export function useRecommendationsQuery(category?: string, sort?: string) {
  return useInfiniteQuery({
    queryKey: ['recommendations', { category, sort }],
    queryFn: ({ pageParam = 1 }) => getRecommendations({ category, sort, page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return nextPage * lastPage.limit < lastPage.total ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
}

export function useRecommendationQuery(id: string) {
  return useQuery({
    queryKey: ['recommendations', id],
    queryFn: () => getRecommendation(id),
    enabled: !!id,
  });
}

export function useCreateRecommendation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRecommendationData) => createRecommendation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
}
