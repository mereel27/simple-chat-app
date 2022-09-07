import Head from 'next/head';
import { siteTitle } from '../components/layout';

export default function Home() {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
    </>
  );
}
