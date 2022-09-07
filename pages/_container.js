import { useAuth } from '../lib/auth';
import Layout from '../components/layout';
import ChannelsLayout from '../components/ChannelsLayout';

export default function Container({ Component, ...pageProps }) {
  const { user } = useAuth();

  return (
    <>
      {user ?
      <Layout>
        <ChannelsLayout>
          <Component {...pageProps} />
        </ChannelsLayout> 
      </Layout>:
      <Layout>
        <Component {...pageProps} />
      </Layout>
      }
    </>
  );
}
