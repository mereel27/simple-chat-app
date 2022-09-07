import "@fontsource/roboto";
import '../styles/globals.css';
import Container from "./_container";
/* import ChannelsLayout from "../components/ChannelsLayout"; */
import { AuthProvider } from "../lib/auth";
import { useEffect } from "react";


/* const joy = dynamic(() => import('./joypixels.ttf'));
const joyApple = dynamic(() => import('./joypixels-apple.ttc')); */

const joy = '/assets/fonts/joypixels.ttf';
const joyApple = '/assets/fonts/joypixels-apple.ttc'

function MyApp({ ...pageProps }) {

  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    (async () => {
      const url = iOS ? joyApple : joy;
      console.log(url)
      const myFont = new FontFace('joypixels', `url(${url})`);
      await myFont.load();
      document.fonts.add(myFont);
    })();
  }, [])

  return (
    <AuthProvider>
        <Container {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
