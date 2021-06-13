"use strict";

/////////////////////////////////////////
//Accounts
const account1 = {
   owner: "Tihomir Tomovic",
   movements: [200, 11, 450, -400, 3000, -650, -130, 70, 1300],
   interestRate: 1.2,
   pin: 1111,
};

const account2 = {
   owner: "Sarah Smith",
   movements: [430, 1000, 22, 700, 50, 90, 1222, 2222, 544],
   interestRate: 1,
   pin: 2222,
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const body = document.querySelector("body");
const menuBtn = document.querySelector(".menu__btn");
const menuLinks = document.querySelector(".menu-links");
const links = document.querySelectorAll(".menu-links li");
const newMessage = document.querySelector(".new__message");
const sectionCloseAcc = document.querySelector(".section__close-acc");
const sectionLoan = document.querySelector(".section__loan");
const operationLoan = document.querySelector(".operation--loan");
const sectionTransfer = document.querySelector(".section__transfer");
const operationTransfer = document.querySelector(".operation--transfer");
const sectionMovements = document.querySelector(".section__movements");
const movements = document.querySelector(".movements");
const sectionMessage = document.querySelector(".message-centar");
const section = document.querySelector(".backToTop");
const backToTop = document.querySelector(".top");
const loginBtn = document.querySelector(".login__btn");
const login = document.querySelector(".login");
const labelWelcome = document.querySelector(".welcome");
let labelDate = document.querySelector(".date");
const labelTimer = document.querySelector(".timer");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");

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
const loader = document.querySelector(".loader");
const spin = document.querySelector(".spin");

/////////////////////////////////////////////////
//Loader spinner
setTimeout(function () {
   loader.classList.add("loader_hidden");
   spin.classList.add("spin_hidden");
}, 2000);
//Display movements
const displayMovements = function (movements, sort = false) {
   containerMovements.innerHTML = "";

   const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

   movs.forEach(function (mov, i) {
      const type = mov > 0 ? "deposit" : "withdrawal";

      const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
         i + 1
      } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

      containerMovements.insertAdjacentHTML("afterbegin", html);
   });
};

//Display balance
const calcDisplayBalance = function (acc) {
   acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
   labelBalance.textContent = `${acc.balance}€`;
};

