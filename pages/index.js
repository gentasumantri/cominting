import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Navbar from '../src/components/Navbar';
import { useProposals } from 'hooks/proposal';
import ProposalCard from 'components/proposal/Card';

const Home = () => {
  const { proposals, isLoading, error } = useProposals(0, 100);

  if (isLoading) return 'loading...';
  if (error) return error;

  return (
    <div>
      <NextSeo title="Homepage" description="Homepage" />
      <Navbar></Navbar>
      <section className="section-heropage">
        <div className="container">
          <div className="herowrapper">
            <div className="herocontainer">
              <h2>CoMinting</h2>
              <p>Win-win collaboration for mutual benefits</p>
              <Link as="create-your-proposal" href="/proposal/create">
                <a href="createproposal.php" className="btn btn-primary">
                  Create Proposal
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section-headpage">
        <div className="container text-center">
          <h1 className="title-page">Gallery CoMinting</h1>
        </div>
      </section>
      <section className="section section-gallerylist">
        <div className="container">
          <div className="row justify-content-center">
            {proposals?.map((proposal) => (
              <ProposalCard key={proposal._id} proposal={proposal}></ProposalCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
