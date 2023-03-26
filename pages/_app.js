import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/global.css';
import { useEffect, useState } from 'react';
import { createClient, WagmiConfig } from 'wagmi';
import { mainnet, bsc, localhost } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { NextSeo } from 'next-seo';
import { siweClient } from 'libs/siweClient';
import { useSIWE } from 'connectkit';
import { SWRConfig } from 'swr';

const wagmiClient = createClient(
  getDefaultClient({
    appName: 'CoMinting',
    chains: [mainnet, bsc, localhost],
  })
);

const fetcher = async (resource) => {
  const res = await fetch(resource);

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

function MyApp({ Component, pageProps }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
    setReady(true);
  }, []);

  return (
    <>
      {ready ? (
        <WagmiConfig client={wagmiClient}>
          <siweClient.Provider
            enabled={true} // defaults true
            nonceRefetchInterval={300000} // in milliseconds, defaults to 5 minutes
            sessionRefetchInterval={300000} // in milliseconds, defaults to 5 minutes
            signOutOnDisconnect={true} // defaults true
            signOutOnAccountChange={true} // defaults true
            signOutOnNetworkChange={true} // defaults true
          >
            <ConnectKitProvider>
              <SWRConfig
                value={{
                  fetcher: (resource, init) => fetcher(resource, init),
                }}>
                <NextSeo titleTemplate="CoMinting | %s" defaultTitle="CoMinting | Undefined" />
                <Component {...pageProps} accounts={useSIWE} />
              </SWRConfig>
            </ConnectKitProvider>
          </siweClient.Provider>
        </WagmiConfig>
      ) : null}
    </>
  );
}

export default MyApp;
