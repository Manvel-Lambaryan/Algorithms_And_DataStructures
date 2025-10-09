class Queue {
  #front = 0;
  #rear = 0;
  constructor() {
    this.items = [];
  }

  enqueue(value) {
    this.items[this.#rear] = value;
    this.#rear++;
  }

  dequeue() {
    if (this.isEmpty()) throw new Error("Queue is Empty");
    const removedElement = this.items[this.#front];
    this.#front++;
    if (this.#front === this.#rear) {
      this.#front = 0;
      this.#rear = 0;
      this.items = [];
    }
    return removedElement;
  }

  isEmpty() {
    return this.#front === this.#rear;
  }

  clear() {
    this.#rear = 0;
  }

  size() {
    return this.#rear;
  }

  front() {
    return this.#front;
  }

  print() {
    if (this.isEmpty()) {
      console.log("Queue is empty");
    } else {
      let result = "";
      for (let i = this.#front; i < this.#rear; i++) {
        result += this.items[i] + (i < this.#rear - 1 ? " <- " : "");
      }
      console.log(result);
    }
  }
}

const q = new Queue();
q.enqueue(10);
q.enqueue(20);
q.enqueue(30);
q.dequeue();
q.print();
