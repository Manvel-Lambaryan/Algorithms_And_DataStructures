function countingSort(arr) {
    if (arr.length === 0) return [];

    let min = Math.min(...arr);
    let max = Math.max(...arr);
    let count = new Array(max - min + 1).fill(0);
    for (let num of arr) {
        count[num - min]++;
    }
    for (let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
    }
    let output = new Array(arr.length);
    for (let i = arr.length - 1; i >= 0; i--) {
        let num = arr[i];
        let index = count[num - min] - 1;
    output[index] = num;
        count[num - min]--;
    }
    return output;
}

let numbers = [4, -1, 2, -3, 4, 0, 2];
console.log(countingSort(numbers));
