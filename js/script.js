let addToCartButtons = document.querySelectorAll('.card-options__button');
let products = [
  {
    name: 'Ролл угорь стандарт',
    price: 250,
    id: 1,
    inCart: 0,
  },
  {
    name: 'Калифорния лосось',
    price: 150,
    id: 2,
    inCart: 0,
  },
  {
    name: 'Окинава стандарт',
    price: 350,
    id: 3,
    inCart: 0,
  },
  {
    name: 'Цезарь маки хl',
    price: 650,
    id: 4,
    inCart: 0,
  },
  {
    name: 'Ясай маки стандарт',
    price: 125,
    id: 5,
    inCart: 0,
  },
  {
    name: 'Ролл с креветкой стандарт',
    price: 225,
    id: 6,
    inCart: 0,
  },
];
for (let i = 0; i < addToCartButtons.length; i++) {
  addToCartButtons[i].addEventListener('click', () => {
    cartNumbers(products[i]);
    totalCost(products[i]);
    displayCart();
  });
}

function onLoadCartNumbers() {
  let productValue = localStorage.getItem('cartNumbers');
  if (productValue) {
    document.querySelector('.header__basket-count').textContent = productValue;
  }
}

function cartNumbers(product) {
  let productValue = localStorage.getItem('cartNumbers');
  productValue = parseInt(productValue);
  if (productValue) {
    localStorage.setItem('cartNumbers', productValue + 1);
    document.querySelector('.header__basket-count').textContent =
      productValue + 1;
  } else {
    localStorage.setItem('cartNumbers', 1);
    document.querySelector('.header__basket-count').textContent = 1;
  }

  setItems(product);
}

function setItems(product) {
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);

  if (cartItems != null) {
    if (cartItems[product.id] == undefined) {
      cartItems = {
        ...cartItems,
        [product.id]: product,
      };
    }
    cartItems[product.id].inCart += 1;
  } else {
    products.inCart = 1;
    cartItems = {
      [product.id]: product,
    };
  }

  localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}

function totalCost(product) {
  let cartPrice = localStorage.getItem('totalCost');

  if (cartPrice != null) {
    cartPrice = parseInt(cartPrice);
    localStorage.setItem('totalCost', cartPrice + product.price);
  } else {
    localStorage.setItem('totalCost', product.price);
  }
}

function displayCart() {
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);
  let modalContainer = document.querySelector('.modal-order');
  if (cartItems && modalContainer) {
    modalContainer.innerHTML = '';
    Object.values(cartItems).map(item => {
      modalContainer.innerHTML += `
      <div class="modal-row modal-row-mb-15">
        <img src="img/modal/close-button.svg" alt="Close button" class="close__button-icon"/>
        <span class="modal-row__name">${item.name}</span>
            <strong class="modal-row__price">${item.price}</strong>
            <div class="modal-row__buttons">
              <button class="modal-row__button modal-row__button--minus">
                -
              </button>
              <input
                type="number"
                class="modal-row__count"
                value="${item.inCart}"
                disabled
              />
              <button class="modal-row__button modal-row__button--plus">
                +
              </button>
            </div>
          </div>
      `;
    });
  }
}
onLoadCartNumbers();

// const shopCart = document.querySelector('.header__button--basket'),
//   modalDialog = document.querySelector('.modal__dialog'),
//   modalClose = document.querySelector('.modal__close'),
//   modalOverlay = document.querySelector('.modal__overlay'),
//   modalOrder = document.querySelector('.modal-order');

// shopCart.addEventListener('click', toggleModal);
// modalClose.addEventListener('click', toggleModal);
// modalOverlay.addEventListener('click', toggleModal);
// document.addEventListener('keydown', closeModal);

// function toggleModal() {
//   modalDialog.classList.toggle('modal__dialog--visible');
//   modalOverlay.classList.toggle('modal__overlay--visible');
// }

// function closeModal(event) {
//   if (event.keyCode === 27) {
//     modalDialog.classList.remove('modal__dialog--visible');
//     modalOverlay.classList.remove('modal__overlay--visible');
//   }
// }

// document.querySelector('.cards').addEventListener('click', event => {
//   const modalRows = document.querySelectorAll('.modal-row');
//   let productId = event.target.closest('.card').dataset.id;
//   addToCart(productId);
//   if (modalOrder != undefined) {
//     console.log(modalOrder);
//   }
// });

// function addToCart(productId) {
//   let outProductRow = '<div class="modal-order">';
//   for (let key in card) {
//     if (key === productId) {
//       outProductRow += `<div class="modal-row modal-row-mb-15">`;
//       outProductRow += `<span class="modal-row__name">${card[key].name}</span>`;
//       outProductRow += `<strong class="modal-row__price">${card[key].price}</strong>`;
//       outProductRow += `<div class="modal-row__buttons">
//   <button class="modal-row__button modal-row__button--minus">
//     -
//   </button>
//   <input
//     type="number"
//     class="modal-row__count"
//     value="0"
//     disabled
//     data-price="${card[key].price} "

//   />
//   <button class="modal-row__button modal-row__button--plus">
//     +
//   </button>
// </div>
// </div>`;
//       // } else {
//       //   outProductRow = '';
//       // }

//       // console.log(modalRows);
//       // console.log(outProductRow);
//       modalOrder.innerHTML += outProductRow;
//       outProductRow += '</div>';
//     }
//   }
// }

// const getFullPrice = input => Number(input.value) * Number(input.dataset.price);
// const totalPrice = document.querySelector('.modal-total__price');
// const setTotalPrice = value => {
//   totalPrice.textContent = value + ' ₽';
//   totalPrice.dataset.value = value;
// };
// const ACTION = {
//   PLUS: 'plus',
//   MINUS: 'minus',
// };

// const basket = () => {
//   let totalCost = 0;
//   [...document.querySelectorAll('.modal-row')].forEach(basketRow => {
//     totalCost += getFullPrice(basketRow.querySelector('.modal-row__count'));
//   });

//   setTotalPrice(totalCost);
// };

// const calculateSeparateItem = (basketRow, action) => {
//   const input = basketRow.querySelector('.modal-row__count');

//   switch (action) {
//     case ACTION.PLUS:
//       input.value++;
//       setTotalPrice(
//         Number(totalPrice.dataset.value) + Number(input.dataset.price)
//       );

//       break;
//     case ACTION.MINUS:
//       input.value--;
//       setTotalPrice(
//         Number(totalPrice.dataset.value) - Number(input.dataset.price)
//       );
//       break;
//   }

//   basketRow.querySelector('.modal-row__price').textContent = `${getFullPrice(
//     input
//   )} ₽`;
// };

// document.querySelector('.modal-order').addEventListener('click', event => {
//   if (event.target.classList.contains('modal-row__button--plus')) {
//     calculateSeparateItem(event.target.closest('.modal-row'), ACTION.PLUS);
//   }
//   if (event.target.classList.contains('modal-row__button--minus')) {
//     const input = event.target
//       .closest('.modal-row')
//       .querySelector('.modal-row__count');
//     if (Number(input.value != 0)) {
//       calculateSeparateItem(event.target.closest('.modal-row'), ACTION.MINUS);
//     }
//   }
// });
// basket();
