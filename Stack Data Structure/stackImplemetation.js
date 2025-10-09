class Stack {
  #size = 0;
  constructor() {
    this.items = [];
  }

  push(value) {
    this.items[this.#size] = value;
    this.#size++;
  }

  pop() {
    if (this.isEmpty()) throw new Error("Array is Empty");
    let value = this.items[this.#size - 1];
    this.#size--;
    return value;
  }

  peek() {
    if (this.isEmpty()) throw new Error("Array is Empty");
    return this.items[this.#size - 1];
  }

  isEmpty() {
    return this.#size === 0;
  }

  size() {
    return this.#size;
  }

  clear() {
    this.#size = 0;
  }

  printStack() {
    let str = "";
    for (let i = 0; i < this.#size; i++) {
      str += this.items[i] + " ";
    }
    return str.trim();
  }
}

const myStack = new Stack();

myStack.push(10);
myStack.push(20);
myStack.push(30);

console.log(myStack.printStack());
console.log(myStack.size());
let topElement = myStack.peek();
console.log(topElement);

let poppedElement = myStack.pop();
console.log(poppedElement);

console.log(myStack.printStack());
console.log(myStack.size());

myStack.clear();
console.log(myStack.isEmpty());
