import { useRouter } from 'next/router';
import { ConnectKitButton } from 'connectkit';
import Link from 'next/link';

export const Navbar = () => {
  const router = useRouter();

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top navbar-light bg-light"
      aria-label="Main navigation">
      <div className="container">
        <Link href="/">
          <a className="navbar-brand">CoMinting</a>
        </Link>
        <button
          className="navbar-toggler p-0 border-0"
          type="button"
          id="navbarSideCollapse"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="navbar-collapse offcanvas-collapse" id="navbarSideCollapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/">
                <a
                  className={`nav-link ${router.pathname == '/' ? 'active' : ''}`}
                  aria-current="page">
                  Home
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/proposal/create">
                <a
                  className={`nav-link ${router.pathname == '/proposal/create' ? 'active' : ''}`}
                  href="createproposal.php">
                  Create Proposal
                </a>
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav mr-auto mb-2 mb-lg-0 language">
            <li className="nav-item">
              <ConnectKitButton />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
