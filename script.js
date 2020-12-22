'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  username: 'js',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  username: 'jd',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  username: 'stw',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  username: 'ss',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (movement, index) {
    let trans = 'deposit';

    if (movement > 0) trans = 'deposit';
    else trans = 'withdrawal';
    let html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${trans}">${
      index + 1
    } ${trans} </div>
    
    <div class="movements__value">${movement}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
  // console.log(containerMovements.innerHTML);
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

let compuser = function (name) {
  let username = [];
  username.push(name[0]);
  for (let i in name) {
    if (name[i] == ' ') {
      username.push(name[Number(i) + 1]);
      // console.log(name[Number(i) + 1]);
      // console.log();
    }
  }
  // console.log(username);
  let finalusername = username.join('');
  return finalusername;
};

// console.log(compuser('Asher Mathews Shaji')); // let covrate = 1.1;

let usernames = accounts.map(function (acc) {
  acc.username = compuser(acc.owner).toLowerCase();
});

let calcDisplayPrintBalance = function (movs) {
  let balance = movs.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  // return balance;
  labelBalance.textContent = balance + '€';
};

let maxfinder = function (mov) {
  let maximum = mov.reduce(function (max, curr, i) {
    if (i == 0) max = curr;
    if (curr > max) {
      max = curr;
    }
    return max;
  });
  return maximum;
};
let covrate = 1.1;
let final = movements
  .filter(function (curr) {
    return curr > 0;
  })
  .map(function (curr) {
    return curr * covrate;
  })
  .reduce(function (acc, curr) {
    return (acc += curr);
  });

let calcDisplaySummary = function (user) {
  let incomes = user.movements
    .filter(function (curr) {
      return curr > 0;
    })
    .reduce(function (acc, curr) {
      acc += curr;
      return acc;
    });
  labelSumIn.textContent = incomes + '€';

  let outcomes = user.movements
    .filter(function (curr) {
      return curr < 0;
    })
    .reduce(function (acc, curr) {
      acc += curr;
      return acc;
    });
  labelSumOut.textContent = Math.abs(outcomes) + '€';

  labelSumInterest.textContent = (incomes + outcomes) * user.interestRate;
};

let currentuser = '';

let upodateUserInterface = function () {
  displayMovements(currentuser.movements);
  calcDisplayPrintBalance(currentuser.movements);
  calcDisplaySummary(currentuser);
};
///Event LIstener
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentuser = accounts.find(function (curr) {
    return curr.username == inputLoginUsername.value;
  });
  console.log(currentuser);
  console.log(currentuser.pin);
  if (currentuser.pin == Number(inputLoginPin.value)) {
    console.log('LOgin');
    containerApp.style.opacity = 1;
    upodateUserInterface();
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();
  }
  let min = 4;
  let sec = 59;
  let fooo = setInterval(function () {
    labelTimer.innerHTML = `${min}:${sec}`;
    if (sec == 0) {
      min -= 1;
      sec = 59;
    }

    if (min <= 0 && sec <= 0) {
      clearInterval(fooo);
      location.reload();
    }
    if (min < 0) {
      clearInterval(fooo);
      location.reload();
    }

    sec -= 1;
  }, 1000);
});

//Trasnsfer Functionality
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  let total = currentuser.movements.reduce(function (acc, curr) {
    acc += curr;
    return acc;
  });
  if (inputTransferAmount.value > 0 && inputTransferAmount.value < total) {
    console.log(inputTransferTo.value);
    console.log(inputTransferAmount.value);
    let touser = accounts.find(function (curr) {
      return curr.username == inputTransferTo.value;
    });
    console.log(touser);
    touser.movements.push(Number(inputTransferAmount.value));
    currentuser.movements.push(-Number(inputTransferAmount.value));
    upodateUserInterface();
    console.log(touser.movements);
  } else {
    console.log('Cant Tranfer');
  }
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
});

//Requesting Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let eligibleloan = false;
  let amount = inputLoanAmount.value;
  amount = amount * 0.1;
  eligibleloan = currentuser.movements.some(function (curr) {
    return curr > amount;
  });
  if (eligibleloan) {
    currentuser.movements.push(Number(inputLoanAmount.value));
    inputLoanAmount.value = '';
    upodateUserInterface();
  } else {
    inputLoanAmount.value = '';
    upodateUserInterface();
  }
});

//Sorting
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('Sort');

  for (let i = 0; i <= currentuser.movements.length; ++i) {
    for (let j = 0; j < currentuser.movements.length; ++j) {
      if (currentuser.movements[j] > currentuser.movements[j + 1]) {
        let temp = currentuser.movements[j];
        currentuser.movements[j] = currentuser.movements[j + 1];
        currentuser.movements[j + 1] = temp;
      }
    }
  }
  // let final = currentuser.movements.sort();
  console.log(currentuser.movements);
  upodateUserInterface();
});

//Closing Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  let user = accounts.find(function (curr) {
    return curr.username == inputCloseUsername.value;
  });
  if (user.pin == inputClosePin.value) {
    let rmindex = accounts.findIndex(function (curr) {
      return user.username == curr.username;
    });
    console.log(rmindex);

    console.log(accounts);
    upodateUserInterface();
  }
});

// console.log('finish');

// console.log(final);

// console.log(newarray);
// console.log(maxfinder(movements));

// console.log(maxfinder(movements));
// console.log(maximum);
// console.log(calcPrintBalance(movements));
// console.log(accounts);

// console.log(withdrawals);
// console.log(account1);
// console.log(usernames);
// let newArray = [];

// newArray = movements.map(function (i, j) {
//   return `transaction ${j} ${i > 0 ? 'withdrew' : 'deposited'} ${Math.abs(i)} USD `;
// });

// console.log(newArray);

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];
// // console.log(arr);
// // let arrslice = arr.slice(1, 3);
// // consoe.log(arrslice);
// // let [a, b] = [arr.splice(2), arr];
// // console.log(a, b);
// console.log(arr.reverse());
// console.log(arr);
// let newarr = [];
// // console.log(newarr);
// for (let i in arr) {
//   newarr.push(arr[arr.length - i - 1]);
// }
// console.log(newarr);
// console.log(arr.concat(newarr));
// for (let [j, i] of movements.entries()) {
//   if (i > 0) console.log(j + 1 + '.Deposit ' + Math.abs(i));
//   else console.log(j + 1 + '.WithDrew ' + Math.abs(i));
// }
// console.log('|||||||||||||||||');
// movements.forEach(function (i, j, ja) {
//   if (i > 0) console.log(j + 1 + '.Deposit ' + Math.abs(i));
//   else console.log(j + 1 + '.WithDrew ' + Math.abs(i));

//   console.log(ja);
// });
// console.log(movements.entries());

// let dogchecker = function (array) {
//   array.forEach(function (age, no) {
//     console.log(`Dog No${no + 1} is ${age > 3 ? 'An Adult' : 'Not An adult'}`);
//   });
// };
// // dogchecker();

// let juliaDog = [9, 16, 6, 8, 3];
// let KateDog = [10, 5, 6, 1, 4];
// // console.log(juliaDog.length);
// let ojuliaDog = juliaDog.splice(1, juliaDog.length - 3);
// // console.log(ojuliaDog);
// let mainarray = [...ojuliaDog, ...KateDog];
// dogchecker(mainarray);
// console.log('{  [  (  )  ]  } ');
// // dogchecker(KateDog);
