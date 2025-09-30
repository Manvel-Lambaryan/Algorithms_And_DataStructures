const quickSort = (arr, low = 0, high = arr.length - 1) => {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi, high);
  }
  return arr;
}

const swap = (arr, i, j) => {
  [arr[i], arr[j]] = [arr[j], arr[i]];
  return arr;
}

const isSorted = (arr) => {
  for (let i = 1; i < arr.length; ++i) {
    if (arr[i] < arr[i - 1]) {
      return false;
    }
  }
  return true;
}

const partition = (arr, low, high) => {
  let mid = Math.floor(low + (high - low) / 2);

  if (arr[low] > arr[mid]) swap(arr, low, mid);
  if (arr[low] > arr[high]) swap(arr, low, high);
  if (arr[mid] > arr[high]) swap(arr, mid, high);

  let pivot = arr[high];
  let i = low - 1;
  let j = high;

  while (true) {
    do { 
      i++; 
    } while (arr[i] < pivot);

    do { 
      j--; 
    } while (arr[j] > pivot);

    if (i >= j) return i;

    swap(arr, i, j);
  }
}

const arr = [7, 5, 2, 6, 8, 90, 1];
console.log("Sorted array:", quickSort(arr));
console.log("Is sorted?", isSorted(arr));