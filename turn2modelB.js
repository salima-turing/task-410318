class PriorityQueue {
  constructor() {
    this.heap = [];
    this.compareFn = (a, b) => b.priority - a.priority; // Default comparison: higher priority is first
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  size() {
    return this.heap.length;
  }

  enqueue(task, priority) {
    const newNode = { task, priority };
    let index = this.heap.length;

    this.heap.push(newNode);

    while (index > 0) {
      const parentIndex = (index - 1) >>> 1; // Parent index
      const parent = this.heap[parentIndex];

      if (this.compareFn(newNode, parent) <= 0) {
        break;
      }

      this.heap[index] = parent;
      index = parentIndex;
    }

    this.heap[index] = newNode;
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }

    const root = this.heap[0];
    const lastNode = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = lastNode;
      let index = 0;

      while (2 * index + 1 < this.heap.length) {
        let childIndex = 2 * index + 1;

        if (childIndex + 1 < this.heap.length && this.compareFn(this.heap[childIndex + 1], this.heap[childIndex]) > 0) {
          childIndex++;
        }

        if (this.compareFn(this.heap[index], this.heap[childIndex]) >= 0) {
          break;
        }

        this.heap[index] = this.heap[childIndex];
        index = childIndex;
      }

      this.heap[index] = lastNode;
    }

    return root.task;
  }
}

class DataProcessor {
  constructor(concurrencyLimit) {
    this.queue = new PriorityQueue();
    this.concurrencyLimit = concurrencyLimit;
    this.currentlyProcessing = 0;
    this.maxQueueSize = 100; // Adjust as needed
  }

  enqueue(data, priority = 0) {
    if (this.queue.size() < this.maxQueueSize) {
      this.queue.enqueue(data, priority);
      this.processQueue();
    } else {
      console.warn('Queue is full. Data will be dropped or handled later.');
    }
  }

  async processQueue() {
    while (this.currentlyProcessing < this.concurrencyLimit && !this.queue.isEmpty()) {
      const data = this.queue.dequeue();
      this.currentlyProcessing++;
      await this.processData(data).finally(() => {
        this.currentlyProcessing--;
        this.processQueue(); // Continue processing the next item
      });
    }
  }

  // ... (The rest of the code remains the same)
}

// Example usage
const processor = new DataProcessor(5);

setInterval(() => {
  const incomingData = { timestamp: Date.now(), value: Math.random() };
  // High priority data
  processor.enqueue(incomingData, Math.random() * 10); // Assign random priority between 0 and 10
}, 200);

setInterval(() => {
  const incomingData = { timestamp: Date.now(), value: Math.random() * 100 };
  // Low priority data
  processor.enqueue(incomingData); // Assign default priority 0
}, 100);
