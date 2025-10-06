class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
    this.prev = null;
  }
}

class Deque {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  addFront(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.next = this.head;
      this.head = this.head.prev;
      this.head = node;
    }
    ++this.size;
  }

  addBack(value) {
    const node = new Node(value);
    if (!this.tail) {
      this.tail = this.head = node;
    } else {
      node.prev = this.tail;
      this.tail = this.tail.next;
      this.tail = node;
    }
    ++this.size;
  }

  removeFront() {
    if (!this.head) return null;

    const value = this.head.val;
    this.head = this.head.next;
    if (this.head) this.head.prev = null;
    else this.head = null;
    return value;
  }

  removeBack() {
    if (!this.tail) return null;

    const value = this.tail.val;
    this.tail = this.tail.prev;
    if (this.tail) this.tail.next = null;
    else this.tail = null;
    return value;
  }

  peekFront() {
    return this.head ? this.head.val : null;
  }

  peekBack() {
    return this.tail ? this.tail.val : null;
  }

  isEmpty() {
    return this.size === 0;
  }

  getSize() {
    return this.size;
  }
}

const deque = new Deque();
deque.addBack(1);
deque.addBack(2);
deque.addFront(0);
console.log(deque.removeFront());
console.log(deque.removeBack());
console.log(deque.peekFront());
console.log(deque.isEmpty());
