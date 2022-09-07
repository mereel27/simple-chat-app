import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from 'lexical';
import { $createEmojiNode, EmojiNode } from './emojiNode';

export const INSERT_EMOJI_COMMAND = createCommand();

export default function EmojiPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([EmojiNode])) {
      throw new Error(
        'EquationsPlugins: EmojiNode not registered on editor'
      );
    }

    return editor.registerCommand(
      INSERT_EMOJI_COMMAND,
      (payload) => {
        const { className, emoji } = payload;
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          const emojiNode = $createEmojiNode(className, emoji);
          selection.insertNodes([emojiNode]);
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
