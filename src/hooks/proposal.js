import useSWR from 'swr';

export const useProposals = (startIndex, dataPerPage) => {
  const { data, error, isLoading } = useSWR(
    `/api/proposal?startIndex=${startIndex}&limit=${dataPerPage}`
  );

  return {
    proposals: data?.data,
    count: data?.count,
    isLoading,
    error: error,
  };
};

export const useProposal = (id) => {
  const { data, error, isLoading } = useSWR(`/api/proposal/${id}`);

  return {
    proposal: data?.data,
    isLoading,
    isError: error,
  };
};
