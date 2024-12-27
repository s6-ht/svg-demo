import { IEventTarget } from "../events/types";
import { Shape } from "../types/displayObject";
import { INode, IDocument, IChildNode, IParentNode, IElement } from "./types";

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Node
 *  EventTarget <-- Node
 *
 * @export
 * @abstract
 * @class Node
 * @extends {EventTarget}
 * @implements {INode}
 */
export abstract class Node extends EventTarget implements INode {
  static DOCUMENT_POSITION_DISCONNECTED = 1;
  static DOCUMENT_POSITION_PRECEDING = 2;
  static DOCUMENT_POSITION_FOLLOWING = 4;
  static DOCUMENT_POSITION_CONTAINS = 8;
  static DOCUMENT_POSITION_CONTAINED_BY = 16;
  static DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;

  static isNode(target: IEventTarget | INode): target is INode {
    return !!(target as INode).childNodes;
  }

  public shadow = false;
  public ownerDocument: IDocument | null = null;
  public isConnected = false;

  /**
   * Returns node's node document's document base URL.
   * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Node
   */
  readonly baseURI: string = "";

  /**
   * Returns the children.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes
   */
  public childNodes: IChildNode[] = [];

  /**
   * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
   */
  public nodeType = 0;

  /**
   * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeName
   */
  public nodeName = "";

  /**
   * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeValue
   */
  public nodeValue: string | null = null;

  /**
   * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Node/textContent
   */
  get textContent(): string {
    let out = "";

    if (this.nodeName === Shape.TEXT) {
      // @ts-ignore
      out += this.style.text;
    }

    for (const child of this.childNodes) {
      if (child.nodeName === Shape.TEXT) {
        out += child.nodeValue;
      } else {
        out += child.textContent;
      }
    }

    return out;
  }

  set textContent(content: string) {
    // remove all children
    this.childNodes.slice().forEach((child) => {
      this.removeChild(child);
    });

    if (this.nodeName === Shape.TEXT) {
      // @ts-ignore
      this.style.text = `${content}`;
    } else {
      // this.appendChild(
      //   new Text({
      //     style: {
      //       text: content,
      //     },
      //   }),
      // );
    }
  }

  getRootNode(opts: { composed?: boolean } = {}): INode {
    if (this.parentNode) {
      return this.parentNode.getRootNode(opts);
    }
    if (opts.composed && (this as any).host) {
      return (this as any).host.getRootNode(opts);
    }
    return this;
  }
  hasChildNodes(): boolean {
    return this.childNodes.length > 0;
  }

  isDefaultNamespace(namespace: string | null): boolean {
    // throw new Error(ERROR_MSG_METHOD_NOT_IMPLEMENTED);
  }

  lookupNamespaceURI(prefix: string | null): string | null {
    // throw new Error(ERROR_MSG_METHOD_NOT_IMPLEMENTED);
  }

  lookupPrefix(namespace: string | null): string | null {
    // throw new Error(ERROR_MSG_METHOD_NOT_IMPLEMENTED);
  }

  normalize(): void {
    // throw new Error(ERROR_MSG_METHOD_NOT_IMPLEMENTED);
  }

