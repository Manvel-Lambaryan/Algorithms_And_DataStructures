# DArray - Dynamic Array in JavaScript

`DArray` is a custom implementation of a dynamic array in JavaScript, similar to C++'s `std::vector`. It uses a `Uint32Array` internally to store elements efficiently while supporting dynamic resizing. This class provides array-like methods including `push_back`, `pop_back`, `insert`, `erase`, and higher-order methods like `map`, `filter`, and `reduce`.

---

## Features

- **Dynamic resizing**: Automatically doubles capacity when full.
- **Random access**: Access elements by index using `t(i)` or `set(i, value)`.
- **Front and back access**: `front()` and `back()`.
- **Array operations**: `push_back()`, `pop_back()`, `insert()`, `erase()`, `clear()`.
- **Higher-order functions**: `map()`, `filter()`, `reduce()`, `some()`, `every()`, `find()`, `findIndex()`, `includes()`.
- **Iteration support**: Implements `[Symbol.iterator]` for `for...of` loops.
- **Size & capacity**: `size()` and `capacity()`.
