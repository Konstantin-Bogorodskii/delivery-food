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
}

function closeModal(event) {
  if (event.keyCode === 27) {
    modalDialog.classList.remove('modal__dialog--visible');
    modalOverlay.classList.remove('modal__overlay--visible');
  }
}

const getFullPrice = input => Number(input.value) * Number(input.dataset.price);
const totalPrice = document.querySelector('.modal-total__price');
const setTotalPrice = value => {
  totalPrice.textContent = value + ' ₽';
  totalPrice.dataset.value = value;
};
const ACTION = {
  PLUS: 'plus',
  MINUS: 'minus',
};

const basket = () => {
  let totalCost = 0;
  [...document.querySelectorAll('.modal-row')].forEach(basketRow => {
    totalCost += getFullPrice(basketRow.querySelector('.modal-row__count'));
  });

  setTotalPrice(totalCost);
};

const calculateSeparateItem = (basketRow, action) => {
  const input = basketRow.querySelector('.modal-row__count');

  switch (action) {
    case ACTION.PLUS:
      input.value++;
      setTotalPrice(
        Number(totalPrice.dataset.value) + Number(input.dataset.price)
      );

      break;
    case ACTION.MINUS:
      input.value--;
      setTotalPrice(
        Number(totalPrice.dataset.value) - Number(input.dataset.price)
      );
      break;
  }

  basketRow.querySelector('.modal-row__price').textContent = `${getFullPrice(
    input
  )} ₽`;
};

document.querySelector('.modal-order').addEventListener('click', event => {
  if (event.target.classList.contains('modal-row__button--plus')) {
    calculateSeparateItem(event.target.closest('.modal-row'), ACTION.PLUS);
  }
  if (event.target.classList.contains('modal-row__button--minus')) {
    const input = event.target
      .closest('.modal-row')
      .querySelector('.modal-row__count');
    if (Number(input.value != 0)) {
      calculateSeparateItem(event.target.closest('.modal-row'), ACTION.MINUS);
    }
  }
});

const card = {
  1: {
    name: 'Ролл угорь стандарт',
    price: '250 ₽',
  },
  2: {
    name: 'Калифорния лосось',
    price: '150 ₽',
  },
  3: {
    name: 'Калифорния ',
    price: '350 ₽',
  },
  4: {
    name: 'лосось',
    price: '450 ₽',
  },
};

document.querySelector('.cards').addEventListener('click', event => {
  const product = event.target.closest('.card');
  const productId = event.target.closest('.card').dataset.id;
  addToCart(product, productId);
});

function addToCart(product, productId) {
  let outProductRaw = '<div class="modal-order modal-order--mb-45">';
  for (let key in card) {
    if (key === productId) {
      outProductRaw += `<div class="modal-row modal-row-mb-15">`;
      outProductRaw += `<span class="modal-row__name">${card[key].name}</span>`;
      outProductRaw += `<strong class="modal-row__price">${card[key].price}</strong>`;
      outProductRaw += `<div class="modal-row__buttons">
  <button class="modal-row__button modal-row__button--minus">
    -
  </button>
  <input
    type="number"
    class="modal-row__count"
    value="1"
    disabled
    data-price="250"
  />
  <button class="modal-row__button modal-row__button--plus">
    +
  </button>
</div>
</div>`;
    } else {
      outProductRaw = '';
    }

    modalOrder.innerHTML += outProductRaw;
    modalOrder.classList.remove('modal-row-mb-15');
  }
  outProductRaw += '</div>';
}

basket();
