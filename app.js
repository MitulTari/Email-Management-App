const adduserBtn = document.getElementById('add-btn');
const userData = document.querySelectorAll('input');
const userList = document.getElementById('user-list');
const toUserlist = document.getElementById('toUser-list');
const submitBtn = document.getElementById('submit-btn');
const checkInboxList = document.getElementById('check-inbox');
const checkBoxTable = document.getElementById('tablebody1');
const favoriteTable = document.getElementById('tablebody2');

let Users = [];
let Emails = [];
let FavoriteMails = [];

userList.innerHTML = `<option >-----</option>`;
toUserlist.innerHTML = `<option>-----</option>`;
checkInboxList.innerHTML = `<option>-----</option>`;

//for retrieving user from local storage
let storedJsonString = localStorage.getItem('users');
if (storedJsonString) {
  Users = JSON.parse(storedJsonString);
}

//for retrieving mails from local storge
let storedJsonMails = localStorage.getItem('mails');
if (storedJsonMails) {
  Emails = JSON.parse(storedJsonMails);
}

//for retrive fav email form session storage
let storedJsonFavMail = sessionStorage.getItem('favMails');
if (storedJsonFavMail) {
  FavoriteMails = JSON.parse(storedJsonFavMail);
}

//for always disply fav mails
const tableHeaderRow = document.createElement('tr');
const tableHeaders = ['From', 'Subject', 'Message'];

tableHeaders.forEach((headerText) => {
  const th = document.createElement('th');
  th.textContent = headerText;
  tableHeaderRow.appendChild(th);
});

favoriteTable.appendChild(tableHeaderRow);

FavoriteMails.forEach((el) => {

  const tableRow = document.createElement('tr');



  tableRow.innerHTML += `<td>${el.from}</td>  <td>${el.subject}</td>  <td>${el.message}</td>`;


  favoriteTable.appendChild(tableRow);
})

//for add user in local storage
const addUserInLocal = () => {
  const user = userData[0].value.trim();

  if (Users.includes(user) || user === '') {
    alert('This user is already Exist or input is empty!');
    userData[0].value = '';
    console.log(user);
  } else {
    Users.push(user);
    const jsonString = JSON.stringify(Users);
    localStorage.setItem('users', jsonString);
    userList.innerHTML += `<option>${Users[Users.length - 1]}</option>`;
    checkInboxList.innerHTML += `<option> ${Users[Users.length - 1]} </option>`;
    userData[0].value = '';
  }

};

// for render option of from
Users.forEach((element) => {
  userList.innerHTML += `<option> ${element} </option>`;
  checkInboxList.innerHTML += `<option> ${element} </option>`;
});



//for select from user and render to user option
const selectUserHandler = () => {
  const selectedUser = userList.value;
  if (selectedUser !== '-----') {
    toUserlist.innerHTML = `<option >-----</option>`;
    for (i = 0; i < Users.length; i++) {
      if (Users[i] !== selectedUser) {
        toUserlist.innerHTML += `<option> ${Users[i]} </option>`;
      }
    }
    //console.log(selectedUser);
    return selectedUser;
  }

};

//for select to user
const selectToUserHandler = () => {
  const selectedToUser = toUserlist.value;
  if (selectedToUser !== '-----') {//console.log(selectedToUser);
    return selectedToUser;
  }


};

//for submitting mails and stored in local storage
const submitMailHandler = () => {
  let toUser = selectToUserHandler();
  let fromUser = selectUserHandler();
  console.log(toUser + ' ' + fromUser);



  if (toUser === undefined || fromUser === undefined) {
    alert('Plase select proper user ')
  }

  else {
    let messageValue = userData[2].value;
    let subjectValue = userData[1].value;
    const mailObj = {
      from: fromUser,
      to: toUser,
      subject: subjectValue,
      message: messageValue,
    };

    Emails.push(mailObj);
    const jsonString = JSON.stringify(Emails);
    localStorage.setItem('mails', jsonString);

  }


  userData[2].value = '';
  userData[1].value = '';
  userList.value = '-----';
  toUserlist.value = '-----';
};

keys = Object.keys[Emails[0]];



