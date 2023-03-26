import { NextSeo } from 'next-seo';
import { getProposalById } from '../api/proposal';
import { isEmptyObj } from '../../src/libs/other';
import Navbar from '../../src/components/Navbar';
import ProposalForm from '../../src/components/proposal/Form';
import { siweServer } from 'libs/siweServer';
import { useAccount } from 'wagmi';
import { useModal } from 'connectkit';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRef } from 'react';

export const ProposalPage = ({ proposal, title }) => {
  proposal = JSON.parse(proposal);

  const timelineLoaded = useRef(false);
  const router = useRouter();
  const myModal = useModal();

  const { address, isConnected } = useAccount({
    onDisconnect() {
      router.reload();
    },
  });

  useEffect(() => {
    if (!timelineLoaded.current && !isConnected) myModal.setOpen();
    timelineLoaded.current = true;
  });

  return (
    <div>
      <NextSeo title={title} description={`Proposal Detail of ${proposal?.nftName}`} />
      <Navbar></Navbar>
      <ProposalForm proposal={proposal} address={address}></ProposalForm>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const { params } = context;
  const pid = params.pid;

  try {
    const { address } = await siweServer.getSession(req, res);
    const result = await getProposalById(pid);

    const title = isEmptyObj(result.data)
      ? 'Unknown Proposal'
      : 'Proposal of ' + result.data.nftName;

    return {
      props: {
        proposal: JSON.stringify(result.data),
        title: title,
        address: address === undefined ? '' : address,
      },
    };
  } catch (e) {
    console.error(e);
  }
};

export default ProposalPage;
