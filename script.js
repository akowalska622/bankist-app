"use strict";
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444
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
const displayMovement = ({ movements }) => {
  containerMovements.innerHTML = "";

  movements.forEach((mov, idx) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      idx + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
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
const findAccount = (username) =>
  accounts.find((acc) => acc.username === username);

const displayMessage = ({ owner }) => {
  labelWelcome.textContent = `Welcome back ${owner.split(" ")[0]}`;
};

const displayBalance = (account) => {
  account.balance = account.movements.reduce((a, b) => a + b, 0);
  labelBalance.textContent = account.balance + "€";

  labelSumOut.textContent =
    Math.abs(
      account.movements.filter((x) => x < 0).reduce((a, b) => a + b, 0)
    ) + "€";

  labelSumIn.textContent =
    account.movements.filter((x) => x > 0).reduce((a, b) => a + b, 0) + "€";

  labelSumInterest.textContent = account.movements
    .filter((x) => x > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((a, b) => a + b, 0);
};

const updateUI = (user) => {
  displayMovement(user);
  displayBalance(user);
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
//inputCloseUsername
//inputClosePin
//btnClose

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
