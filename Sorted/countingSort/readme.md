# Counting Sort Analysis

## Time Complexity:
- **O(n + k)**  
  n = զանգվածի երկարությունը, k = max - min + 1 (range of values)
- Best, Average, Worst → նույն բանն է, քանի որ պետք է հաշվել occurrences ու cumulative count

## Space Complexity:
- **O(n + k)**  
  n → output array, k → count array

## When is Counting Sort efficient:
- Լավ է, երբ `k` փոքր է համեմատած `n`–ի (օրինակ, small integer range)  
- Չի լավ, եթե արժեքների range–ը շատ մեծ է, քանի որ այն առաջացնում է մեծ count array  
- Աշխատում է ավելի արագ, քան comparison-based sort (O(n log n)), երբ range փոքր է
