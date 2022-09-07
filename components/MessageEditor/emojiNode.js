import { TextNode } from 'lexical';

export class EmojiNode extends TextNode {
  __className;
  
  static getType() {
    return 'emoji';
  }

  static clone(node) {
    return new EmojiNode(node.__className, node.__text, node.__key);
  }

  constructor(className, text, key) {
    super(text, key);
    this.__className = className;
  }

  /* createDOM(config) {
    const dom = document.createElement('span');
    dom.style.backgroundImage = `url(accets/emoji/32/${this.__hex}.png)`;
    const inner = super.createDOM(config);
    dom.className = this.__className;
    inner.className = 'emoji-inner';
    dom.appendChild(inner);
    return dom;
  } */

  createDOM(config) {
    const dom = super.createDOM(config);
    dom.className = this.__className;
    return dom;
  }

  updateDOM(prevNode, dom, config) {
    const inner = dom.firstChild;
    if (inner === null) {
      return true;
    }
    super.updateDOM(prevNode, inner, config);
    return false;
  }

  static importJSON(serializedNode) {
    const node = $createEmojiNode(
      serializedNode.className,
      serializedNode.text
    );
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      className: this.getClassName(),
      type: 'emoji',
    };
  }

  getClassName() {
    const self = this.getLatest();
    return self.__className;
  }
}

export function $isEmojiNode(node) {
  return node instanceof EmojiNode;
}

export function $createEmojiNode(className, emoji) {
  return new EmojiNode(className, emoji).setMode('token');
}
