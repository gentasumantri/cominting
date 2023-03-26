export const isEmptyObj = (obj) => {
  return Object.keys(obj).length === 0;
};

export const isValidDate = (date) => {
  if (Object.prototype.toString.call(date) === '[object Date]') {
    return !isNaN(date);
  }

  return false;
};

export const formatDatetime = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  date = new Date(date);
  date = isValidDate(date) ? date : new Date(0);

  return date.toLocaleDateString('en-ID', options);
};

export const proposalHelper = (proposal, userAddress) => {
  const idx = proposal.contributors?.indexOf((obj) => obj.wallet === userAddress);

  const isApprovedByUser = !idx || idx === -1 ? false : proposal.contributors[idx].status === 1;

  const isContributor = !idx || idx === -1;

  const isOwner = proposal.creatorAddress === userAddress;

  const isFormEditable = isOwner && proposal.status === 1;

  return {
    isApprovedByUser: isApprovedByUser,
    isContributor: isContributor,
    isOwner: isOwner,
    isFormEditable: isFormEditable,
  };
};
