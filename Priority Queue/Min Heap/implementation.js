class MinHeap {
  constructor() {
    this.heap = [];
  }

  parent(i) {
    return Math.floor((i - 1) / 2);
  }
  left(i) {
    return 2 * i + 1;
  }
  right(i) {
    return 2 * i + 2;
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  push(value) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  heapifyUp(i) {
    while (i > 0 && this.heap[i] < this.heap[this.parent(i)]) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return root;
  }

  heapifyDown(i) {
    let smallest = i;
    let left = this.left(i);
    let right = this.right(i);

    if (left < this.heap.length && this.heap[left] < this.heap[smallest])
      smallest = left;
    if (right < this.heap.length && this.heap[right] < this.heap[smallest])
      smallest = right;

    if (smallest !== i) {
      this.swap(i, smallest);
      this.heapifyDown(smallest);
    }
  }

  peek() {
    return this.heap.length === 0 ? null : this.heap[0];
  }

  size() {
    return this.heap.length;
  }
}

const minHeap = new MinHeap();
minHeap.push(10);
minHeap.push(3);
minHeap.push(5);
minHeap.push(1);

console.log(minHeap.pop());
console.log(minHeap.pop());
console.log(minHeap.peek());
