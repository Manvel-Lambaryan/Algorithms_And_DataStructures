class DArray {
  #size = 0;
  #capacity = 0;
  #arr = null;
  #CAP_EXPONENT = 2;

  constructor(cap) {
    this.#capacity = cap;
    this.#arr = new Uint32Array(cap);
  }
  
  resize(new_cap,fill = 0) {
      const tmp = new Uint32Array(new_cap);
      for(let i = 0; i < this.#size; ++i) tmp[i] = this.#arr[i];
      for(let i = this.#size; i < new_cap; ++i) tmp[i] = fill;
      this.#capacity = new_cap;
      this.#arr = tmp;
    }

  push_back(elem) {
    if(this.#size === this.#capacity) {
      this.resize(this.#capacity * 2);
    }
    this.#arr[this.#size++] = elem;
  }

  size() {
    return this.#size;
  }

  capacity() {
    return this.#capacity;
  }

  empty(){
    return this.#size === 0;
  }

  pop_back() {
    if(this.empty()) throw new Error('Array is Empty');
    return this.#arr[--this.#size];
  }

  t(i) {
    if(i < 0 || i >= this.#size) throw new Error('UNDEFINED');
    return this.#arr[i];
  }

  set(i, value) {
    if(i < 0 || i >= this.#size) throw new Error('This index is not defined');
    return this.#arr[i] = value;
  }

  front() {
    if(this.empty()) throw new Error('Array is Empty');
    return this.#arr[0];
  }

  back() {
    if(this.empty()) throw new Error('Array is Empty');
    return this.#arr[this.#size - 1];
  }

  clear() {
    this.#size = 0;
  }

  insert(pos, value) {
    this.push_back(0);
    for (let i = this.#size - 1; i > pos; i--) {
    this.#arr[i] = this.#arr[i - 1];
    }
    this.#arr[pos] = value;
  }

   erase(pos) {
    if (pos < 0 || pos >= this.#size) throw new Error('Index out of bounds');
    for (let i = pos; i < this.#size - 1; i++) {
      this.#arr[i] = this.#arr[i + 1];
    }
    this.#size--;
  }

  swap(i,j) {
    [this.#arr[i],this.#arr[j]] = [this.#arr[j],this.#arr[i]];
  }

  toArray() {
    return Array.from(this.#arr.slice(0, this.#size));
  }

  [Symbol.iterator]() {
    let index = 0;
    const arr = this.#arr;
    const size = this.#size;
    return {
      next() {
        if (index < size) return { value: arr[index++], done: false };
        return { value: undefined, done: true };
      },
    };
  }

  map(fn) {
    const res = new DArray(this.#size);
    for(let i = 0; i < this.#size; ++i) {
      res.push_back(fn(this.#arr[i],i))
    };
    return res;
  }

  filter(fn) {
    const res = new DArray(this.#size);
    for(let i = 0; i < this.#size; ++i) {
      if(fn(this.#arr[i],i)) {
        res.push_back(fn(this.#arr[i],i));
      }
    }
    return res;
  }

  reduce(fn, init) {
    let acc = init;
    let start = 0;
    if(acc === undefined) {
      if(this.#size === 0) {
        throw new Error('Empty');
        acc = this.#arr[0];
        start = 1;
      }
    }

    for(let i = start; i < this.#size; ++i) {
      acc = fn(this.#arr[i], i);
    }

    return acc;
  } 

  some(fn) {
    for(let i = 0; i < this.#size; ++i) {
      if(fn(this.#arr[i],i)) {
        return true;
      }
    }
    return false;
  }

  every(fn) {
    for(let i = 0; i < this.#size; ++i) {
      if(!(fn(this.#arr[i],i))) {
        return false;
      }
    }
    return true;
  }

  find(fn) {
    for(let i = 0; i < this.#size; ++i) {
      if(fn(this.#arr[i],i)) {
        return this.#arr[i];
      }
    }
    return undefined;
  }

  findIndex(fn) {
    for(let i = 0; i < this.#size;++i) {
      if(fn(this.#arr[i],i)) {
        return i;
      }
    }
    return -1;
  }

  includes(value) {
    for(let i = 0; i < this.#size; ++i) {
      if(value === this.#arr[i]){
        return true;
      }
    }
    return false;
  }
}

const arr = new DArray(4);

arr.push_back(10);
arr.push_back(20);
arr.push_back(30);

console.log(arr.t(0)); 
console.log(arr.front()); 
console.log(arr.back()); 

arr.set(1, 25);
console.log(arr.t(1)); 

arr.pop_back(); 

arr.insert(1, 15); 
arr.erase(0);     

for (const val of arr) {
  console.log(val);
}

const doubled = arr.map(x => x * 2);
const filtered = arr.filter(x => x > 10);
const sum = arr.reduce((acc, x) => acc + x, 0);

console.log(doubled.toArray());
console.log(filtered.toArray());
console.log(sum);
