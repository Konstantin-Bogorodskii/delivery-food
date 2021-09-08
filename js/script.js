const shopCart = document.querySelector('.header__button--basket'),
  modalDialog = document.querySelector('.modal__dialog'),
  modalClose = document.querySelector('.modal__close'),
  modalOverlay = document.querySelector('.modal__overlay'),
  modalOrder = document.querySelector('.modal-order');

shopCart.addEventListener('click', toggleModal);
modalClose.addEventListener('click', toggleModal);
modalOverlay.addEventListener('click', toggleModal);
document.addEventListener('keydown', closeModal);

function toggleModal() {
  modalDialog.classList.toggle('modal__dialog--visible');
  modalOverlay.classList.toggle('modal__overlay--visible');
  document.body.classList.toggle('page-scroll');
}

function closeModal(event) {
  if (event.keyCode === 27) {
    modalDialog.classList.remove('modal__dialog--visible');
    modalOverlay.classList.remove('modal__overlay--visible');
  }
}

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
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);
  if (productValue) {
    document.querySelector('.header__basket-count').textContent = productValue;
    displayCart();
  }
}

function cartNumbers(product) {
  let productValue = localStorage.getItem('cartNumbers');
  productValue = parseInt(productValue);
  if (productValue) {
    localStorage.setItem('cartNumbers', productValue + 1);
    document.querySelector('.header__basket-count').textContent = productValue + 1;
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
    product.inCart = 1;
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
  let modalContainer = document.querySelector('.modal-order');
  let cartItems = localStorage.getItem('productsInCart');
  let modalTotalPrice = document.querySelector('.modal-total__price');
  let cartTotalPrice = localStorage.getItem('totalCost');
  cartItems = JSON.parse(cartItems);
  if (cartItems && modalContainer) {
    modalContainer.innerHTML = '';
    Object.values(cartItems).map(item => {
      if (item.inCart === 0) return;
      modalContainer.innerHTML += `
        <div class="modal-row modal-row-mb-15">
          <a href="#" class="modal-row__close"></a>
          <span class="modal-row__name">${item.name}</span>
              <strong class="modal-row__price">${item.price * item.inCart} ₽</strong>
              <div class="modal-row__buttons">
                <button class="modal-row__button modal-row__button--minus">
                  -
                </button>
                <input
                  type="number"
                  class="modal-row__count"
                  value="${item.inCart}"
                  data-id="${item.id}"
                  disabled
                />
                <button class="modal-row__button modal-row__button--plus">
                  +
                </button>
              </div>
            </div>
        `;
      modalTotalPrice.textContent = `${cartTotalPrice} ₽`;
    });
  }
}

const calculateSeparateItem = (input, action) => {
  let inputValue = input.querySelector('.modal-row__count');
  let productValue = localStorage.getItem('cartNumbers');
  let inputId = inputValue.dataset.id;
  let cartItems = localStorage.getItem('productsInCart');
  let inputPrice = input.querySelector('.modal-row__price');
  let cartPrice = localStorage.getItem('totalCost');
  let modalTotalPrice = document.querySelector('.modal-total__price');
  cartPrice = parseInt(cartPrice);
  cartItems = JSON.parse(cartItems);
  for (let key in cartItems) {
    if (inputId == cartItems[key].id && action == 'plus') {
      inputValue.value++;
      cartItems[key].inCart += 1;
      inputPrice.textContent = `${inputValue.value * cartItems[key].price} ₽`;
      localStorage.setItem('totalCost', cartPrice + cartItems[key].price);
      modalTotalPrice.textContent = `${cartPrice + cartItems[key].price} ₽`;
      productValue++;
    }
    if (inputId == cartItems[key].id && inputValue.value != 1 && action == 'minus') {
      inputValue.value--;
      cartItems[key].inCart -= 1;

      inputPrice.textContent = `${inputValue.value * cartItems[key].price} ₽`;
      localStorage.setItem('totalCost', cartPrice - cartItems[key].price);
      modalTotalPrice.textContent = `${cartPrice - cartItems[key].price} ₽`;
      productValue--;
    }
  }
  localStorage.setItem('cartNumbers', productValue);
  document.querySelector('.header__basket-count').textContent = productValue;
  localStorage.setItem('productsInCart', JSON.stringify(cartItems));
};

modalOrder.addEventListener('click', event => {
  let input = event.target.closest('.modal-row');
  if (event.target.classList.contains('modal-row__button--plus')) {
    calculateSeparateItem(input, 'plus');
  }
  if (event.target.classList.contains('modal-row__button--minus')) {
    calculateSeparateItem(input, 'minus');
  }
  if (event.target.classList.contains('modal-row__close')) {
    removeProduct(input);
  }
});
function removeProduct(input) {
  let productValue = localStorage.getItem('cartNumbers');
  let modalTotalPrice = document.querySelector('.modal-total__price');
  let inputId = input.querySelector('.modal-row__count').dataset.id;
  let inputCount = input.querySelector('.modal-row__count');
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);
  let cartPrice = localStorage.getItem('totalCost');
  cartPrice = parseInt(cartPrice);
  for (let key in cartItems) {
    if (inputId == cartItems[key].id) {
      input.remove();
      cartPrice -= cartItems[key].price * +inputCount.value;
      productValue -= +inputCount.value;
      cartItems[key].inCart = 0;
    }
  }
  localStorage.setItem('productsInCart', JSON.stringify(cartItems));
  localStorage.setItem('cartNumbers', productValue);
  document.querySelector('.header__basket-count').textContent = productValue;
  modalTotalPrice.textContent = `${cartPrice} ₽`;
  localStorage.setItem('totalCost', cartPrice);
}

let modalCancel = document.querySelector('.modal-total__button-cancel');
modalCancel.addEventListener('click', () => {
  let answer = confirm('Вы уверены, что хотите полностью очистить корзину?');
  console.log(answer);
  if (answer) {
    localStorage.clear();
    location.reload();
  }
});

onLoadCartNumbers();
