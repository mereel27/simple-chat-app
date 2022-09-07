import Head from 'next/head';
import { Card, Box } from '@mui/material';
import MessageEditor from '../../components/MessageEditor/MessageEditor';
import { useRouter } from 'next/router';
import styles from '../../styles/messagesList.module.css';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../lib/auth';
import { db } from '../../lib/firebaseFirestore';
import {
  collection,
  onSnapshot,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';

export default function Channel() {
  const [messages, setMessages] = useState([]);
  const [isloading, setisLoading] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();
  const currentChannel = router.query.channel;

  useEffect(() => {
    /* console.log('chat render'); */
    /* console.log(router) */
    if (currentChannel) {
      setisLoading(true);
      const messagesRef = collection(db, 'channels', currentChannel, 'messages');
      const q = query(messagesRef, orderBy('createdAt'));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs = [];
        querySnapshot.forEach((doc) => {
          msgs.push(doc.data());
        });
        setMessages(msgs);
        setisLoading(false);
      });
      return () => unsubscribe();
    }
  }, [currentChannel, router]);

  return (
    <>
      <Head>
        <title>{currentChannel}</title>
      </Head>
      <>
        {loading && isloading ? (
          <h1>Loading...</h1>
        ) : (
          <Box className='chatRoomContainer' sx={{display: 'flex', flexDirection: 'column', width: '100%', overflowY: 'auto'}}>
            <Box className={styles['messages-container'] }sx={{ overflowY: 'auto'}}>
              {messages.map((msg, index) => (
                <Card
                  key={index}
                  sx={{
                    width: 'fit-content',
                    margin: '10px 0',
                    p: '10px' /* bgcolor: user.uid === msg.uid && '#66bb6a' */,
                  }}
                  className={user.uid === msg.uid ? styles.bubbleRight : ''}
                >
                  <span>{msg.displayName || 'Anonymous'}</span>
                  <br />
                  <span>{msg.text}</span>
                </Card>
              ))}
            </Box>
            <MessageEditor
              user={user}
              currentChannel={currentChannel}
            />
          </Box>
        )}
      </>
    </>
  );
}
