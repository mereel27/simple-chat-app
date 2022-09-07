import styles from '../../styles/MessageEditor.module.css';
import { useEffect, useState, useRef } from 'react';

import { Box } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoScrollPlugin } from './LexicalAutoScrollPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import CharacterStylesPopupPlugin from './LexicalToolbar'
import exampleTheme from './theme';
import Emoji from './MyEmoji';
import { EmojiNode } from './emojiNode';
import EmojiPlugin from './EmojiPlugin';

/* import joy from './joypixels.ttf';
import joyApple from './joypixels-apple.ttc'; */


/* import {$generateHtmlFromNodes} from '@lexical/html'; */

/* const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

(async () => {
  const url = iOS ? joyApple : joy;
  const myFont = new FontFace('joypixels', `url(${url})`);
  await myFont.load();
  document.fonts.add(myFont);
})(); */

let divHeight;
let pHeight;

function onError(error) {
  console.error(error);
};

const initialConfig = {
  theme: exampleTheme,
  onError,
  nodes: [EmojiNode]
};

function MessageEditor({ user, currentChannel }) {
  const { uid, displayName = 'User', photoURL = '' } = user;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [msg, setMsg] = useState('');
  const editorRef = useRef();
  const innerRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, 'channels', currentChannel, 'messages'), {
      text: msg,
      createdAt: serverTimestamp(),
      uid,
      displayName,
      photoURL,
    });

    setMsg('');

    // scroll down the chat
    /* dummySpace.current.scrollIntoView({ behavor: 'smooth' }); */
  };

  const handleEditorChange = (editorState, editor) => {
    /* const empty = innerRef.current.children[0].length; */
    console.log(innerRef.current.children)

    /* editor.update(() => {
      const html = $generateHtmlFromNodes(editor, null);
      const div = document.createElement('div');
      div.innerHTML = html;
      console.log(div)
      const realHTML = new DOMParser();
      const newHTML = realHTML.parseFromString(html, 'text/html');
      console.log(newHTML.querySelectorAll('p'))
    }) */
  }

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      const currentDivHeight = entries[0].target.offsetHeight;
      const currentPHeight = entries[0].target.firstChild.firstChild.offsetHeight;
      if (!divHeight && !pHeight) {
        divHeight = currentDivHeight;
        pHeight = currentPHeight;
      }
      if (divHeight + pHeight <= currentDivHeight) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    });
    obs.observe(editorRef.current);
    return obs.observe(editorRef.current);
  }, []);

  const handleEmojiClick = () => {
    setShowEmoji(!showEmoji);
  };

  return (
    <>
    <LexicalComposer initialConfig={initialConfig}>
      <Box
        display="grid"
        width='100%'
        p="10px 0"
        /* m="10px 20px" */
        gridTemplateColumns="auto 1fr auto"
        gridTemplateRows="auto auto"
        id='outer-container'
        sx={{backgroundColor: blueGrey[50]}}
      >
        <Box className={styles.buttonBox} gridColumn="1 / 2" alignSelf={isExpanded ? 'end' : 'center'}>
          <IconButton
            color="primary"
            sx={{ width: '40px', height: '40px' }}
            onClick={handleEmojiClick}
          >
            <EmojiEmotionsOutlinedIcon />
          </IconButton>
        </Box>
        <Box
          gridColumn="2/3"
          minWidth="0px"
          width="100%"
          p="7px 0"
          ref={editorRef}
          id={styles.editorContainer}
          height='fit-content'
          sx={{backgroundColor: 'white'}}
        >
            <Box /* className={styles.inner-container} */>
              <CharacterStylesPopupPlugin />
              <OnChangePlugin ignoreSelectionChange onChange={handleEditorChange} />
                <Box className={styles.editorInner} position="relative" ref={innerRef}>
                  <RichTextPlugin
                    contentEditable={<ContentEditable id={styles.editorInput} />}
                    placeholder={<div className={styles.editorPlaceholder}>Enter some text...</div>}
                    onChange={state => console.log(state)}
                  />
                  <AutoScrollPlugin scrollRef={innerRef}/>
                  <HistoryPlugin />
                  <EmojiPlugin />
                </Box>
            </Box>
          
        </Box>
        <Box className={styles.buttonBox} gridColumn="3 / 4" alignSelf={isExpanded ? 'end' : 'center'} justifySelf='center'>
          <IconButton color="primary" sx={{ width: '40px', height: '40px' }}>
            <SendIcon sx={{ ml: '3px' }} />
          </IconButton>
        </Box>
      </Box>
      <Emoji open={showEmoji} />
      </LexicalComposer>
    </>
  );
}

export default MessageEditor;