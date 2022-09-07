import { db, updateUser} from '../lib/firebaseFirestore';
import {
  collection,
  onSnapshot,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { Box, Divider } from "@mui/material";
import Channels from "./Channels";
import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/router';

export default function ChannelsLayout({ children }) {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState('');
  const router = useRouter();

  useEffect(() => {
    const channelsRef = collection(db, 'channels');
    const q = query(channelsRef /* orderBy('createdAt') */);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chnls = [];
      querySnapshot.forEach((doc) => {
        chnls.push(doc.data());
      });
      setChannels(chnls);
      console.log(chnls);
    });
  return () => unsubscribe();
}, [currentChannel]);

  const handleClick = async (e) => {
    const value = e.target.innerText;
    await updateUser(user.uid, 'channel', value);
    setCurrentChannel(value);
  };

    return (
      <Box id='channels-layout' sx={{display: 'flex', height: '100%'}}>
        <Box sx={{display: 'flex'}}>
          <Channels channels={channels} currentChannel={currentChannel} handleClick={handleClick} />
          <Divider variant='middle' orientation='vertical' flexItem/>
        </Box>
        <>{children}</>
      </Box>
    )
}