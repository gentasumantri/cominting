import { NextSeo } from 'next-seo';
import Navbar from '../../src/components/Navbar';
import ProposalForm from '../../src/components/proposal/Form';
import { siweServer } from 'libs/siweServer';
import { useAccount } from 'wagmi';
import { useModal } from 'connectkit';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRef } from 'react';

export const ProposalPage = ({ proposal }) => {
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
    if (!timelineLoaded.current && !isConnected) {
      myModal.setOpen(true);
    }
    timelineLoaded.current = true;
  });

  return (
    <div>
      <NextSeo title="Create Proposal" description="Create Proposal" />
      <Navbar></Navbar>
      <section className="section-headpage">
        <div className="container text-center">
          <h1 className="title-page">Create Proposal</h1>
        </div>
      </section>
      <ProposalForm proposal={proposal} address={address}></ProposalForm>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const { req, res } = context;

  try {
    const { address } = await siweServer.getSession(req, res);

    const proposal = {
      _id: null,
      status: 0,
      creatorAddress: address,
      contributors: [
        { email: '', wallet: address, share: 0 },
      ],
    };

    return {
      props: { proposal: JSON.stringify(proposal) },
    };
  } catch (e) {
    console.error(e);
  }
};

export default ProposalPage;
