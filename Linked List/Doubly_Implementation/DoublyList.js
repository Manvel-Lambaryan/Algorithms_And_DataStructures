class Node {
  constructor(data, next = null, prev = null) {
    this.data = data;
    this.next = next;
    this.prev = prev;
  }
}

class LinkedList {
  #head = null;
  #tail = null;
  #size = 0;

  constructor(iterables) {
    if (iterables === undefined) return;
    if (iterables && typeof iterables[Symbol.iterator] !== 'function') {
      iterables = [iterables];
    }
    for (const item of iterables) {
      this.push_back(item);
    }
  }

  size() {
    return this.#size; 
  }
  isEmpty() {
    return this.#size === 0; 
  }
  clear() { 
    this.#head = null; this.#tail = null; this.#size = 0; 
  }

  push_front(value) {
    const n = new Node(value);
    if (this.isEmpty()) {
      this.#head = n;
      this.#tail = n;
    } else {
      n.next = this.#head;
      this.#head.prev = n;
      this.#head = n;
    }
    this.#size++;
  }

  push_back(value) {
    const n = new Node(value);
    if (this.isEmpty()) {
      this.#head = n;
      this.#tail = n;
    } else {
      n.prev = this.#tail;
      this.#tail.next = n;
      this.#tail = n;
    }
    this.#size++;
  }

  pop_front() {
    if (this.isEmpty()) throw new Error("Linked list is empty");
    const value = this.#head.data;
    if (this.#size === 1) {
      this.#head = null;
      this.#tail = null;
    } else {
      this.#head = this.#head.next;
      this.#head.prev = null;
    }
    this.#size--;
    return value;
  }

  pop_back() {
    if (this.isEmpty()) throw new Error("Linked list is empty");
    const value = this.#tail.data;
    if (this.#size === 1) {
      this.#head = null;
      this.#tail = null;
    } else {
      this.#tail = this.#tail.prev;
      this.#tail.next = null;
    }
    this.#size--;
    return value;
  }

  front() {
    return this.#head?.data; 
  }
  back() {
    return this.#tail?.data; 
  }

  at(index) {
    if (index < 0 || index >= this.#size) throw new Error("Index out of bounds");
    let current = this.#head;
    for (let i = 0; i < index; i++) current = current.next;
    return current.data;
  }

  insert(index, value) {
    if (index < 0 || index > this.#size) throw new Error("Index out of bounds");
    if (index === 0) return this.push_front(value);
    if (index === this.#size) return this.push_back(value);

    let current = this.#head;
    for (let i = 0; i < index; i++) current = current.next;

    const n = new Node(value);
    n.prev = current.prev;
    n.next = current;
    current.prev.next = n;
    current.prev = n;
    this.#size++;
  }

  erase(index) {
    if (index < 0 || index >= this.#size) throw new Error("Index out of bounds");

    let current;
    if (index === 0) {
      current = this.#head;
      this.#head = this.#head.next;
      if (this.#head) this.#head.prev = null;
      else this.#tail = null;
    } else if (index === this.#size - 1) {
      current = this.#tail;
      this.#tail = this.#tail.prev;
      if (this.#tail) this.#tail.next = null;
      else this.#head = null;
    } else {
      current = this.#head;
      for (let i = 0; i < index; i++) current = current.next;
      current.prev.next = current.next;
      current.next.prev = current.prev;
    }

    this.#size--;
    return current.data;
  }

  remove(value, equals = Object.is) {
    let current = this.#head;
    while (current) {
      let next = current.next; 
      if (equals(current.data, value)) {
        if (current.prev) current.prev.next = current.next;
        else this.#head = current.next;

        if (current.next) current.next.prev = current.prev;
        else this.#tail = current.prev;

        this.#size--;
      }
      current = next;
    }
  }

  reverse() {
    let current = this.#head;
    this.#tail = this.#head;
    let prev = null;
    while (current) {
      const next = current.next;
      current.next = prev;
      current.prev = next;
      prev = current;
      current = next;
    }
    this.#head = prev;
  }

  sort(compareFn = (a, b) => a - b) {
    this.#head = this._mergeSort(this.#head, compareFn);
    let cur = this.#head;
    this.#tail = null;
    while (cur) {
      if (!cur.next) this.#tail = cur;
      cur = cur.next;
    }
  }

  _merge(left, right, compareFn) {
    if (!left) return right;
    if (!right) return left;

    let result;
    if (compareFn(left.data, right.data) <= 0) {
      result = left;
      result.next = this._merge(left.next, right, compareFn);
      if (result.next) result.next.prev = result;
    } else {
      result = right;
      result.next = this._merge(left, right.next, compareFn);
      if (result.next) result.next.prev = result;
    }
    result.prev = null;
    return result;
  }

  _mergeSort(head, compareFn) {
    if (!head || !head.next) return head;

    let slow = head, fast = head;
    while (fast.next && fast.next.next) {
      slow = slow.next;
      fast = fast.next.next;
    }

    let mid = slow.next;
    slow.next = null;
    if (mid) mid.prev = null;

    let left = this._mergeSort(head, compareFn);
    let right = this._mergeSort(mid, compareFn);

    return this._merge(left, right, compareFn);
  }

  print() {
    let res = [];
    let curr = this.#head;
    while (curr) {
      res.push(curr.data);
      curr = curr.next;
    }
    console.log(res.join(" <-> "));
  }
}


let list = new LinkedList([4,2,5,1,3]);
list.print();              

list.sort();
list.print();              

list.reverse();
list.print();              

list.erase(2);
list.print();              

list.remove(4);
list.print();              

list.push_front(10);
list.print();              

list.push_back(20);
list.print();              
