// 1. Read the given file lipsum.txt
// 2. Convert the content to uppercase & write to a new file. Store the name of the new file in filenames.txt
// 3. Read the new file and convert it to lower case. Then split the contents into sentences. Then write it to a new file. Store the name of the new file in filenames.txt
// 4. Read the new files, sort the content, write it out to a new file. Store the name of the new file in filenames.txt
// 5. Read the contents of filenames.txt and delete all the new files that are mentioned in that list simultaneously.

const fs = require('fs');

function writeFile(filePath, data, message, callback) {
    fs.writeFile(filePath, data, 'utf-8', (err) => {
        if (err) return console.error(err.message);
        console.log(message);
        callback();
    });
}

function appendFile(filePath, data, callback) {
    fs.appendFile(filePath, data, 'utf-8', (err) => {
        if (err) return console.error(err.message);
        callback();
    });
}

function readFile(filePath, callback) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) return console.error(err.message);
        callback(data);
    });
}

function processLipsum(callback) {
    readFile('../lipsum.txt', (data) => {
        console.log("Original Data Read:");
        writeFile('Upper_Case_Data.txt', data.toUpperCase(), "Uppercase Data Processed.", () => {
            appendFile('filenames.txt', 'Upper_Case_Data.txt\n', callback);
        });
    });
}

function processLowerCase(callback) {
    readFile('Upper_Case_Data.txt', (data) => {
        writeFile('Lower_Case_Data.txt', data.toLowerCase().split('. ').join('\n'), "Lowercase Data Processed.", () => {
            appendFile('filenames.txt', 'Lower_Case_Data.txt\n', callback);
        });
    });
}

function processSorting(callback) {
    readFile('Upper_Case_Data.txt', (upperCaseData) => {
        readFile('Lower_Case_Data.txt', (lowerCaseData) => {
            const combinedText = `${upperCaseData}\n${lowerCaseData}`
                .split('. ')
                .sort()
                .join('.\n');

            writeFile('file3.txt', combinedText, "Sorted Data Processed.", () => {
                appendFile('filenames.txt', 'file3.txt\n', callback);
            });
        });
    });
}

function deleteAllFiles(callback) {
    readFile('filenames.txt', (data) => {
        const filesToDelete = data.split('\n').filter((file) => file.trim());

        function deleteNext(index) {
            if (index >= filesToDelete.length) return callback();

            const filePath = filesToDelete[index];
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) return console.error(err.message);
                    console.log(`Deleted file: ${filePath}`);
                    deleteNext(index + 1);
                });
            } else {
                deleteNext(index + 1);
            }
        }

        deleteNext(0);
    });
}

function runPipeline() {
    processLipsum(() => {
        processLowerCase(() => {
            processSorting(() => {
                deleteAllFiles(() => {
                    console.log("All files deleted successfully.");
                });
            });
        });
    });
}

module.exports = runPipeline;

//updated the file 
