class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class SinglyLinkedList {
  constructor(iterable) {
    this.head = null;
    this.tail = null;
    this._size = 0;

    if (iterable) {
      for (const value of iterable) {
        this.push_back(value);
      }
    }
  }

  size() {
    return this._size;
  }

  isEmpty() {
    return this._size === 0;
  }

  clear() {
    this.head = null;
    this.tail = null;
    this._size = 0;
  }

  front() {
    return this.head?.value;
  }

  push_front(value) {
    const newNode = new Node(value, this.head);
    this.head = newNode;
    if (this.isEmpty()) {
      this.tail = newNode;
    }
    this._size++;
  }

  push_back(value) {
    const newNode = new Node(value);
    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this._size++;
  }

  pop_front() {
    if (this.isEmpty()) {
      return undefined;
    }
    const value = this.head.value;
    this.head = this.head.next;
    this._size--;
    if (this.isEmpty()) {
      this.tail = null;
    }
    return value;
  }

  pop_back() {
    if (this.isEmpty()) {
      return undefined;
    }
    const value = this.tail.value;
    if (this._size === 1) {
      this.head = null;
      this.tail = null;
    } else {
      let current = this.head;
      while (current.next !== this.tail) {
        current = current.next;
      }
      current.next = null;
      this.tail = current;
    }
    this._size--;
    return value;
  }

  at(index) {
    if (index < 0 || index >= this._size) {
      return undefined;
    }
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current?.value;
  }

  insert(index, value) {
    if (index < 0 || index > this._size) {
      throw new Error("Index out of bounds");
    }
    if (index === 0) {
      this.push_front(value);
      return;
    }
    if (index === this._size) {
      this.push_back(value);
      return;
    }
    let current = this.head;
    for (let i = 0; i < index - 1; i++) {
      current = current.next;
    }
    const newNode = new Node(value, current.next);
    current.next = newNode;
    this._size++;
  }

  erase(index) {
    if (index < 0 || index >= this._size) {
      throw new Error("Index out of bounds");
    }
    if (index === 0) {
      return this.pop_front();
    }
    if (index === this._size - 1) {
      return this.pop_back();
    }
    let current = this.head;
    for (let i = 0; i < index - 1; i++) {
      current = current.next;
    }
    const removedNode = current.next;
    const removedValue = removedNode.value;
    current.next = removedNode.next;
    this._size--;
    return removedValue;
  }

  remove(value, equal = (a, b) => a === b) {
    let count = 0;
    while (this.head !== null && equal(this.head.value, value)) {
      this.head = this.head.next;
      this._size--;
      count++;
    }
    if (this.head === null) {
      this.tail = null;
      return count;
    }
    let current = this.head;
    while (current.next !== null) {
      if (equal(current.next.value, value)) {
        current.next = current.next.next;
        this._size--;
        count++;
        if (current.next === null) {
          this.tail = current;
        }
      } else {
        current = current.next;
      }
    }
    return count;
  }

  reverse() {
    let current = this.head;
    this.tail = this.head;
    let prev = null;
    while (current) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    this.head = prev;
  }

  sort(compareFn = (a, b) => (a < b ? -1 : a > b ? 1 : 0)) {
    if (this._size <= 1) return;
    this.head = this._mergeSort(this.head, compareFn);
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    this.tail = current;
  }

  merge(other, compareFn = (a, b) => (a < b ? -1 : a > b ? 1 : 0)) {
    if (other.isEmpty()) return;
    if (this.isEmpty()) {
      this.head = other.head;
      this.tail = other.tail;
      this._size = other.size();
      other.clear();
      return;
    }
    this.head = this._mergeLists(this.head, other.head, compareFn);
    this._size += other.size();
    other.clear();
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    this.tail = current;
  }

  _mergeSort(head, compareFn) {
    if (!head || !head.next) return head;
    const mid = this._getMiddle(head);
    const rightHead = mid.next;
    mid.next = null;
    const left = this._mergeSort(head, compareFn);
    const right = this._mergeSort(rightHead, compareFn);
    return this._mergeLists(left, right, compareFn);
  }

  _getMiddle(head) {
    let slow = head;
    let fast = head.next;
    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;
    }
    return slow;
  }

  _mergeLists(l1, l2, compareFn) {
    if (!l1) return l2;
    if (!l2) return l1;
    let head;
    if (compareFn(l1.value, l2.value) <= 0) {
      head = l1;
      l1 = l1.next;
    } else {
      head = l2;
      l2 = l2.next;
    }
    let current = head;
    while (l1 && l2) {
      if (compareFn(l1.value, l2.value) <= 0) {
        current.next = l1;
        l1 = l1.next;
      } else {
        current.next = l2;
        l2 = l2.next;
      }
      current = current.next;
    }
    current.next = l1 || l2;
    return head;
  }

  toArray() {
    const arr = [];
    let current = this.head;
    while (current) {
      arr.push(current.value);
      current = current.next;
    }
    return arr;
  }

  static fromArray(arr) {
    const list = new SinglyLinkedList();
    for (const value of arr) {
      list.push_back(value);
    }
    return list;
  }

  [Symbol.iterator]() {
    let current = this.head;
    return {
      next() {
        if (current) {
          const value = current.value;
          current = current.next;
          return { value, done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
}

const list = new SinglyLinkedList();
console.log(`Is list empty? ${list.isEmpty()}`);
console.log(`Current size: ${list.size()}`);

list.push_back(10);
list.push_back(20);
list.push_front(5);

console.log(`Front element: ${list.front()}`);
console.log(`Current size: ${list.size()}`);
console.log(`List as array: ${list.toArray()}`);

console.log(`Element at index 1: ${list.at(1)}`);

list.insert(1, 15);
console.log(`After inserting 15 at index 1: ${list.toArray()}`);

const removedValue = list.erase(2);
console.log(`Removed value from index 2: ${removedValue}`);
console.log(`After erasing element at index 2: ${list.toArray()}`);

list.push_back(15);
list.push_front(15);
const matchesRemoved = list.remove(15);
console.log(`Removed ${matchesRemoved} instances of 15: ${list.toArray()}`);

const frontPop = list.pop_front();
console.log(`Popped from front: ${frontPop}`);
console.log(`List after pop_front: ${list.toArray()}`);

const backPop = list.pop_back();
console.log(`Popped from back: ${backPop}`);
console.log(`List after pop_back: ${list.toArray()}`);

const numbers = SinglyLinkedList.fromArray([30, 10, 40, 20]);
console.log(`Original list: ${numbers.toArray()}`);

numbers.reverse();
console.log(`Reversed list: ${numbers.toArray()}`);

numbers.sort();
console.log(`Sorted list: ${numbers.toArray()}`);

const otherList = SinglyLinkedList.fromArray([5, 15, 25]);
numbers.merge(otherList);
console.log(`Merged list: ${numbers.toArray()}`);
console.log(`Other list after merge (it's cleared): ${otherList.toArray()}`);

const colors = SinglyLinkedList.fromArray(['red', 'green', 'blue']);
let output = 'Iterating with for...of: ';
for (const color of colors) {
  output += color + ', ';
}
console.log(output);