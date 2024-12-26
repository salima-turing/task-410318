class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(data, priority) {
        const item = { data, priority };
        this.queue.push(item);
        this.queue.sort((a, b) => b.priority - a.priority); // Sort by priority (higher first)
    }

    dequeue() {
        return this.queue.shift(); // Remove and return the first item
    }

    get length() {
        return this.queue.length;
    }
}

class DataProcessor {
    constructor(concurrencyLimit) {
        this.queue = new PriorityQueue();
        this.concurrencyLimit = concurrencyLimit;
        this.currentlyProcessing = 0;
        this.maxQueueSize = 100; // Adjust as needed
    }

    enqueue(data, priority = 0) { // Default priority is 0 (normal)
        if (this.queue.length < this.maxQueueSize) {
            this.queue.enqueue(data, priority);
            this.processQueue();
        } else {
            console.warn('Queue is full. Data will be dropped or handled later.');
        }
    }

    async processQueue() {
        while (this.currentlyProcessing < this.concurrencyLimit && this.queue.length > 0) {
            const { data } = this.queue.dequeue(); // Get the next high-priority data item
            this.currentlyProcessing++;
            this.processData(data).finally(() => {
                this.currentlyProcessing--;
                this.processQueue(); // Continue processing the next item
            });
        }
    }

    async processData(data) {
        try {
            // Simulate data processing (replace with actual logic)
            await this.simulateAsyncProcessing(data);
        } catch (error) {
            console.error('Error processing data:', error);
            // Implement retry logic or error handling as needed
        }
    }

    async simulateAsyncProcessing(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Processed data:', data);
                resolve();
            }, Math.random() * 1000); // Simulate variable processing time
        });
    }
}

// Example usage
const processor = new DataProcessor(5); // Allow up to 5 concurrent processes

// Simulate incoming data with varying priorities
setInterval(() => {
    const incomingData = { timestamp: Date.now(), value: Math.random() };
    const priority = Math.floor(Math.random() * 10); // Random priority between 0 and 9
    processor.enqueue(incomingData, priority);
}, 200); // Simulating incoming data every 200ms
