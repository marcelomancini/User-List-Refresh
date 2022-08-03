const contactBox = document.querySelector('#contactBox');
const loadUsersBox = document.querySelector('#loadUsersBox');
const loadUsersBtn = document.querySelector('#loadUsersBtn');

const usersNumber = document.querySelector('#usersNumber');

const userList = document.querySelector('#userList');
const cardSkeleton = document.querySelector('#cardSkeleton');

const cardTemplate = document.querySelector('#cardTemplate');

loadUsersBtn.addEventListener('click', getUsersData);
userList.addEventListener('click', filterEventByButtonClicked);

function filterEventByButtonClicked(event) {
  if (event.target.className.includes('cardBtn')) {
    const parentNode = event.target.parentNode;
    const user = JSON.parse(parentNode.getAttribute('data-user'));
    showModalWithUserData(user);
  }
}

function showModalWithUserData(user) {
  const { id, email, avatar, first_name, last_name } = user;

  Swal.fire({
    titleText: `#${id} - ${first_name} ${last_name}`,
    text: `${email}`,
    imageUrl: `${avatar}`,
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: `Avatar of: ${first_name}`,
    confirmButtonColor: '#9EDEFD',
  });
}

function getUsersData() {
  toggleContactBox();
  printSkeleton(6);
  asyncFetching()
    .then((data) => {
      console.log(data);
      printNumberOfUsers(data);
      userList.innerHTML = '';
      printUsersData(data);
    })
    .catch((err) => {
      console.error(err);
      showToastWithError(err);
    });
}

function printUsersData(data) {
  data.forEach((user) => {
    const { avatar, first_name, last_name } = user;
    const cardContent = cardTemplate.content.cloneNode(true);

    cardContent
      .querySelector('div')
      .setAttribute('data-user', JSON.stringify(user));

    const avatarImg = cardContent.querySelector('#avatarImg');
    avatarImg.src = avatar;

    const firstName = cardContent.querySelector('#firstName');
    firstName.textContent = first_name;
    const lastName = cardContent.querySelector('#lastName');
    lastName.textContent = last_name;

    userList.appendChild(cardContent);
  });
}

function showToastWithError(error) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });

  Toast.fire({
    icon: 'error',
    title: `${error}`,
  });
}

function printSkeleton(numberOfSkeleton) {
  const skeletonsArr = [...Array(numberOfSkeleton).keys()];
  skeletonsArr.forEach(() => {
    const skeletonContent = cardSkeleton.content.cloneNode(true);
    userList.appendChild(skeletonContent);
  });
}

function printNumberOfUsers(data) {
  usersNumber.innerHTML = `${data.length}`;
}

function toggleContactBox() {
  contactBox.classList.toggle('hidden');
  loadUsersBox.classList.toggle('hidden');
}

const asyncFetching = async () => {
  const response = await fetch('https://reqres.in/api/users?delay=2');

  if (response.status !== 200) {
    throw new Error('Unable to fetch data 😿');
  }

  const { data, ...rest } = await response.json();
  return data;
};
