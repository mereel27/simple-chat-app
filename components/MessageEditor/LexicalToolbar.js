import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isTextNode,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
} from 'lexical';
import { $isAtNodeEnd } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import { createPortal } from 'react-dom';
import {
  $isCodeHighlightNode,
} from '@lexical/code';
import {
  FormatUnderlined,
  FormatItalic,
  FormatBold,
  StrikethroughS,
} from '@mui/icons-material';
import { IconButton, Paper } from '@mui/material';

const toolbarFormats = [ 'bold', 'italic', 'underline', 'strikethrough' ];
const formatIcons = {
  'bold': <FormatBold/>,
  'italic': <FormatItalic/>,
  'underline': <FormatUnderlined />,
  'strikethrough': <StrikethroughS />,
};

function setPopupPosition(editor, rect, rootElementRect) {
  let top = rect.top - 8 + window.pageYOffset;
  let left =
    rect.left + 200 + window.pageXOffset - editor.offsetWidth + rect.width;
  if (left + editor.offsetWidth > rootElementRect.right) {
    left = rect.right - editor.offsetWidth;
    top = rect.top - 50 + window.pageYOffset;
  }
  if (left < 0) {
    left = rect.left;
    top = rect.bottom + 20;
  }
  if (rect.width >= rootElementRect.width - 25) {
    left = rect.left;
    top = rect.top - 50 + window.pageYOffset;
  }
  if (top < rootElementRect.top) {
    top = rect.bottom + 20;
  }
  editor.style.opacity = '1';
  editor.style.top = `${top}px`;
  editor.style.left = `${left}px`;
}

function FloatingCharacterStylesEditor({
  editor,
  isBold,
  isItalic,
  isUnderline,
  isStrikethrough
}) {
  const popupCharStylesEditorRef = useRef(null);

  const isFormatActive = useCallback((format) => {
    switch (format) {
      case 'bold':
        return isBold;
      case 'italic':
        return isItalic;
      case 'underline':
        return isUnderline;
      case 'strikethrough':
        return isStrikethrough; 
      default:
        return false;
    }
  }, [ isBold, isItalic, isUnderline, isStrikethrough ]);

  const updateCharacterStylesEditor = useCallback(() => {
    const selection = $getSelection();

    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = window.getSelection();

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      const rootElementRect = rootElement.getBoundingClientRect();
      let rect;

      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      setPopupPosition(popupCharStylesEditorElem, rect, rootElementRect);
    }
  }, [editor]);

  useEffect(() => {
    const onResize = () => {
      editor.getEditorState().read(() => {
        updateCharacterStylesEditor();
      });
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [editor, updateCharacterStylesEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateCharacterStylesEditor();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateCharacterStylesEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateCharacterStylesEditor();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateCharacterStylesEditor]);

  return (
    <Paper ref={popupCharStylesEditorRef} sx={{display: 'flex', position: 'absolute', p: '5px'}} elevation={3}>
      {toolbarFormats.map(format => (
        <IconButton
          key={format}
          sx={{ borderRadius: '5px' }}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
          }}
          color={isFormatActive(format) ? 'primary' : 'default'}
          aria-label={`Format ${format}`}
        >
          {formatIcons[format]}
        </IconButton>
      ))}
    </Paper>
  );
}

function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function useCharacterStylesPopup(editor) {
  const [isText, setIsText] = useState(false);
  const [isLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      const nativeSelection = window.getSelection();
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false);
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }

      const node = getSelectedNode(selection);

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      if (
        !$isCodeHighlightNode(selection.anchor.getNode()) &&
        selection.getTextContent() !== ''
      ) {
        setIsText($isTextNode(node));
      } else {
        setIsText(false);
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener('selectionchange', updatePopup);
    return () => {
      document.removeEventListener('selectionchange', updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      updatePopup();
    });
  }, [editor, updatePopup]);

  if (!isText || isLink) {
    return null;
  }

  return createPortal(
    <FloatingCharacterStylesEditor
      editor={editor}
      isBold={isBold}
      isItalic={isItalic}
      isStrikethrough={isStrikethrough}
      isUnderline={isUnderline}
    />,
    document.body,
  );
}

export default function CharacterStylesPopupPlugin() {
  const [editor] = useLexicalComposerContext();
  return useCharacterStylesPopup(editor);
}