
const processDataChunk = async (dataChunk) => {
    // Simulate data processing time
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Perform actual data processing here
    // For demonstration purposes, we'll just log the data
    console.log('Processing chunk:', dataChunk);
};

const handleHighLoad = (dataStream, maxConcurrentProcesses = 5) => {
    const queue = [];
    let activeProcesses = 0;

    const processQueue = () => {
        while (queue.length > 0 && activeProcesses < maxConcurrentProcesses) {
            const currentChunk = queue.shift();
            processDataChunk(currentChunk)
                .then(() => {
                    activeProcesses--;
                    processQueue();
                })
                .catch((error) => {
                    console.error('Error processing chunk:', error);
                    activeProcesses--;
                    processQueue();
                });
            activeProcesses++;
        }
    };

    dataStream.on('data', (dataChunk) => {
        queue.push(dataChunk);
        processQueue();
    });

    dataStream.on('end', () => {
        console.log('Data stream processing completed.');
    });

    dataStream.on('error', (error) => {
        console.error('Error with data stream:', error);
    });
};

// Example usage:
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

const dataStream = readline;
handleHighLoad(dataStream);