const renderTable = (event) => {
  while (checkBoxTable.firstChild) {
    checkBoxTable.removeChild(checkBoxTable.firstChild);
  }

  //for disply table header
  const tableHeaderRow = document.createElement('tr');
  const tableHeaders = [
    'From',
    'Subject',
    'Message',
    'Read/Unread',
    'Favorite',
  ];

  tableHeaders.forEach((headerText) => {
    const th = document.createElement('th');
    th.textContent = headerText;
    tableHeaderRow.appendChild(th);
  });

  checkBoxTable.appendChild(tableHeaderRow);

  // for disply only that mails that are not in fav mails
  Emails.forEach((email, index) => {

    // for check that mails are in Favmails or not
    function isEmailInFavorites(email) {
      for (let i = 0; i < FavoriteMails.length; i++) {
        if (email.from === FavoriteMails[i].from && email.to === FavoriteMails[i].to && email.subject === FavoriteMails[i].subject && email.message === FavoriteMails[i].message) {
          return true;
        }
      }
      return false;
    }

    if (email.to === checkInboxList.value && isEmailInFavorites(email) === false) {

      // console.log(isEmailInFavorites(email))


      const tableRow = document.createElement('tr');

      const keys = ['from', 'subject', 'message'];

      keys.forEach((key) => {
        const td = document.createElement('td');
        const textContent = email[key];
        td.innerHTML = `<b>${textContent}</b>`;
        tableRow.appendChild(td);
      });

      checkBoxTable.appendChild(tableRow);

      //for create read button in checkBoxTable

      const readUnreadBtn = document.createElement('td');
      const readBtn = document.createElement('button');
      readBtn.textContent = 'Read';
      readUnreadBtn.appendChild(readBtn);
      tableRow.appendChild(readUnreadBtn);

      // for create favorite button in checkboxTable
      const favoriteBtn = document.createElement('td');
      const favoriteButton = document.createElement('button');
      favoriteButton.textContent = 'Favorite';
      favoriteBtn.appendChild(favoriteButton);
      tableRow.appendChild(favoriteBtn);

      // for toggle read/unread button in checkboxTable

      readBtn.addEventListener('click', (event) => {
        email.read = !email.read;
        readBtn.textContent = email.read ? 'Unread' : 'Read';

        const columns1 = tableRow.querySelectorAll(
          'td:nth-child(1), td:nth-child(2), td:nth-child(3)'
        );

        if (readBtn.textContent === 'Unread') {
          columns1.forEach((colm) => {
            colm.innerHTML = colm.textContent;
          });
        } else {
          columns1.forEach((colm) => {
            colm.innerHTML = `<b> ${colm.textContent} </b>`;
          });
        }
        event.preventDefault();
      });

      //for handle favourite button
      favoriteBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const rowIndex = Array.from(tableRow.parentNode.children).indexOf(
          tableRow
        );
        checkBoxTable.removeChild(tableRow);

        // for add  the email to the Favorite Email table
        FavoriteMails.push(email);
        let favMailJson = JSON.stringify(FavoriteMails);
        sessionStorage.setItem('favMails', favMailJson);

        while (favoriteTable.firstChild) {
          favoriteTable.removeChild(favoriteTable.firstChild);
        }

        // for favemail table header row
        const tableHeaderRow = document.createElement('tr');
        const tableHeaders = ['From', 'Subject', 'Message'];

        tableHeaders.forEach((headerText) => {
          const th = document.createElement('th');
          th.textContent = headerText;
          tableHeaderRow.appendChild(th);
        });

        favoriteTable.appendChild(tableHeaderRow);

        //for favemail table data row
        FavoriteMails.forEach((el) => {

          const tableRow = document.createElement('tr');



          tableRow.innerHTML += `<td>${el.from}</td>  <td>${el.subject}</td>  <td>${el.message}</td>`;


          favoriteTable.appendChild(tableRow);
        });
      });
    }
  });
};


checkInboxList.addEventListener('change', renderTable);
submitBtn.addEventListener('click', submitMailHandler);
adduserBtn.addEventListener('click', addUserInLocal);