//Display summary
const calcDisplaySummary = function (acc) {
   const incomes = acc.movements
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
   labelSumIn.textContent = `${incomes}€`;

   const out = acc.movements
      .filter((mov) => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
   labelSumOut.textContent = `${Math.abs(out)}€`;

   const interest = acc.movements
      .filter((mov) => mov > 0)
      .map((deposit) => (deposit * acc.interestRate) / 100)
      .filter((int, i, arr) => {
         return int >= 1;
      })
      .reduce((acc, int) => acc + int, 0);
   labelSumInterest.textContent = `${interest}€`;
};

//Create usernames
const createUsernames = function (accs) {
   accs.forEach(function (acc) {
      acc.username = acc.owner
         .toLowerCase()
         .split(" ")
         .map((name) => name[0])
         .join("");
   });
};
createUsernames(accounts);

const updateUI = function (acc) {
   // Display movements
   displayMovements(acc.movements);

   // Display balance
   calcDisplayBalance(acc);

   // Display summary
   calcDisplaySummary(acc);
};

//logOut timer
const startLogOutTimer = function () {
   const tick = function () {
      //In each call, print the time
      labelTimer.textContent = time;

      //when 0 seconds log out user
      if (time === 0) {
         clearInterval(timer);
         location.reload();
      }
      //decrese 1s
      time--;
   };

   //set time
   let time = 555;

   //Call the timer every second
   tick();
   const timer = setInterval(tick, 1000);
   return timer;
};

// Date
const now = new Date();
const date = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
labelDate.textContent = `${date}/${month}/${year}`;

///////////////////////////////////////
let currentAccount, timer;

//Login user
btnLogin.addEventListener("click", function (e) {
   // Prevent form from submitting
   e.preventDefault();

   currentAccount = accounts.find(
      (acc) => acc.username === inputLoginUsername.value
   );

   if (currentAccount?.pin === Number(inputLoginPin.value)) {
      // Display UI and message
      labelWelcome.textContent = `Welcome back, ${
         currentAccount.owner.split(" ")[0]
      }`;
      // containerApp.style.opacity = 1;
      login.classList.remove("login__input-hidden");
      loginBtn.classList.remove("login__btn-hidden");
      containerApp.classList.remove("app-hidden");
      containerApp.style.opacity = 1;
      menuBtn.classList.remove("menu__btn-hidden");

      // Clear input fields
      inputLoginUsername.value = inputLoginPin.value = "";
      inputLoginPin.blur();

      //timer
      if (timer) clearInterval(timer);
      timer = startLogOutTimer();

      // Update UI
      updateUI(currentAccount);
   }
});

//Transfer money
btnTransfer.addEventListener("click", function (e) {
   e.preventDefault();
   const amount = Number(inputTransferAmount.value);
   const receiverAcc = accounts.find(
      (acc) => acc.username === inputTransferTo.value
   );
   inputTransferAmount.value = inputTransferTo.value = "";

   if (
      amount > 0 &&
      receiverAcc &&
      currentAccount.balance >= amount &&
      receiverAcc?.username !== currentAccount.username
   ) {
      setTimeout(function () {
         // Doing the transfer
         currentAccount.movements.push(-amount);
         receiverAcc.movements.push(amount);

         // Update UI
         updateUI(currentAccount);
         sectionMessage.scrollIntoView({ behavior: "smooth" });
         newMessage.style.opacity = 1;
         newMessage.textContent = "transfer completed";
      }, 3500);
   }
});

//Request loan
btnLoan.addEventListener("click", function (e) {
   e.preventDefault();

   const amount = Number(inputLoanAmount.value);

   if (
      amount > 0 &&
      currentAccount.movements.some((mov) => mov >= amount * 0.1)
   ) {
      setTimeout(function () {
         // Add movement
         currentAccount.movements.push(amount);

         // Update UI
         updateUI(currentAccount);
         sectionMessage.scrollIntoView({ behavior: "smooth" });
         newMessage.style.opacity = 1;
         newMessage.textContent = " loan approved";
      }, 3500);
   }
   inputLoanAmount.value = "";
});

//Close acc
btnClose.addEventListener("click", function (e) {
   e.preventDefault();

   if (
      inputCloseUsername.value === currentAccount.username &&
      Number(inputClosePin.value) === currentAccount.pin
   ) {
      const index = accounts.findIndex(
         (acc) => acc.username === currentAccount.username
      );
      console.log(index);
      // .indexOf(23)

      // Delete account
      accounts.splice(index, 1);

      // Update UI
      containerApp.style.opacity = 0;
      login.classList.add("login__input-hidden");
      loginBtn.classList.add("login__btn-hidden");
      menuBtn.classList.add("menu__btn-hidden");
      setTimeout(function () {
         containerApp.classList.add("app-hidden");
         backToTop.scrollIntoView({ behavior: "smooth" });
      }, 2200);
   }

   inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
   e.preventDefault();
   displayMovements(currentAccount.movements, !sorted);
   sorted = !sorted;
});
////////////////////////////
//Scrolls

//Back to top
section.addEventListener("click", function () {
   backToTop.scrollIntoView({ behavior: "smooth" });
});
//Section movements
sectionMovements.addEventListener("click", () => {
   movements.scrollIntoView({ behavior: "smooth" });
   menuLinks.classList.toggle("menu-links-open");
   body.classList.toggle("scrollY");
});

//Section transfer
sectionTransfer.addEventListener("click", () => {
   operationTransfer.scrollIntoView({ behavior: "smooth" });
   menuLinks.classList.toggle("menu-links-open");
   body.classList.toggle("scrollY");
});

//Section loan
sectionLoan.addEventListener("click", () => {
   operationLoan.scrollIntoView({ behavior: "smooth" });
   menuLinks.classList.toggle("menu-links-open");
   body.classList.toggle("scrollY");
});

// Section Close-acc
sectionCloseAcc.addEventListener("click", () => {
   operationLoan.scrollIntoView({ behavior: "smooth" });
   menuLinks.classList.toggle("menu-links-open");
   body.classList.toggle("scrollY");
});

//Menu-btn
menuBtn.addEventListener("click", () => {
   menuLinks.classList.toggle("menu-links-open");
   body.classList.toggle("scrollY");
});
////////////////////////////////////////////
console.log(
   "(username-tt password-1111),(username-ss password-2222), Transfer operation can be done only to a existing acc "
);
