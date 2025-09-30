const quickSort = (arr, low = 0, high = arr.length - 1) => {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

const swap = (arr,i,j) => {
  [arr[i],arr[j]] = [arr[j],arr[i]];
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

const partition = (arr,low,high) => {
  let pivot = arr[low];
  let i = low - 1;
  let j = high + 1;
  
  while(true) {
    do{
      i++;
    }while (arr[i] < pivot);

    do{
      j--;
    }while(arr[j] > pivot);

    if(i >= j) {
      return j;
    }
  
    swap(arr,i,j);
  }
}

const arr = [14,1,5,6,8,7];
console.log("Sorted array:", quickSort(arr));
console.log("Is sorted?", isSorted(arr));