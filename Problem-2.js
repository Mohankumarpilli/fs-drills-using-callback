// 1. Read the given file lipsum.txt
// 2. Convert the content to uppercase & write to a new file. Store the name of the new file in filenames.txt
// 3. Read the new file and convert it to lower case. Then split the contents into sentences. Then write it to a new file. Store the name of the new file in filenames.txt
// 4. Read the new files, sort the content, write it out to a new file. Store the name of the new file in filenames.txt
// 5. Read the contents of filenames.txt and delete all the new files that are mentioned in that list simultaneously.

const fs = require('fs');
const path = require('path');

const UPPER_CASE_FILE = path.join(__dirname, 'Upper_Case_Data.txt');
const LOWER_CASE_FILE = path.join(__dirname, 'Lower_Case_Data.txt');
const SORTED_FILE = path.join(__dirname, 'file3.txt');
const FILENAMES_FILE = path.join(__dirname, 'filenames.txt');

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
    readFile(path.join(__dirname, 'lipsum.txt'), (data) => {
        console.log("Original Data Read:");
        writeFile(UPPER_CASE_FILE, data.toUpperCase(), "Uppercase Data Processed.", () => {
            appendFile(FILENAMES_FILE, `${UPPER_CASE_FILE}\n`, callback);
        });
    });
}

function processLowerCase(callback) {
    readFile(UPPER_CASE_FILE, (data) => {
        writeFile(LOWER_CASE_FILE, data.toLowerCase().split('. ').join('\n'), "Lowercase Data Processed.", () => {
            appendFile(FILENAMES_FILE, `${LOWER_CASE_FILE}\n`, callback);
        });
    });
}

function processSorting(callback) {
    readFile(UPPER_CASE_FILE, (upperCaseData) => {
        readFile(LOWER_CASE_FILE, (lowerCaseData) => {
            const combinedText = `${upperCaseData}\n${lowerCaseData}`
                .split('. ')
                .sort()
                .join('.\n');

            writeFile(SORTED_FILE, combinedText, "Sorted Data Processed.", () => {
                appendFile(FILENAMES_FILE, `${SORTED_FILE}\n`, callback);
            });
        });
    });
}

function deleteAllFiles(callback) {
    readFile(FILENAMES_FILE, (data) => {
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
