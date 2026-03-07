import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/config';

interface Product {
  id: string;
  internalCode: string;
  description: string;
  quantity: number;
  unit: string;
  totalWeight?: number;
  totalVolume?: number;
  currentLocation?: string;
  status: string;
  supplierId?: string;
  supplier?: {
    id: string;
    name: string;
    nif: string;
  };
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateProductDto {
  internalCode: string;
  description: string;
  quantity: number;
  unit: string;
  totalWeight?: number;
  totalVolume?: number;
  currentLocation?: string;
  supplierId?: string;
  observations?: string;
}

interface UpdateProductStatusDto {
  newStatus: string;
  quantity?: number;
  location?: string;
  reason?: string;
}

export function useProducts(filters?: { status?: string; supplierId?: string; search?: string }) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const response = await apiClient.get<Product[]>('/products', { params: filters });
      return response.data;
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const response = await apiClient.get<Product>(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useProductWithMovements(id: string) {
  return useQuery({
    queryKey: ['products', id, 'movements'],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${id}/movements`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useProductStats() {
  return useQuery({
    queryKey: ['products', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/products/stats');
      return response.data;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductDto) => {
      const response = await apiClient.post<Product>('/products', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateProductDto> }) => {
      const response = await apiClient.patch<Product>(`/products/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
    },
  });
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductStatusDto }) => {
      const response = await apiClient.patch<Product>(`/products/${id}/status`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}