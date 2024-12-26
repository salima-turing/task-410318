class DataProcessor {
    constructor(concurrencyLimit) {
        this.queue = [];
        this.concurrencyLimit = concurrencyLimit;
        this.currentlyProcessing = 0;
        this.maxQueueSize = 100; // Adjust as needed
    }

    enqueue(data) {
        if (this.queue.length < this.maxQueueSize) {
            this.queue.push(data);
            this.processQueue();
        } else {
            console.warn('Queue is full. Data will be dropped or handled later.');
        }
    }

    async processQueue() {
        while (this.currentlyProcessing < this.concurrencyLimit && this.queue.length > 0) {
            const data = this.queue.shift(); // Get the next data item
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

// Simulate incoming data
setInterval(() => {
    const incomingData = { timestamp: Date.now(), value: Math.random() };
    processor.enqueue(incomingData);
}, 200); // Simulating incoming data every 200ms
