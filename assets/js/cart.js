const VIETNAM_TOURS = "vietnamTours";
const FOREIGN_TOURS = "foreignTours";

const defaultToursCart = [];

if (getCart() === null) {
  setCart(defaultToursCart);
}

function getCart() {
  const cartString = localStorage.getItem("cart");
  return JSON.parse(cartString);
}

function findTourInCart(tourType, tourObject) {
  const toursInCart = getCart();
  try {
    for (const tourInCart of toursInCart) {
      if (tourInCart.tourObject.id === tourObject.id && tourInCart.tourType === tourType) {
        return tourInCart;
      }
    }
    return null;
  } catch (exception) {
    return null;
  }
}

function addTourToCart(tourType, tourObject) {
  const foundTour = findTourInCart(tourType, tourObject);
  if (foundTour !== null) {
    updateQuantity(tourType, tourObject, foundTour.quantity + 1);
    return;
  }
  const tourInCart = {
    tourObject: tourObject,
    tourType: tourType,
    quantity: 1
  };
  const toursInCart = getCart();
  toursInCart.push(tourInCart);
  setCart(toursInCart);
}

function deleteCartItem(tourType, tourObject) {
  const cartObject = getCart();
  console.log(tourType, tourObject.id);
  const newCartObject = cartObject.filter(cartItem => !(cartItem.tourType === tourType && cartItem.tourObject.id === tourObject.id));
  console.log(newCartObject);
  setCart(newCartObject);
}

function updateQuantity(tourType, tourObject, quantity) {
  const toursInCart = getCart();
  for (const tourInCart of toursInCart) {
    if (tourInCart.tourObject.id === tourObject.id && tourInCart.tourType === tourType) {
      tourInCart.quantity = quantity;
      break;
    }
  }
  setCart(toursInCart);
}

function setCart(cartObject) {
  const cartString = JSON.stringify(cartObject);
  localStorage.setItem("cart", cartString);
}