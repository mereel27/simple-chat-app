import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { useEffect } from 'react';

export function AutoScrollPlugin({ scrollRef }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ tags, editorState }) => {
      const scrollElement = scrollRef.current;

      if (scrollElement === null) {
        return;
      }

      const selection = editorState.read(() => $getSelection());

      if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
        return;
      }

      const anchorElement = editor.getElementByKey(selection.anchor.key);

      if (anchorElement === null) {
        return;
      }

      const scrollRect = scrollElement.getBoundingClientRect();
      const rect = anchorElement.getBoundingClientRect();

      if (rect.bottom > scrollRect.bottom) {
        anchorElement.scrollIntoView(false);
      } else if (rect.top < scrollRect.top) {
        anchorElement.scrollIntoView(false);
      }
    });
  }, [editor, scrollRef]);

  return null;
}
