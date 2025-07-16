"use client";

import { StoreOwnerRequests } from "@/lib_dashboard/services/store_owner_request";
import {
  storeOwnerRequestsDataAtom,
  storeOwnerRequestsLoadingAtom,
  storeOwnerRequestsPaginationAtom,
} from "@/lib_dashboard/store/store_owner_request-store";

import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

export const useStoreRequests = () => {
  const [isLoading, setIsLoading] = useAtom(storeOwnerRequestsLoadingAtom);
  const [requests, setRequests] = useAtom(storeOwnerRequestsDataAtom);
  const [pagination, setPagination] = useAtom(storeOwnerRequestsPaginationAtom);
  // Fetch requests
  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await StoreOwnerRequests.getStoreOwnerRequests();
      setRequests(response.data);
      setPagination({
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (error) {
      console.error("Failed to fetch store owner requests:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setRequests, setPagination, setIsLoading]);

  // Auto-fetch when filters change
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    loading: isLoading,
    pagination,
    fetchRequests,
  };
};
