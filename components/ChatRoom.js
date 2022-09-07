import styles from '../styles/messagesList.module.css';
import { db } from '../lib/firebaseFirestore';
import {
  collection,
  onSnapshot,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { formatRelative } from 'date-fns';
import MessageEditor from './MessageEditor/MessageEditor';
import { useEffect, useState } from 'react';
import { Card, Box } from '@mui/material';

export default function ChatRoom({ user, currentChannel }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log('chat render');
      setLoading(true);
      const messagesRef = collection(db, 'channels', currentChannel, 'messages');
      const q = query(messagesRef, orderBy('createdAt'));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const msgs = [];
        querySnapshot.forEach((doc) => {
          msgs.push(doc.data());
        });
        setMessages(msgs);
        setLoading(false);
      });
    return () => unsubscribe();
  }, [currentChannel]);

  return (
    <Box className={styles.container}>
      <Box sx={{overflowY: 'auto'}}>
        {loading && <h1>Loading...</h1>}
        {messages.map((msg, index) => (
          <Card key={index} sx={{width: 'fit-content', margin: '10px 0', p: '10px'}} className={user.uid === msg.uid ? styles.bubbleRight : ''}>
            <span>{msg.displayName || 'Anonymous'}</span>
            <br/>
            <span>{msg.text}</span>
          </Card>
        ))}
      </Box>
      <MessageEditor user={user} db={db} currentChannel={currentChannel}/>
    </Box>
  );
}
