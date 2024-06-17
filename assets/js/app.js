/*
UwU
*/
const TOURS_PER_PAGE = 8;
const HOTELS_PER_PAGE = 8;
const finalFilePath = new URL(window.location.href).pathname.split("/").pop();

function valueToVND(value) {
  const options = {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 9,
  }
  return new Intl.NumberFormat('vi-VN', options).format(value);
}

function activeCurrentNavigationLink() {
  const navbarLinks = $("span[class*='navbar-textlink']");
  navbarLinks.each(function (index) {
    const navbarLocation = $(this).parent();
    if (navbarLocation.attr("href") === finalFilePath) {
      const navbarLink = navbarLinks[index];
      $(navbarLink).addClass("active");
      return;
    }
  });
}

function activeCurrentOffcanvasLink() {
  const offcanvasLinks = $(".offcanvas-body .nav-item > .nav-link");
  offcanvasLinks.each(function (index) {
    const offcanvasLink = offcanvasLinks[index];
    if ($(offcanvasLink).attr("href") === finalFilePath) {
      $(offcanvasLink).addClass("active");
      return;
    }
  });
}

async function getTourById(tourType, tourId) {
  const tours = await getTours(tourType);
  return tours[tourId - 1];
}

function createPreview(content, length) {
  if (content.length <= length) {
    return content;
  } else {
    return content.slice(0, length) + "...";
  }
}

async function getTours(tourType) {
  const response = await fetch("assets/js/data/" + tourType + ".json");
  const tours = await response.json();
  return tours;
}

function getTotalPages(tours) {
  return Math.round(tours.length / TOURS_PER_PAGE);
}

function getQuery(field, defaultValue) {
  const url = new URL(window.location.href);
  const value =
    new URLSearchParams(url.searchParams).get(field) ?? defaultValue;
  return value;
}

const page = +getQuery("page", 1);
const tourId = +getQuery("tourId", 1);
const tourType = getQuery("tourType", "vietnamTours");

function getStartDataIndex(page) {
  return (page - 1) * TOURS_PER_PAGE;
}

async function fetchToursByPage(tourType, page) {
  const tours = await getTours(tourType);
  const startIndex = getStartDataIndex(page);
  const data = [];
  for (var count = startIndex; count < startIndex + TOURS_PER_PAGE; count++) {
    const selectedTour = tours[count];
    data.push(selectedTour);
  }
  return data;
}

/* Render components */
async function renderNavbar() {
  const response = await fetch("includes/navbar.html");
  const content = await response.text();
  $("#navbarPlaceholder").html(content);
}

async function renderOffcanvas() {
  const response = await fetch("includes/offcanvas.html");
  const content = await response.text();
  $("#offcanvasPlaceholder").html(content);
}

async function renderFooter() {
  const response = await fetch("includes/footer.html");
  const content = await response.text();
  $("#footerPlaceholder").html(content);
}
/* Render components */

async function renderLayout() {
  await renderNavbar();
  await renderOffcanvas();
  await renderFooter();
}

