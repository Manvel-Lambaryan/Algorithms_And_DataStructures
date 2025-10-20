class Node {
  constructor(value) {
    this.data = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVL {
  constructor() {
    this.root = null;
  }

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  update(node) {
    node.height =
      1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  rightRotate(node) {
    const root = node.left;
    node.left = root.right;
    root.right = node;

    this.update(node);
    this.update(root);

    return root;
  }

  leftRotate(node) {
    const root = node.right;
    node.right = root.left;
    root.left = node;

    this.update(node);
    this.update(root);

    return root;
  }

  leftRightRotate(node) {
    node.left = this.leftRotate(node.left);
    return this.rightRotate(node);
  }

  rightLeftRotate(node) {
    node.right = this.rightRotate(node.right);
    return this.leftRotate(node);
  }

  insertNode(node, value) {
    if (!node) return new Node(value);

    if (value < node.data) node.left = this.insertNode(node.left, value);
    else if (value > node.data) node.right = this.insertNode(node.right, value);
    else return node;

    this.update(node);
    const balance = this.getBalance(node);

    if (balance > 1 && value < node.left.data) return this.rightRotate(node);
    if (balance < -1 && value > node.right.data) return this.leftRotate(node);
    if (balance > 1 && value > node.left.data) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }
    if (balance < -1 && value < node.right.data) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }

    return node;
  }

  insert(value) {
    this.root = this.insertNode(this.root, value);
  }

  searchNode(node, value) {
    if (!node) return false;
    if (value < node.data) return this.searchNode(node.left, value);
    else if (value > node.data) return this.searchNode(node.right, value);
    else return true;
  }

  search(value) {
    return this.searchNode(this.root, value);
  }

  minValueNode(node) {
    let current = node;
    while (current.left) current = current.left;
    return current;
  }

  deleteNode(node, value) {
    if (!node) return node;

    if (value < node.data) node.left = this.deleteNode(node.left, value);
    else if (value > node.data) node.right = this.deleteNode(node.right, value);
    else {
      if (!node.left || !node.right) {
        node = node.left ? node.left : node.right;
      } else {
        let tmp = this.minValueNode(node.right);
        node.data = tmp.data;
        node.right = this.deleteNode(node.right, tmp.data);
      }
    }

    if (!node) return node;

    this.update(node);
    const balance = this.getBalance(node);

    if (balance > 1 && this.getBalance(node.left) >= 0)
      return this.rightRotate(node);
    if (balance < -1 && this.getBalance(node.right) <= 0)
      return this.leftRotate(node);
    if (balance > 1 && this.getBalance(node.left) < 0) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }
    if (balance < -1 && this.getBalance(node.right) > 0) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }

    return node;
  }

  delete(value) {
    this.root = this.deleteNode(this.root, value);
  }

  printTree(node = this.root, prefix = "", isLeft = true) {
    if (node === null) return;

    if (node.right) {
      this.printTree(node.right, prefix + (isLeft ? "│   " : "    "), false);
    }

    console.log(prefix + (isLeft ? "└── " : "┌── ") + node.data);

    if (node.left) {
      this.printTree(node.left, prefix + (isLeft ? "    " : "│   "), true);
    }
  }
}

const avl = new AVL();

avl.insert(10);
avl.insert(20);
avl.insert(5);
avl.insert(4);
avl.insert(6);
avl.insert(15);

console.log("AVL Tree after insertions:");
avl.printTree();

console.log("\nSearching for 15:", avl.search(15)); // true
console.log("Searching for 100:", avl.search(100)); // false

avl.delete(10);
console.log("\nAVL Tree after deleting 10:");
avl.printTree();
