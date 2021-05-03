"use strict";
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z"
  ],
  currency: "EUR",
  locale: "pt-PT" // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z"
  ],
  currency: "USD",
  locale: "en-US"
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z"
  ],
  currency: "USD",
  locale: "en-US"
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z"
  ],
  currency: "USD",
  locale: "en-US"
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

let loggedUser;
//////////////////// DISPLAY MOVEMENTS //////////////////
const displayMovement = ({ movements, movementsDates }, sort = false) => {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, idx) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(movementsDates[idx]);

    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      idx + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//////////////////// COMPUTING USERNAMES //////////////////
const createUsernames = (accounts) => {
  accounts.forEach((account) => {
    account.username = account.owner
      .split(" ")
      .map((x) => x[0])
      .join("")
      .toLowerCase();
  });
};

createUsernames(accounts);

//////////////////// IMPLEMENTING LOGIN //////////////////
//section completed without help of the instructor or solution
//only .blur() taken from video

const findAccount = (username) =>
  accounts.find((acc) => acc.username === username);

const displayMessage = ({ owner }) => {
  labelWelcome.textContent = `Welcome back ${owner.split(" ")[0]}`;
};

const displayBalance = (account) => {
  account.balance = account.movements.reduce((a, b) => a + b, 0);
  labelBalance.textContent = account.balance.toFixed(2) + "€";

  labelSumOut.textContent =
    Math.abs(
      account.movements.filter((x) => x < 0).reduce((a, b) => a + b, 0)
    ).toFixed(2) + "€";

  labelSumIn.textContent =
    account.movements
      .filter((x) => x > 0)
      .reduce((a, b) => a + b, 0)
      .toFixed(2) + "€";

  labelSumInterest.textContent = account.movements
    .filter((x) => x > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((a, b) => a + b, 0)
    .toFixed(2);
};

const handleDateDisplay = () => {
  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = now.getFullYear();
  const hour = `${now.getHours()}`.padStart(2, 0);
  const minutes = `${now.getMinutes()}`.padStart(2, 0);
  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;
};

const updateUI = (user) => {
  displayMovement(user);
  displayBalance(user);
  handleDateDisplay();
};

const handleLogin = () => {
  const user = findAccount(inputLoginUsername.value);
  loggedUser = user;

  if (user?.pin === +inputLoginPin.value) {
    containerApp.style.opacity = 1;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur(); //loose focus on input fields
    displayMessage(user);
    updateUI(user);
  }
};

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  handleLogin();
});

//////////////////// IMPLEMENTING TRANSFERS //////////////////
//section completed without help of the instructor or solution
//only restricting amount taken from video (I didn't restrict it to be above 0 and under user's balance))

const handleTransfer = (user) => {
  let receiver = accounts.find((x) => x.username === inputTransferTo.value);
  if (!receiver) return;
  let amount = +inputTransferAmount.value;

  if (
    receiver &&
    amount > 0 &&
    amount < user.balance &&
    receiver?.username !== user.username
  ) {
    user.movements.push(-amount);
    receiver.movements.push(amount);
    loggedUser.movementsDates.push(new Date().toISOString());
    receiver.movementsDates.push(new Date().toISOString());
    updateUI(loggedUser);
  }
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();
  inputTransferTo.blur();
};

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  handleTransfer(loggedUser);
});

//////////////////// DELETE ACCOUNT //////////////////
//section completed without help of the instructor or solution
//100% solo work

const handleLogout = () => {
  loggedUser = "";
  containerApp.style.opacity = 0;
};

const handleDelete = () => {
  if (
    inputCloseUsername.value === loggedUser.username &&
    +inputClosePin.value === loggedUser.pin
  ) {
    let indexToDelete = accounts.indexOf(loggedUser);
    accounts.splice(indexToDelete, 1);
    handleLogout();
  }
  inputCloseUsername.value = inputClosePin.value = "";
  inputCloseUsername.focus();
};

btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  handleDelete();
});

//////////////////// DELETE ACCOUNT //////////////////
//section completed without help of the instructor or solution
//100% solo

const handleLoan = () => {
  const loanAmount = inputLoanAmount.value;
  if (loggedUser.movements.some((x) => x >= loanAmount * 0.1)) {
    loggedUser.movements.push(+Math.floor(loanAmount));
    loggedUser.movementsDates.push(new Date().toISOString());
    updateUI(loggedUser);
  }
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
};

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  handleLoan();
});

//////////////////// SORT MOVEMENTS //////////////////
let isSorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  // isSorted
  //   ? displayMovement(loggedUser, false)
  //   : displayMovement(loggedUser, true);
  displayMovement(loggedUser, !isSorted);
  isSorted = !isSorted;
});

//////////////////// BONUS ARRAY EXERCISES //////////////////
//COMPLETED 100% SOLO

//1. Sum all deposits from all of the account
const bankDepositSum = accounts
  .flatMap((x) => x.movements)
  .filter((x) => x > 0)
  .reduce((a, b) => a + b, 0);
// console.log(bankDepositSum);

//2. How many deposits there have been with at least 1000$
const depositsOver1000 = accounts
  .flatMap((x) => x.movements)
  .filter((x) => x > 1000).length;
//console.log(depositsOver1000);

//2.1. The same using reduce
const depositOver1000reduce = accounts
  .flatMap((x) => x.movements)
  .reduce((count, current) => (current >= 1000 ? count + 1 : count), 0);
//console.log(depositOver1000reduce);

//3. Create a new object which contains the sum of the deposits and of the withdrawals
const { deposits, withdrawals } = accounts
  .flatMap((x) => x.movements)
  .reduce(
    (sums, curr) => {
      sums[curr > 0 ? "deposits" : "withdrawals"] += curr;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

//console.log(deposits, withdrawals);

//4. Create a simple function to convert any string to a title case - all the words in the sentence are capitalzied except for some exceptions (eg. "a")
const exceptions = ["a", "an", "the", "but", "or", "on", "in", "with"];
const convertTitleCase = (title) => {
  return title
    .toLowerCase()
    .split(" ")
    .map((x) => (!exceptions.includes(x) ? x[0].toUpperCase() + x.slice(1) : x))
    .join(" ");
};

//console.log(convertTitleCase("this is a nice title"));
//console.log(convertTitleCase("this is a LONG title but not too long"));

/*const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z"
  ],
  currency: "EUR",
  locale: "pt-PT" // de-DE
};*/

loggedUser = account1;
updateUI(loggedUser);
containerApp.style.opacity = 100;