/* Tên hàm bê từ PHP qua */
function ucfirst(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

async function renderSliderTours(selector, tourType) {
  const tours = await getTours(tourType);
  const sliderTours = tours.slice(0, 10);
  var toursHTML = "";
  for (const tour of sliderTours) {
    const tourHref =
      "bookTour.html?tourType=" + tourType + "&tourId=" + tour.id;
    const tourHTML = `
    <div class="swiper-slide tours-slide">
      <div class="card" style="width: 20rem">
        <div class="hovereffect">
          <img class="card-img-top" src="${tour.picture}" alt="">
          <div class="overlay">
            <h2>${tour.source}</h2>
          </div>
        </div>
        <div class="card-body">
          <!-- Tour information -->
          <div class="d-flex flex-column justify-content-start">
            <a class="text-start mb-3 tour-title" href="${tourHref}">${createPreview(
      tour.title,
      50
    )}</a>
            <div class="d-flex align-items-center">
              <i class="fa-regular fa-clock mx-2"></i>
              <a style="font-size: 0.85rem">${tour.last}</a>
            </div>
            <div class="d-flex align-items-center mt-1">
              <i class="fa-regular fa-calendar mx-2"></i>
              <a style="font-size: 0.85rem">${tour.schedule}</a>
            </div>
            <div class="d-flex align-items-center mt-1">
              <i class="fa-regular fa-user mx-2"></i>
              <a style="font-size: 0.85rem">${tour.slots}</a>
            </div>
            <div class="d-flex align-items-center mt-1">
              <i class="fa-solid fa-sack-dollar mx-2"></i>
              <a class="text-decoration-none" style="color: red; font-weight: bold;">${
                valueToVND(tour.price)
              }</a>
            </div>
          </div>
          <!-- Tour information -->
        </div>
      </div>
    </div>`;
    toursHTML += tourHTML;
  }
  $(selector).html(toursHTML);
}

async function renderPagination(tourType) {
  const tours = await getTours(tourType);
  const totalPages = getTotalPages(tours);
  const paginationHTML = `
  <nav aria-label="Pagination">
    <ul class="pagination">
      <li class="page-item ${page === 1 ? "disabled" : ""}">
        <a class="page-link" href="${`${tourType}.html?page=${
          page - 1
        }`}">Trang trước</a>
      </li>
      <li class="page-item active" aria-current="page">
        <a class="page-link" href="#">${page}</a>
      </li>
      <li class="page-item ${page === totalPages ? "disabled" : ""}">
        <a class="page-link" href="${`${tourType}.html?page=${
          page + 1
        }`}">Trang sau</a>
      </li>
    </ul>
  </nav>
  `;
  $("#pagination").html(paginationHTML);
}

async function renderToursByPage(selector, tourType, page) {
  const toursByPage = await fetchToursByPage(tourType, page);
  var toursHTML = "";
  for (const tour of toursByPage) {
    if (tour === undefined) {
      continue;
    }
    const tourHref =
      "bookTour.html?tourType=" + tourType + "&tourId=" + tour.id;
    const tourHTML = `
    <div class="mb-3 d-flex justify-content-center col">
      <div class="card" style="width: 20rem">
        <div class="hovereffect">
          <img class="card-img-top" src="${tour.picture}" alt="">
          <div class="overlay">
            <h2>${tour.source}</h2>
          </div>
        </div>
        <div class="card-body">
          <!-- Tour information -->
          <div class="d-flex flex-column justify-content-start">
            <a class="text-start mb-3 tour-title" href="${tourHref}">${createPreview(
      tour.title,
      50
    )}</a>
            <div class="d-flex align-items-center">
              <i class="fa-regular fa-clock mx-2"></i>
              <a style="font-size: 0.85rem">${tour.last}</a>
            </div>
            <div class="d-flex align-items-center mt-1">
              <i class="fa-regular fa-calendar mx-2"></i>
              <a style="font-size: 0.85rem">${tour.schedule}</a>
            </div>
            <div class="d-flex align-items-center mt-1">
              <i class="fa-regular fa-user mx-2"></i>
              <a style="font-size: 0.85rem">${tour.slots}</a>
            </div>
            <div class="d-flex align-items-center mt-1">
              <i class="fa-solid fa-sack-dollar mx-2"></i>
              <a class="text-decoration-none" style="color: red; font-weight: bold;">${
                valueToVND(tour.price)
              }</a>
            </div>
          </div>
          <!-- Tour information -->
        </div>
      </div>
    </div>`;
    toursHTML += tourHTML;
  }
  $(selector).html(toursHTML);
}

async function renderHotelsByPage(selector, page) {
  const response = await fetch("assets/js/data/hotels.json");
  const hotels = await response.json();
  const startIndex = (page - 1) * HOTELS_PER_PAGE;
  var hotelsHTML = "";
  for (var count = startIndex; count < startIndex + HOTELS_PER_PAGE; count++) {
    const hotel = hotels[count];
    if (hotel === undefined) {
      continue;
    }
    const vndCurrency = valueToVND(hotel.price);
    const hotelHTML = `
    <div class="d-flex justify-content-center col">
      <div class="mb-3 d-flex justify-content-center col">
        <div class="card" style="width: 20rem">
          <img class="card-img-top" src="${hotel.picture}" alt="">
          <div class="card-body">
            <!-- Tour information -->
            <div class="d-flex flex-column justify-content-start">
              <a class="tour-title" style="font-size: 1.1rem; font-weight: semibold" href="#">${createPreview(
                hotel.title,
                50
              )}</a>
              <div class="d-flex justify-content-center m-1 text-warning">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <div class="d-flex flex-column justify-content-center align-items-center">
                <div>
                  <i class="fa-solid fa-sack-dollar fa-lg mx-2"></i>
                  <a class="text-decoration-none" style="color: red; font-weight: bold; font-size: 1.5rem">${
                    vndCurrency
                  }</a>
                </div>
                <div>
                  <i class="fa-solid fa-phone fa-lg mx-2"></i>
                  <span style="font-weight: bold; font-size: 1.2rem;">${hotel.phone}</span>
                </div>
              </div>
            </div>
            <!-- Tour information -->
          </div>
        </div>
      </div>
    </div>
    `;
    hotelsHTML += hotelHTML;
  }
  $(selector).html(hotelsHTML);

  /* Render ra phần phân trang */
  const totalPages = Math.round(hotels.length / HOTELS_PER_PAGE);
  const paginationHTML = `
  <nav aria-label="Pagination">
    <ul class="pagination">
      <li class="page-item ${page === 1 ? "disabled" : ""}">
        <a class="page-link" href="${`hotels.html?page=${
          page - 1
        }`}">Trang trước</a>
      </li>
      <li class="page-item active" aria-current="page">
        <a class="page-link" href="#">${page}</a>
      </li>
      <li class="page-item ${page === totalPages ? "disabled" : ""}">
        <a class="page-link" href="${`hotels.html?page=${
          page + 1
        }`}">Trang sau</a>
      </li>
    </ul>
  </nav>
  `;
  $("#pagination").html(paginationHTML);
}

async function renderTourDetails(selector, tourType, tourId) {
  const tour = await getTourById(tourType, tourId);
  const tourDetailsHTML = `
  <div class="row">
    <div class="p-0 col-sm-12 col-lg-4">
      <img src="${tour.picture}" class="w-100">
    </div>
    <div class="p-0 col-sm-12 col-lg-8 border">
      <div class="mt-3 row">
        <div class="col-12">
          <span class="h3">${tour.title}</span>
        </div>
      </div>
      <hr>
      <div class="p-3">
        <div class="mb-1 row">
          <div class="col">
            <span>Mã tour:</span>
            <span class="fw-bold">${tour.id}</span>
          </div>
        </div>
        <div class="mb-1 row">
          <div class="col">
            <span>Thời gian:</span>
            <span class="fw-bold">${tour.last}</span>
          </div>
        </div>
        <div class="mb-1 row">
          <div class="col">
            <span>Giá:</span>
            <span class="fw-bold text-danger">${ valueToVND(tour.price) }</span>
          </div>
        </div>
        <div class="mb-1 row">
          <div class="col">
            <span>Ngày khởi hành 4:</span>
            <span class="fw-bold">${tour.schedule}</span>
          </div>
        </div>
        <div class="mb-1 row">
          <div class="col">
            <span>Nơi khởi hành 4:</span>
            <span class="fw-bold">${tour.source}</span>
          </div>
        </div>
        <div class="mb-1 row">
          <div class="col">
            <span>Số chỗ còn nhận:</span>
            <span class="fw-bold">${tour.slots}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script>
    const tour = ${ JSON.stringify(tour) }
  </script>
  `;
  $(selector).html(tourDetailsHTML);
  const priceVND = valueToVND(tour.price);
  $("#finalPrice").html(priceVND);
  $("#mustPurchase").html(priceVND);
}

function getRandInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function buildCartItemHTML(tourInCart) {
  const tourInCartIndentifier = `${tourInCart.tourType}-${tourInCart.tourObject.id}`;
  const tour = tourInCart.tourObject;
  return `
  <div class="row" id="${tourInCartIndentifier}">
    <div class="col-2">
      <img src="${tour.picture}" class="img-fluid object-fit-cover">
    </div>
    <div class="d-flex flex-column ps-3 pe-3 col-8 justify-content-between">
      <span class="fw-semibold">${tour.title}</span>
      <div class="d-flex justify-content-between">
        <span class="fw-semibold">
          Giá:
          <span class="text-danger fw-bold">
            ${ valueToVND(tour.price) }
          </span>
        </span>
        <span class="fw-semibold">
          Số lượng:
          <span class="text-danger fw-bold">
            ${ tourInCart.quantity }
          </span>
        </span>
      </div>
    </div>
    <div class="d-flex col-2 justify-content-center align-items-center">
      <button type="button" class="btn btn-danger" id="delete-${tourInCartIndentifier}">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  </div>
  <hr class="mb-3 mt-3">`;
}

async function renderCartOffcanvas() {
  var cartItemsHTML = "";
  const toursInCart = getCart();
  var totalPurchase = 0;
  for (const tourInCart of toursInCart) {
    const cartItemHTML = buildCartItemHTML(tourInCart);
    totalPurchase += tourInCart.tourObject.price * tourInCart.quantity;
    cartItemsHTML += cartItemHTML;
  }
  const vndCurrency = valueToVND(totalPurchase);
  $(".container-fill").append(`
  <!-- Cart offcanvas -->
  <div id="cartOffcanvasPlaceholder">
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasCart">
      <div class="offcanvas-header">
        <h3 class="offcanvas-title">
          <a class="text-decoration-none" style="color: #58b2e6" href="index.html">Giỏ hàng của bạn</a>
        </h3>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        ${cartItemsHTML}
        <div class="d-flex justify-content-center align-items-center m-5">
          <i class="fa-solid fa-money-bill fa-xl me-2"></i><span class="h3">THANH TOÁN HOÁ ĐƠN</span>
        </div>
        <div class="row">
          <div class="d-flex justify-content-center col-12">
            <img src="assets/images/VNB_QR.png" class="img-fluid w-lg-25 w-sm-50">
          </div>
          <div class="d-flex justify-content-center mt-3 col-12">
            <div class="d-flex flex-column fw-bold border rounded p-3" style="font-size: 1.5rem;">
              <span class="mb-2">TÊN TÀI KHOẢN: <span class="text-danger">VO NGOC BAO</span></span>
              <span class="mb-2">SỐ TÀI KHOẢN: <span class="text-danger">4013092005</span></span>
              <span class="mb-2">NỘI DUNG CHUYỂN KHOẢN: <span class="text-danger">TOUR [NGÀY,THÁNG,NĂM], [SỐ ĐIỆN THOẠI]</span></span>
              <span class="mb-2">SỐ TIỀN CHUYỂN KHOẢN: <span class="text-danger">${vndCurrency}</span></span>
              <span class="mb-2">NGÂN HÀNG: MB BANK</span>
            </div>
          </div>
        </div>
        <hr class="mt-3 mb-3">
        <div class="d-flex justify-content-between">
          <div>
            <span class="fw-semibold">
              Tổng tiền:
              <span class="text-danger fw-bold" style="font-size: 1.2rem">
                ${vndCurrency}
              </span>
            </span>
          </div>
          <div>
            <button class="btn btn-outline-success" type="submit" id="purchaseCartButton">
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script>
    $('button[id*="delete"]').on("click", async function(event) {
      event.preventDefault();
      const tourCartId = this.id.replaceAll("delete-", "");
      const tourInfo = tourCartId.split("-");
      const tourType = tourInfo[0];
      const tourId = +tourInfo[1];
      const tourObject = await getTourById(tourType, tourId);
      deleteCartItem(tourType, tourObject);
      await Swal.fire({
        icon: "success",
        title: "Xoá đơn hàng thành công!",
        text: "Vui lòng kiểm tra lại giỏ hàng!",
      });
      location.reload();
    });
  </script>
  <!-- Cart offcanvas -->
  <script>
    $("#purchaseCartButton").on("click", function () {
      Swal.fire({
        icon: "success",
        title: "Thanh toán thành công!",
        text: "Chúng tôi sẽ liên hệ lại bạn qua số điện thoại để tiến hành chuẩn bị.",
      });
    });
  </script>
  `);
}

async function renderComments(commentType, selector) {
  const response = await fetch("assets/js/data/" + commentType + ".json");
  const comments = await response.json();
  var commentsHTML = "";
  for (const comment of comments) {
    const commentHTML = `
    <!-- Comment -->
    <div class="comment p-3 mb-3 border rounded bg-white">
      <div class="d-flex flex-column">
        <!-- Comment header -->
        <div class="d-flex">
          <div class="me-3">
            <img class="comment-author-avatar" src="${comment.avatar}" loading="lazy">
          </div>
          <div>
            <div class="d-flex flex-column justify-content-between h-100">
              <div class="comment-author-name">
                <a class="h4" href="${comment.facebook}" target="_blank" style="color: rgb(71, 100, 159);">${comment.author}</a>
              </div>
              <div class="comment-last-edited">
                ${comment.lastEdited}
              </div>
            </div>
          </div>
        </div>
        <!-- Comment header -->
        <!-- Comment content -->
        <div class="mt-3 mb-3">
          <span style="font-size: 1.15rem;">${comment.content}</span>
        </div>
        <hr style="margin: 0.2rem">
        <div class="d-flex comment-actions justify-content-between">
          <button class="comment-likes">
            <i class="fa-solid fa-heart"></i>
            <span class="fw-semibold">${comment.likes} Likes</span>
          </button>
          <button class="comment-dislikes">
            <i class="fa-solid fa-thumbs-down"></i>
            <span class="fw-semibold">${comment.dislikes} Dislikes</span>
          </button>
          <button class="comment-report">
            <i class="fa-solid fa-flag"></i>
            <span class="fw-semibold">Report</span>
          </button>
        </div>
        <hr style="margin: 0.2rem">
        <!-- Comment content -->
      </div>
    </div>
    <!-- Comment -->
    `;
    commentsHTML += commentHTML;
  }
  $(selector).html(commentsHTML);
}

$(document).ready(async function () {
  try {
    /* Global components */
    await renderLayout();
    activeCurrentNavigationLink();
    activeCurrentOffcanvasLink();
    await renderCartOffcanvas();
    /* Global components */

    /* Only homepage */
    await renderSliderTours("#sliderVietnamTours", "vietnamTours");
    await renderSliderTours("#sliderForeignTours", "foreignTours");
    await renderComments("toursComments", "#toursCommentsPlaceholder");
    /* Only homepage */
    if (finalFilePath === "vietnamTours.html") {
      await renderToursByPage("#vietnamTours", "vietnamTours", page);
      await renderPagination("vietnamTours");
    }
    if (finalFilePath === "foreignTours.html") {
      await renderToursByPage("#foreignTours", "foreignTours", page);
      await renderPagination("foreignTours");
    }
    if (finalFilePath === "hotels.html") {
      await renderHotelsByPage("#hotels", page);
      await renderComments("hotelsComments", "#hotelsCommentsPlaceholder");
    }
    if (finalFilePath === "bookTour.html") {
      await renderTourDetails("#tourDetails", tourType, tourId);
    }
  } catch (exception) {
    console.log(exception);
  }
});
