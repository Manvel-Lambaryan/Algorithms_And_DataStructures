const RED = "RED";
const BLACK = "BLACK";

const reset = "\x1b[0m";
const redColor = "\x1b[31m";
const blackColor = "\x1b[30m";
const bold = "\x1b[1m";

class TreeNode {
  constructor(data, color = RED, parent = null, left = null, right = null) {
    this.data = data;
    this.color = color;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

class RBTree {
  constructor() {
    this.nil = new TreeNode(null, BLACK);
    this.nil.left = this.nil.right = this.nil;
    this.root = this.nil;
  }

  insert(data) {
    const newNode = new TreeNode(data);
    newNode.left = newNode.right = this.nil;

    let parentNode = this.nil;
    let current = this.root;

    while (current !== this.nil) {
      parentNode = current;
      if (newNode.data < current.data) {
        current = current.left;
      } else if (newNode.data > current.data) {
        current = current.right;
      } else {
        return;
      }
    }

    newNode.parent = parentNode;

    if (parentNode === this.nil) {
      this.root = newNode;
    } else if (newNode.data < parentNode.data) {
      parentNode.left = newNode;
    } else {
      parentNode.right = newNode;
    }

    this._insertFixUp(newNode);
  }

  _insertFixUp(node) {
    while (node.parent.color === RED) {
      let grandparent = node.parent.parent;

      if (node.parent === grandparent.left) {
        let uncle = grandparent.right;

        if (uncle.color === RED) {
          node.parent.color = BLACK;
          uncle.color = BLACK;
          grandparent.color = RED;
          node = grandparent;
        } else {
          if (node === node.parent.right) {
            node = node.parent;
            this._leftRotation(node);
          }

          node.parent.color = BLACK;
          grandparent.color = RED;
          this._rightRotation(grandparent);
        }
      } else {
        let uncle = grandparent.left;

        if (uncle.color === RED) {
          node.parent.color = BLACK;
          uncle.color = BLACK;
          grandparent.color = RED;
          node = grandparent;
        } else {
          if (node === node.parent.left) {
            node = node.parent;
            this._rightRotation(node);
          }

          node.parent.color = BLACK;
          grandparent.color = RED;
          this._leftRotation(grandparent);
        }
      }
    }

    this.root.color = BLACK;
  }

  transplant(node, current) {
    if (node.parent === this.nil) {
      this.root = current;
    } else if (node === node.parent.left) {
      node.parent.left = current;
    } else {
      node.parent.right = current;
    }

    if (current !== this.nil) {
      current.parent = node.parent;
    }
  }

  delete(data) {
    let deleteNode = this.root;

    while (deleteNode !== this.nil && deleteNode.data !== data) {
      if (data < deleteNode.data) {
        deleteNode = deleteNode.left;
      } else {
        deleteNode = deleteNode.right;
      }
    }

    if (deleteNode === this.nil) {
      return;
    }

    let DNodeColor = deleteNode.color;
    let nodeToMoveUp;

    if (deleteNode.left === this.nil) {
      nodeToMoveUp = deleteNode.right;
      this.transplant(deleteNode, deleteNode.right);
    } else if (deleteNode.right === this.nil) {
      nodeToMoveUp = deleteNode.left;
      this.transplant(deleteNode, deleteNode.left);
    } else {
      let successor = this.findMin(deleteNode.right);
      DNodeColor = successor.color;
      nodeToMoveUp = successor.right;

      if (successor.parent === deleteNode) {
        nodeToMoveUp.parent = successor;
      } else {
        this.transplant(successor, successor.right);
        successor.right = deleteNode.right;
        successor.right.parent = successor;
      }

      this.transplant(deleteNode, successor);
      successor.left = deleteNode.left;
      successor.left.parent = successor;
      successor.color = deleteNode.color;
    }

    if (DNodeColor === BLACK) {
      this._deleteFixUp(nodeToMoveUp);
    }
  }

  _deleteFixUp(node) {
    while (node !== this.root && node.color === BLACK) {
      if (node === node.parent.left) {
        let sibling = node.parent.right;
        if (sibling.color === RED) {
          sibling.color = BLACK;
          node.parent.color = RED;
          this._leftRotation(node.parent);
          sibling = node.parent.right;
        }

        if (sibling.left.color === BLACK && sibling.right.color === BLACK) {
          sibling.color = RED;
          node = node.parent;
        } else {
          if (sibling.right.color === BLACK) {
            sibling.left.color = BLACK;
            sibling.color = RED;
            this._rightRotation(sibling);
            sibling = node.parent.right;
          }

          sibling.color = node.parent.color;
          node.parent.color = BLACK;
          sibling.right.color = BLACK;
          this._leftRotation(node.parent);
          node = this.root;
        }
      } else {
        let sibling = node.parent.left;
        if (sibling.color === RED) {
          4;
          sibling.color = BLACK;
          node.parent.color = RED;
          this._rightRotation(node.parent);
          sibling = node.parent.left;
        }

        if (sibling.right.color === BLACK && sibling.left.color === BLACK) {
          sibling.color = RED;
          node = node.parent;
        } else {
          if (sibling.left.color === BLACK) {
            sibling.right.color = BLACK;
            sibling.color = RED;
            this._leftRotation(sibling);
            sibling = node.parent.left;
          }

          sibling.color = node.parent.color;
          node.parent.color = BLACK;
          sibling.left.color = BLACK;
          this._rightRotation(node.parent);
          node = this.root;
        }
      }
    }

    node.color = BLACK;
  }

  search(node, data) {
    if (node === this.nil || data === node.data) {
      return node;
    }

    if (data < node.data) {
      return this.search(node.left, data);
    } else {
      return this.search(node.right, data);
    }
  }

  find(data) {
    return this.search(this.root, data);
  }

  findMin(node) {
    while (node.left !== this.nil) {
      node = node.left;
    }
    return node;
  }

  findMax(node) {
    while (node.right !== this.nil) {
      node = node.right;
    }
    return node;
  }

  inorderTraversal(node = this.root) {
    if (node === this.nil) {
      return;
    }

    this.inorderTraversal(node.left);
    console.log(node.data);
    this.inorderTraversal(node.right);
  }

  postorderTraversal(node = this.root) {
    if (node === this.nil) {
      return;
    }

    this.postorderTraversal(node.left);
    this.postorderTraversal(node.right);
    console.log(node.data);
  }

  preorderTraversal(node = this.root) {
    if (node === this.nil) {
      return;
    }

    console.log(node.data);
    this.preorderTraversal(node.left);
    this.preorderTraversal(node.right);
  }

  levelOrderTraversal() {
    if (this.root === this.nil) {
      return;
    }

    let queue = [this.root];
    while (queue.length > 0) {
      const node = queue.shift();
      console.log(node.data);

      if (node.left !== this.nil) {
        queue.push(node.left);
      }

      if (node.right !== this.nil) {
        queue.push(node.right);
      }
    }
  }

  _leftRotation(node) {
    let current = node.right;
    node.right = current.left;

    if (current.left !== this.nil) {
      current.left.parent = node;
    }

    current.parent = node.parent;

    if (node.parent === this.nil) {
      this.root = current;
    } else if (node === node.parent.left) {
      node.parent.left = current;
    } else {
      node.parent.right = current;
    }

    current.left = node;
    node.parent = current;
  }

  _rightRotation(node) {
    let current = node.left;
    node.left = current.right;

    if (current.right !== this.nil) {
      current.right.parent = node;
    }

    current.parent = node.parent;

    if (node.parent === this.nil) {
      this.root = current;
    } else if (node === node.parent.left) {
      node.parent.left = current;
    } else {
      node.parent.right = current;
    }

    current.right = node;
    node.parent = current;
  }

  _printTree(node = this.root, indent = "", isLeft = true) {
    const colorCode = node.color === RED ? redColor : blackColor;
    const colorSymbol = node.color === RED ? "R" : "B";
    const nodeLabel = `${bold}${colorCode}(${
      node.data ?? "nil"
    }, ${colorSymbol})${reset}`;

    if (node === this.nil) {
      console.log(indent + (isLeft ? "└──" : "┌──") + nodeLabel);
      return;
    }

    if (node.right !== this.nil) {
      this._printTree(node.right, indent + (isLeft ? "     " : "│    "), false);
    } else {
      console.log(
        indent +
          (isLeft ? "     " : "│    ") +
          "┌──" +
          `${bold}${blackColor}(nil, B)${reset}`
      );
    }

    console.log(indent + (isLeft ? "└──" : "┌──") + nodeLabel);

    if (node.left !== this.nil) {
      this._printTree(node.left, indent + (isLeft ? "     " : "│    "), true);
    } else {
      console.log(
        indent +
          (isLeft ? "     " : "│    ") +
          "└──" +
          `${bold}${blackColor}(nil, B)${reset}`
      );
    }
  }

  print() {
    if (this.root === this.nil) {
      console.log("Empty tree");
      return;
    }

    this._printTree(this.root);
  }
}
const rb = new RBTree();
console.log("                         ");
console.log("         INSERT 30       ");
console.log("                         ");
rb.insert(30);
rb.print();
console.log("                         ");
console.log("         INSERT 20       ");
console.log("                         ");
rb.insert(20);
rb.print();
console.log("                         ");
console.log("         INSERT 40       ");
console.log("                         ");
rb.insert(40);
rb.print();
console.log("                         ");
console.log("         DELETE 20       ");
console.log("                         ");
rb.delete(20);
rb.print();
