const VIETNAM_TOURS = "vietnamTours";
const FOREIGN_TOURS = "foreignTours";

const blankToursCart = {
  [VIETNAM_TOURS]: [],
  [FOREIGN_TOURS]: []
};

if (getToursCart() === null) {
  setToursCart(blankToursCart);
}

/*
const toursCart = {
  "vietnamTours": [
    {
      tour: [Object],
      quantity: 1,
    }
  ]
};
*/

function setToursCart(toursCart) {
  const toursCartString = JSON.stringify(toursCart);
  localStorage.setItem("toursCart", toursCartString);
}

function getToursCart() {
  const toursCartString = localStorage.getItem("toursCart");
  return JSON.parse(toursCartString);
}

function getTourInfoInCart(tourType, tourId) {
  const toursCart = getToursCart();
  for (var count = 0; count < toursCart[tourType].length; count++) {
    if (toursCart[tourType][count].tour.id === tourId) {
      return toursCart[tourType][count];
    }
  }
  return false;
}

async function addToCart(tourType, tourId) {
  const tourInfoInCart = getTourInfoInCart(tourType, tourId);
  if (tourInfoInCart) {
    updateTourQuantity(tourType, tourId, tourInfoInCart.quantity + 1);
    return;
  }
  const tour = await getTourById(tourType, tourId);
  const tourCartItem = {
    tour: tour,
    quantity: 1
  };
  const toursCart = getToursCart();
  toursCart[tourType].push(tourCartItem);
  setToursCart(toursCart);
}

async function updateTourQuantity(tourType, tourId, quantity) {
  const toursCart = getToursCart();
  const tours = toursCart[tourType];
  for (var count = 0; count < tours.length; count++) {
    if (tours[count].tour.id === tourId) {
      toursCart[tourType][count]["quantity"] = quantity;
      break;
    }
  }
  setToursCart(toursCart);
}

async function debug() {
  const debugObject = getToursCart();
  console.log(debugObject);
}