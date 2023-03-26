import Image from 'next/image';
import Link from 'next/link';

const ProposalCard = ({ proposal }) => {
  return (
    <div className="col-lg-4 mb-5 d-flex align-items-stretch">
      <Link href={`/proposal/${proposal._id}`} passHref>
        <a className="card">
          <div className="product-wrapper d-flex flex-column">
            <div className="card-img">
              <Image
                src="/img/img1.jpg"
                layout="responsive"
                width={220}
                height={200}
                alt="image alt caption"
              />
            </div>
            <h5 className="card-title">{proposal.nftName}</h5>
            <p className="card-desc exc">{proposal.description}</p>
            <div className="mt-auto">
              <div className="mb-3">
                <p className="card-desc">{proposal.contributors.length} Owner</p>
                <span className="badge rounded-pill bg-danger badge-large">
                  {proposal.status} - need
                </span>
              </div>
              <button className="btn btn-primary btn-gradientone btn-sm">Detail</button>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default ProposalCard;
