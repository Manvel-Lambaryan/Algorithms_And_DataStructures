const quickSort = (arr, low = 0, high = arr.length - 1) => {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi);
    quickSort(arr, pi + 1, high);
  }
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

const swap = (arr, i, j) => {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

const partition = (arr, low, high) => {
  let pivot = arr[high - 1];   
  let i = low - 1;
  let j = high + 1; 

  while (true) {
    do { 
      i++; 
    } while (arr[i] < pivot);

    do { 
      j--; 
    } while (arr[j] > pivot);

    if (i >= j) return j; 

    swap(arr, i, j);
  }
}

const arr = [4, 1, 5, 6, 1, 6, 7, 8];
console.log("Sorted array:", quickSort(arr));
console.log("Is sorted?", isSorted(arr));