class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class LinkedList {
  #head = null;
  #tail = null;
  #size = 0;
  
  constructor(iterable = []) {
    if (iterable && typeof iterable[Symbol.iterator] === "function") {
      for (const item of iterable) this.push_back(item);
    } else if (iterable.length > 0) {
      throw new Error("This is not iterable!");
    }
  }

  size() {
    return this.#size;
  }

  isEmpty() {
    return this.#size === 0;
  }

  clear() {
    this.#head = null;
    this.#tail = null;
    this.#size = 0;
  }

  push_back(value) {
    const newNode = new Node(value);
    if (!this.#tail) {
      this.#head = this.#tail = newNode;
    } else {
      newNode.prev = this.#tail;
      this.#tail.next = newNode;
      this.#tail = newNode;
    }
    this.#size++;
    return this;
  }

  push_front(value) {
    const newNode = new Node(value);
    if (!this.#head) {
      this.#head = this.#tail = newNode;
    } else {
      newNode.next = this.#head;
      this.#head.prev = newNode;
      this.#head = newNode;
    }
    this.#size++;
    return this;
  }

  pop_back() {
    if (!this.#tail) throw new Error("Cannot pop_back from empty list");
    const value = this.#tail.value;
    this.#tail = this.#tail.prev;
    if (this.#tail) this.#tail.next = null;
    else this.#head = null;
    this.#size--;
    return value;
  }

  pop_front() {
    if (!this.#head) throw new Error("Cannot pop_front from empty list");
    const value = this.#head.value;
    this.#head = this.#head.next;
    if (this.#head) this.#head.prev = null;
    else this.#tail = null;
    this.#size--;
    return value;
  }

  front() {
    if (!this.#head) throw new Error("List is empty");
    return this.#head.value;
  }

  back() {
    if (!this.#tail) throw new Error("List is empty");
    return this.#tail.value;
  }

  at(index) {
    if (index < 0 || index >= this.#size)
      throw new Error("Index is out of bounds");
    let current = this.#head;
    for (let i = 0; i < index; i++) current = current.next;
    return current.value;
  }

  insert(index, value) {
    if (index < 0 || index > this.#size)
      throw new Error("Index is out of bounds");
    if (index === 0) return this.push_front(value);
    if (index === this.#size) return this.push_back(value);

    const newNode = new Node(value);
    let current = this.#head;
    for (let i = 0; i < index - 1; i++) current = current.next;

    newNode.next = current.next;
    newNode.prev = current;
    current.next.prev = newNode;
    current.next = newNode;

    this.#size++;
    return this;
  }

  erase(index) {
    if (index < 0 || index >= this.#size)
      throw new Error("Index is out of bounds");
    if (index === 0) return this.pop_front();
    if (index === this.#size - 1) return this.pop_back();

    let current = this.#head;
    for (let i = 0; i < index; i++) current = current.next;

    const prevNode = current.prev;
    const nextNode = current.next;

    if (prevNode) prevNode.next = nextNode;
    if (nextNode) nextNode.prev = prevNode;

    this.#size--;
    return current.value;
  }

  remove(value, equal = Object.is) {
    if (!this.#head) return 0;
    let count = 0;
    let current = this.#head;

    while (current) {
      let next = current.next;
      if (equal(current.value, value)) {
        const prevNode = current.prev;
        const nextNode = current.next;

        if (prevNode) prevNode.next = nextNode;
        else this.#head = nextNode;

        if (nextNode) nextNode.prev = prevNode;
        else this.#tail = prevNode;

        this.#size--;
        count++;
      }
      current = next;
    }

    return count;
  }

  reverse() {
    if (!this.#head) return this;
    let current = this.#head;
    let temp = null;

    while (current) {
      temp = current.prev;
      current.prev = current.next;
      current.next = temp;
      current = current.prev;
    }

    if (temp) {
      this.#tail = this.#head;
      this.#head = temp.prev;
    }

    return this;
  }

  getMiddle(node) {
    if (!node) return null;

    let slow = node;
    let fast = node;

    while (fast.next && fast.next.next) {
      slow = slow.next;
      fast = fast.next.next;
    }
    return slow;
  }

  split(node) {
    if (!node || !node.next) return null;

    const mid = this.getMiddle(node);
    const secondHalf = mid.next;
    mid.next = null;

    if (secondHalf) secondHalf.prev = null;

    return secondHalf;
  }

  merge(l1, l2, compareFn) {
    if (!l1) return l2;
    if (!l2) return l1;

    let result = null;
    if (compareFn(l1.value, l2.value) <= 0) {
      result = l1;
      result.next = this.merge(l1.next, l2, compareFn);
      if (result.next) result.next.prev = result;
    } else {
      result = l2;
      result.next = this.merge(l1, l2.next, compareFn);
      if (result.next) result.next.prev = result;
    }

    result.prev = null;
    return result;
  }

  mergeSort(node, compareFn = (a, b) => a - b) {
    if (!node || !node.next) return node;

    const second = this.split(node);
    const left = this.mergeSort(node, compareFn);
    const right = this.mergeSort(second, compareFn);

    return this.merge(left, right, compareFn);
  }

  sort(compareFn = (a, b) => a - b) {
    this.#head = this.mergeSort(this.#head, compareFn);

    let current = this.#head;
    while (current && current.next) current = current.next;
    this.#tail = current;

    return this;
  }

  toArray() {
    const arr = [];
    let current = this.#head;
    while (current) {
      arr.push(current.value);
      current = current.next;
    }
    return arr;
  }
}

let list = new LinkedList([4, 2, 5, 1, 3]);

console.log("Original:", list.toArray());

list.reverse();
console.log("Reversed:", list.toArray());

console.log("Erase index 2:", list.erase(2));
console.log("After erase:", list.toArray());

console.log("Remove value 4:", list.remove(4));
console.log("After remove:", list.toArray());

list.push_front(10).push_back(20);
console.log("After push_front(10) & push_back(20):", list.toArray());
list.sort();
console.log("Sort: ", list.toArray());