  /**
   * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Node/isEqualNode
   */
  isEqualNode(otherNode: INode | null): boolean {
    // TODO: compare 2 nodes, not sameness
    return this === otherNode;
  }
  isSameNode(otherNode: INode | null): boolean {
    return this.isEqualNode(otherNode);
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode
   */
  parentNode: (INode & IParentNode) | null = null;

  get parentElement(): IElement | null {
    return null;
  }
  get nextSibling(): IChildNode | null {
    return null;
  }
  get previousSibling(): IChildNode | null {
    return null;
  }
  get firstChild(): IChildNode | null {
    return this.childNodes.length > 0 ? this.childNodes[0] : null;
  }
  get lastChild(): IChildNode | null {
    return this.childNodes.length > 0
      ? this.childNodes[this.childNodes.length - 1]
      : null;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
   * @see https://github.com/b-fuze/deno-dom/blob/master/src/dom/node.ts#L338
   */
  compareDocumentPosition(other: INode): number {
    if (other === this) {
      // same node
      return 0;
    }

    if (!(other instanceof Node)) {
      throw new TypeError(
        "Node.compareDocumentPosition: Argument 1 does not implement interface Node."
      );
    }

    let node1Root: INode = other;
    let node2Root: INode = this;
    const node1Hierarchy: INode[] = [node1Root];
    const node2Hierarchy: INode[] = [node2Root];
    while (node1Root.parentNode ?? node2Root.parentNode) {
      node1Root = node1Root.parentNode
        ? (node1Hierarchy.push(node1Root.parentNode), node1Root.parentNode)
        : node1Root;
      node2Root = node2Root.parentNode
        ? (node2Hierarchy.push(node2Root.parentNode), node2Root.parentNode)
        : node2Root;
    }

    // Check if they don't share the same root node
    if (node1Root !== node2Root) {
      return (
        Node.DOCUMENT_POSITION_DISCONNECTED |
        Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC |
        Node.DOCUMENT_POSITION_PRECEDING
      );
    }

    const longerHierarchy =
      node1Hierarchy.length > node2Hierarchy.length
        ? node1Hierarchy
        : node2Hierarchy;
    const shorterHierarchy =
      longerHierarchy === node1Hierarchy ? node2Hierarchy : node1Hierarchy;

    // Check if either is a container of the other
    if (
      longerHierarchy[longerHierarchy.length - shorterHierarchy.length] ===
      shorterHierarchy[0]
    ) {
      return longerHierarchy === node1Hierarchy
        ? // other is a child of this
          Node.DOCUMENT_POSITION_CONTAINED_BY | Node.DOCUMENT_POSITION_FOLLOWING
        : // this is a child of other
          Node.DOCUMENT_POSITION_CONTAINS | Node.DOCUMENT_POSITION_PRECEDING;
    }

    // Find their first common ancestor and see whether they
    // are preceding or following
    const longerStart = longerHierarchy.length - shorterHierarchy.length;
    for (let i = shorterHierarchy.length - 1; i >= 0; i--) {
      const shorterHierarchyNode = shorterHierarchy[i];
      const longerHierarchyNode = longerHierarchy[longerStart + i];

      // We found the first common ancestor
      if (longerHierarchyNode !== shorterHierarchyNode) {
        const siblings = shorterHierarchyNode?.parentNode
          ?.childNodes as INode[];

        if (
          siblings.indexOf(shorterHierarchyNode) <
          siblings.indexOf(longerHierarchyNode)
        ) {
          // Shorter is before longer
          if (shorterHierarchy === node1Hierarchy) {
            // Other is before this
            return Node.DOCUMENT_POSITION_PRECEDING;
          } else {
            // This is before other
            return Node.DOCUMENT_POSITION_FOLLOWING;
          }
        } else {
          // Longer is before shorter
          if (longerHierarchy === node1Hierarchy) {
            // Other is before this
            return Node.DOCUMENT_POSITION_PRECEDING;
          } else {
            // Other is after this
            return Node.DOCUMENT_POSITION_FOLLOWING;
          }
        }
      }
    }

    return Node.DOCUMENT_POSITION_FOLLOWING;
  }

  contains<T extends INode>(other: T | null): boolean {
    // the node itself, one of its direct children
    let tmp: INode | null = other;
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
    while (tmp && this !== tmp) {
      tmp = tmp.parentNode;
    }
    return !!tmp;
  }

  getAncestor(n: number): INode | null {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let temp: INode | null = this;
    while (n > 0 && temp) {
      temp = temp.parentNode;
      n--;
    }
    return temp;
  }

  forEach(callback: (o: INode) => void | boolean, assigned = false) {
    if (!callback(this)) {
      (assigned ? this.childNodes.slice() : this.childNodes).forEach(
        (child) => {
          child.forEach(callback);
        }
      );
    }
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode
   */
  abstract cloneNode(deep?: boolean): this;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
   */
  abstract appendChild<T extends INode>(newChild: T, index?: number): T;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
   */
  abstract insertBefore<T extends INode>(
    newChild: T,
    refChild: INode | null
  ): T;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
   */
  abstract removeChild<T extends INode>(child: T): T;

  /**
   * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Node/replaceChild
   */
  abstract replaceChild<T extends INode>(newChild: INode, oldChild: T): T;

  abstract destroy(): void;
}
