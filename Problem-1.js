// Problem 1:
    
//     Using callbacks and the fs module's asynchronous functions, do the following:
//         1. Create a directory of random JSON files

//         2. Delete those files simultaneously 

const fs = require('fs');

function deletefiles_fun(path){
    fs.unlink(path, (err) => {
        if(err){
            console.log(err.message);
            return;
        }
    });

    return;
}

function writing_files(path,data){
    fs.writeFile(path, data, (err) => {
        if(err){
            console.log(err.message);
            return;
        }      
    });

    return;
}



function create_folders_files(cb){
    console.log('starting Folder Creation');
    cb();
}

function create_folder(cb){
    fs.mkdir('./randomFolder', (err) => {
        if(err){
            console.log(err.message)
            return;
        }
        console.log('folder is created');
        cb();
    })
    return;
}

function create_files(arr,data,cb){
    for(let index of arr){
        writing_files(`./randomFolder/${index}`, JSON.stringify(data,null,2));
        console.log('file is created',index);
    }
    cb();
    return;
}

function delete_files(arr){

    for(let index of arr){
        deletefiles_fun(`./randomFolder/${index}`);
        console.log('file is deleted',index);
    }
    return;
}

let arr = ['1.json', '2.json' , '3.json'];
let data = [
    {
        name : '1',
        age : 45
    },
    {
        name : '2',
        age : 45
    },
    {
        name : '3',
        age : 45
    },
    {
        name : '4',
        age : 45
    }
];


create_folders_files( () => {
    create_folder( () => {
        create_files(arr,data,() => {
            delete_files(arr);
        })
    })
})

