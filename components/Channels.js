import Link from 'next/link';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

export default function Channels({ channels, currentChannel, handleClick }) {

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="channels">
        <List>
          {channels.length > 0 &&
            channels.map((ch, index) => (
              <ListItem disablePadding key={index} selected={currentChannel === ch.name}>
                <Link href={`/channels/${ch.name}`} passHref>
                  <ListItemButton /* onClick={handleClick} */>
                    <ListItemText primary={ch.name} />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
        </List>
      </nav>
    </Box>
  );
}
