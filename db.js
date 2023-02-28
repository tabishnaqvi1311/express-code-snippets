const fs = require('fs');

const users = {
    emilia: {
        name: 'emilia',
        password: '777'
    },
    karan: { 
        name: 'karan',
        password: '12345678'
        },
    tabish: {
        name: 'tabish',
        password: '2244668800'
    },
    subaru: {
        name: 'subaru',
        password: 'iloveemilia'
    }
}
const arrOfvalues = Object.values(users);

for(const items in arrOfvalues){
    console.log(arrOfvalues[items].name, arrOfvalues[items].password);
}

// const arr = Object.keys(users);
// for (const item of arr) {
//     console.log(item);
// }
// for (const iterator of users) {
//     console.log(iterator);
// }
// const username = users.user.name;
// const password = users.user.password;
// console.log(`${username} ${password}`);

// const newUser = users.subaru;
// console.log(newUser.name, newUser.password);


module.exports = users;