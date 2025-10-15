class TreeNode {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insertRecursion(val) {
    const insertRec = (node, val) => {
      if (node === null) return new TreeNode(val);
      if (val < node.data) node.left = insertRec(node.left, val);
      else if (val > node.data) node.right = insertRec(node.right, val);
      return node;
    };
    this.root = insertRec(this.root, val);
  }

  insertIterative(val) {
    let newNode = new TreeNode(val);
    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    let parent = null;

    while (current) {
      parent = current;
      if (val < current.data) current = current.left;
      else if (val > current.data) current = current.right;
      else return;
    }

    if (val < parent.data) parent.left = newNode;
    else parent.right = newNode;
  }

  containsRecursion(val) {
    const containRec = (node, val) => {
      if (!node) return false;
      if (node.data === val) return true;
      if (val < node.data) return containRec(node.left, val);
      else return containRec(node.right, val);
    };
    return containRec(this.root, val);
  }

  containsIterative(val) {
    if (!this.root) return false;
    let current = this.root;
    while (current) {
      if (val === current.data) return true;
      if (val < current.data) current = current.left;
      else current = current.right;
    }
    return false;
  }

  levelOrder() {
    let result = [];
    if (!this.root) return result;
    let queue = [this.root];
    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node.data);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return result;
  }

  inOrder() {
    let result = [];
    let stack = [];
    if (!this.root) return result;
    let node = this.root;
    while (node || stack.length > 0) {
      while (node) {
        stack.push(node);
        node = node.left;
      }
      node = stack.pop();
      result.push(node.data);
      node = node.right;
    }
    return result;
  }

  getHeight() {
    if (!this.root) return 0;
    let queue = [this.root];
    let hight = 0;
    while (queue.length > 0) {
      let level = queue.length;
      for (let i = 0; i < level; ++i) {
        let node = queue.shift();
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
      hight++;
    }
    return hight;
  }

  remove(val) {
    if (!this.root) return;
    let parent = null;
    let current = this.root;

    while (current && current.data !== val) {
      parent = current;
      if (val < current.data) current = current.left;
      else current = current.right;
    }

    if (!current) return;
    if (!current.left && !current.right) {
      if (!parent) {
        this.root = null;
      } else if (parent.left === current) {
        parent.left = null;
      } else {
        parent.right = null;
      }
    } else if (!current.left || !current.right) {
      let child = current.left ? current.left : current.right;
      if (!parent) {
        this.root = child;
      } else if (parent.left === current) {
        parent.left = child;
      } else {
        parent.right = child;
      }
    } else {
      let sParent = current;
      let s = current.right;
      while (s.left) {
        sParent = s;
        s = s.left;
      }
      current.data = s.data;
      if (sParent.left === s) {
        sParent.left = s.right;
      } else {
        sParent.right = s.right;
      }
    }
  }
}

let bst = new BinarySearchTree();
bst.insertRecursion(10);
bst.insertRecursion(5);
bst.insertRecursion(15);
bst.insertRecursion(7);

console.log(bst.inOrder()); // [5, 7, 10, 15]
console.log(bst.levelOrder()); // [10, 5, 15, 7]
console.log(bst.getHeight()); // 3
console.log(bst.containsIterative(7)); // true
bst.remove(5);
console.log(bst.inOrder()); // [7, 10, 15]
