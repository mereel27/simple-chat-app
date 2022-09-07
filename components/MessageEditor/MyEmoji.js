/* import { LazyLoadImage } from 'react-lazy-load-image-component'; */
/* import emojis from 'emoji-assets/emoji.json';
import joypixels from 'emoji-toolkit'; */
import styles from '../../styles/MessageEditor.module.css';
import { Typography, Tab, Tabs, Box } from '@mui/material';
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined';
import EmojiNatureOutlinedIcon from '@mui/icons-material/EmojiNatureOutlined';
import EmojiFoodBeverageOutlinedIcon from '@mui/icons-material/EmojiFoodBeverageOutlined';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import EmojiSymbolsOutlinedIcon from '@mui/icons-material/EmojiSymbolsOutlined';
import EmojiFlagsOutlinedIcon from '@mui/icons-material/EmojiFlagsOutlined';
import EmojiTransportationOutlinedIcon from '@mui/icons-material/EmojiTransportationOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { blueGrey } from '@mui/material/colors';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_EMOJI_COMMAND } from './EmojiPlugin';

import emojibase from 'emojibase-data/en/data.json';
import groups from 'emojibase-data/meta/groups.json';
import versions from 'emojibase-data/versions/emoji.json';

console.log(versions);
console.log(emojibase);
console.log(groups);

/* fetch('https://hotline.ua/').then(async (response) => {
  const text = await response.text();
  const parser = new DOMParser();
  const page = parser.parseFromString(text, 'text/html');
  return page;
}).then(response => console.log(response)); */

const newEmojiList = emojibase
  .filter((emoji) => emoji.version !== 14)
  .sort((a, b) => a.order - b.order);

const categories = {
  recent: null,
  'smileys & emotion': 0,
  'people & body': 1,
  /* 2: "component", */
  'animals & nature': 3,
  'food & drink': 4,
  'travel & places': 5,
  activities: 6,
  objects: 7,
  symbols: 8,
  flags: 9,
};

const Emoji = ({ open, onSelect }) => {
  const [editor] = useLexicalComposerContext();
  const [category, setCategory] = useState(0);
  const [recentEmojis, setRecentEmojis] = useState([]);
  const refs = useRef([]);
  const divref = useRef();

  const getEmojisByCaregory = (groupNumber) => {
    const number = Number(groupNumber);
    if (groupNumber === null) {
      return recentEmojis;
    }
    return newEmojiList.filter((el) => el.group === number);
  };

  const insertEmoji = useCallback(
    (emoji) => {
      const className = `${styles.emoji} ${styles.editorEmoji}`;
      editor.dispatchCommand(INSERT_EMOJI_COMMAND, { className, emoji });
    },
    [editor]
  );

  const handleEmojiClick = useCallback(emoji => {
      insertEmoji(emoji);
      const pickedEmoji = newEmojiList.find(el => el.emoji === emoji);
      const alreadyInList = recentEmojis.find(el => el.emoji === emoji);
      let recents = [...recentEmojis];
      if (alreadyInList) {
        if (recentEmojis[0].emoji === pickedEmoji.emoji) {
          return;
        }
        recents = [...recentEmojis].filter(el => pickedEmoji.emoji !== el.emoji);
      }
      recents.unshift(pickedEmoji);
      if (recents.length > 20) {
        recents = recents.slice(0, 20);
      }
      setRecentEmojis(recents);
    }, [ insertEmoji, recentEmojis ]);

  const handleCategoryChange = (e, newValue) => setCategory(newValue);

  useEffect(() => {
    const localRecentEmoji = JSON.parse(localStorage.getItem('recentEmojis'));
    localRecentEmoji && setRecentEmojis(localRecentEmoji);
  }, [])

  useEffect(() => {
    refs.current[category].scrollIntoView();
  }, [category]);

  useEffect(() => {
    return localStorage.setItem('recentEmojis', JSON.stringify(recentEmojis))
  }, [recentEmojis]);

  return (
    <>
      <Box
        display={open ? 'block' : 'none'}
        width="100%"
        sx={{ userSelect: 'none' }}
      >
          <Tabs
            value={category}
            elevation='2'
            onChange={handleCategoryChange}
            variant="fullWidth"
            aria-label="emoji categories tabs"
            sx={{ width: '100%', minWidth: '0px', backgroundColor: 'white', "& button": { minWidth: '0px', p: '5px' }, borderBottom: `1px solid ${blueGrey[50]}` }}
          >
            <Tab
              icon={<AccessTimeOutlinedIcon />} 
              aria-label="recent" />
            <Tab
              icon={<SentimentSatisfiedAltOutlinedIcon />}
              aria-label="smileys & emotion"
            />
            <Tab icon={<EmojiPeopleOutlinedIcon />} aria-label="people & body" />
            <Tab
              icon={<EmojiNatureOutlinedIcon />}
              aria-label="animals & nature"
            />
            <Tab
              icon={<EmojiFoodBeverageOutlinedIcon />}
              aria-label="food & drink"
            />
            <Tab
              icon={<EmojiTransportationOutlinedIcon />}
              aria-label="travel & places"
            />
            <Tab icon={<EmojiEventsOutlinedIcon />} aria-label="activities" />
            <Tab icon={<EmojiObjectsOutlinedIcon />} aria-label="objects" />
            <Tab icon={<EmojiSymbolsOutlinedIcon />} aria-label="symbols" />
            <Tab icon={<EmojiFlagsOutlinedIcon />} aria-label="flags" />
          </Tabs>
        <div style={{ overflow: 'auto', maxHeight: '300px' }} ref={divref}>
          {Object.keys(categories).map((group, index) => (
            <div
              className={styles['emoji-category']}
              key={index}
              ref={(el) => (refs.current[index] = el)}
            >
              <Typography
                className="cat-name"
                p="5px 10px"
                variant="button"
                component="div"
              >
                {group}
              </Typography>
              <div className={styles['emoji-container']}>
                {getEmojisByCaregory(categories[group]).map((el, index) => (
                  <div
                    key={index}
                    className={styles["emoji-box"]}
                    onClick={() => handleEmojiClick(el.emoji)}
                  >
                    <span className={styles.emoji}>{el.emoji}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Box>
    </>
  );
};

export default Emoji;
