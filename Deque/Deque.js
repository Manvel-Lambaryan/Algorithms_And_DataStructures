class BucketDeque {
  constructor(bucketCount = 4, bucketSize = 8) {
    this.bucketCount = bucketCount;
    this.bucketSize = bucketSize;
    this.buckets = Array.from({ length: bucketCount }, () =>
      new Array(bucketSize).fill(null)
    );

    this.frontBucket = 1;
    this.frontIndex = bucketSize - 1;

    this.backBucket = 2;
    this.backIndex = 0;

    this.size = 0;
  }

  _moveFrontLeft() {
    this.frontIndex--;
    if (this.frontIndex < 0) {
      this.frontBucket--;
      this.frontIndex = this.bucketSize - 1;
      if (this.frontBucket < 0) {
        this._resize(true);
      }
    }
  }

  _moveBackRight() {
    this.backIndex++;
    if (this.backIndex >= this.bucketSize) {
      this.backBucket++;
      this.backIndex = 0;
      if (this.backBucket >= this.bucketCount) {
        this._resize(false);
      }
    }
  }

  _resize(front) {
    const newBucketCount = this.bucketCount * 2;
    const newBuckets = Array.from({ length: newBucketCount }, () =>
      new Array(this.bucketSize).fill(null)
    );

    const shift = Math.floor((newBucketCount - this.bucketCount) / 2);

    for (let i = 0; i < this.bucketCount; i++) {
      newBuckets[i + shift] = [...this.buckets[i]];
    }

    this.frontBucket += shift;
    this.backBucket += shift;
    this.bucketCount = newBucketCount;
    this.buckets = newBuckets;
  }

  pushFront(value) {
    this.buckets[this.frontBucket][this.frontIndex] = value;
    this.size++;
    this._moveFrontLeft();
  }

  pushBack(value) {
    this.buckets[this.backBucket][this.backIndex] = value;
    this.size++;
    this._moveBackRight();
  }

  print() {
    for (let i = 0; i < this.bucketCount; i++) {
      const row = this.buckets[i].map((v) => (v === null ? "." : v)).join(",");
      console.log(`bucket_${i} : [${row}]`);
    }
  }
}

const dq = new BucketDeque();

for (let i = 0; i <= 6; i++) dq.pushBack(i);

dq.print();
