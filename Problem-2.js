// 1. Read the given file lipsum.txt
// 2. Convert the content to uppercase & write to a new file. Store the name of the new file in filenames.txt
// 3. Read the new file and convert it to lower case. Then split the contents into sentences. Then write it to a new file. Store the name of the new file in filenames.txt
// 4. Read the new files, sort the content, write it out to a new file. Store the name of the new file in filenames.txt
// 5. Read the contents of filenames.txt and delete all the new files that are mentioned in that list simultaneously.

const fs = require('fs');

function write_file(path,name){
    fs.writeFile(path,name, (err) => {
        if(err){
            console.log(err.message);
            return;
        }
    })
}

function write_file_cb(path,name,cb){
    fs.writeFile(path,name, (err) => {
        if(err){
            console.log(err.message);
            return;
        }
        cb();
    })
}

function append_file(path,data){
    fs.appendFile(path, data, (err) => {
        if(err){
            console.log(err.message);
            return;
        }
    })
}

function append_file_cb(path,data,cb){
    fs.appendFile(path, data, (err) => {
        if(err){
            console.log(err.message);
            return;
        }
        cb();
    })
}

function read_lipsum(cb){
    fs.readFile( '../lipsum.txt', 'utf-8', (err,data) => {
        if(err) {
            console.log(err.message)
            return;
        }
        cb(data);
    })
}

function upper_Case(data,cb){
    const upper_case_data = data.toUpperCase();
    let file_name = '../Upper_Case_Data.txt';
    write_file('../filenames.txt',`${file_name}\n`);
    
    write_file_cb(`${file_name}`, upper_case_data, cb);
}


function lower_Case(cb){
    const lower_case_data = fs.readFile('../Upper_Case_Data.txt', 'utf-8', (err,data) => {

        let lower_data = data.toLowerCase();

        lower_data = lower_data.split('. ');

        let file_name = '../Lower_Case_Data.txt';

        append_file('../filenames.txt', `${file_name}\n`);

        let val = lower_data.join("\n");

        write_file_cb(`${file_name}`, val, cb);
    });
}

function both_files(cb){
    fs.readFile('../Upper_Case_Data.txt', 'utf-8', (err,file1_data) => {
        if(err){
            console.log(err.message);
            return;
        }
        fs.readFile('../Lower_Case_Data.txt', 'utf-8', (err,file2_data) => {
            if(err){
                console.log(err.message);
                return;
            }
            const combinedText = `${file1_data}}\n${file2_data}`;

            let sentences = combinedText
                .split(". ").sort().join(".\n")
           
            let file_name = '../file3.txt';
            write_file(file_name, sentences);
            append_file_cb('../filenames.txt',`${file_name}\n`,cb)
        })
    })
}

function deleteing_files(){
    fs.readFile('../filenames.txt','utf-8', (err,data) => {
        if(err){
            console.log(err.message);
            return;
        }
        let arr = data.split('\n');
        for(let index of arr){
            if(fs.existsSync(`${index}`)){
                fs.unlink( `${index}`,(err) => {
                    if(err){
                        console.log(err.message);
                        return;
                    }
                    console.log('deleted the file',index);
                })
            }
        }
    })
}


function callback_hell(){
    read_lipsum((data) => {
        console.log("Original Data Read:");
        upper_Case(data, () => {
            console.log("Uppercase Data Processed.");
            lower_Case(() => {
                console.log("Lowercase Data Processed.");
                both_files( () => {
                    deleteing_files();
                });
            });
        });
    });
}

module.exports = callback_hell;