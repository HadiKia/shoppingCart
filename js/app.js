import LimitText from "./LimitText.js";

// Dom
const body = document.querySelector("body");
const main = document.querySelector("main");
const search = document.querySelector(".searchContainer input");
const catItems = document.querySelectorAll(".category li");
const cartCounter = document.querySelector(".cartCounter");
const cartMain = document.querySelector(".cart-main");
const cartButton = document.querySelector(".cartContainer");
const productCartContainer = document.querySelector(".product-cart-container");
const menu = document.querySelector(".menu");
const totalPrice = document.querySelector(".totalPrice");
const clearButton = document.querySelector(".clearButton");
const user = document.querySelector(".user-icon");
const loginContainer = document.querySelector(".login-container");
const loginButton = document.querySelector(".login-button");
const errorMessage = document.querySelector(".errorMessage");
const warningMessage = document.querySelector(".warningMessage");

// EventListener
document.addEventListener("DOMContentLoaded", modal);
document.addEventListener("DOMContentLoaded", getProducts);
search.addEventListener("input", searchProducts);
catItems.forEach((catItem) => {
  catItem.addEventListener("click", filterProducts);
});
cartButton.addEventListener("click", openCartMenu);
clearButton.addEventListener("click", clearCart);
user.addEventListener("click", openUserMenu);
loginButton.addEventListener("click", login);

// functions
async function getProducts() {
  const userData =
    localStorage.getItem("user") &&
    JSON.parse(localStorage.getItem("user")).isLogged === true
      ? JSON.parse(localStorage.getItem("user"))
      : "";
  loggedUser(userData);
  const result = await fetch("products/products.json");
  const data = await result.json();
  createProduct(data);
}

function createProduct(data) {
  if (data.length === 0) {
    main.innerHTML = `
            <p class="not-found-product">Sorry, there is'nt available product for you...</p>
        `;
    return;
  }
  main.innerHTML = "";
  data.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product ";
    productDiv.innerHTML = `
         <div class="product-img">
                 <img src="${product.image}" alt="${product.title}">
                 <p class="product-description">${product.description}</p>
         </div>
         <div class="product-details">
                 <p class="product-title" title="${product.title}">
                 ${LimitText(product.title, 2)}
                </p>
                <p class="product-price">${product.price} $</p>
          </div>
          <div class="product-buttons">
                <button class="addto-cart fa-light fa-cart-circle-plus"></button>
                 <button class="addto-description fad fa-circle-ellipsis"></button>
                <button class="addto-favorite fa-light fa-heart"></button>
          </div>
        `;
    productDiv.dataset.id = product.id;
    productDiv.addEventListener("click", productButtons);
    main.appendChild(productDiv);
  });
}

async function searchProducts() {
  if (search.value.length === 1) return;
  const result = await fetch("products/products.json");
  const data = await result.json();
  const productResults = data.filter((product) =>
    product.title.toLowerCase().includes(search.value.toLowerCase())
  );
  createProduct(productResults);
}

async function filterProducts(event) {
  let targetCat =
    event.target.nodeName === "IMG" ? event.target.alt : event.target.innerText;
  const result = await fetch("products/products.json");
  const data = await result.json();
  const productResults = data.filter(
    (product) => product.category === targetCat.toLowerCase()
  );
  createProduct(productResults);
}

function productButtons(event) {
  switch (event.target.classList[0]) {
    case "addto-cart":
      event.target.disabled = true;
      event.target.classList.remove("fa-light", "fa-cart-circle-plus");
      event.target.classList.add("fad", "fa-cart-circle-check");
      addToCartButton(
        event.target.parentNode.parentNode.getAttribute("data-id")
      );
      break;
    case "addto-description":
      description(event.composedPath()[2].childNodes[1].childNodes[1]);
      break;
    case "addto-favorite":
      event.target.classList.toggle("fa-solid");
      break;
    default:
      break;
  }
}

async function addToCartButton(productId) {
  cartCounter.innerHTML = +cartCounter.innerHTML + 1;
  const result = await fetch("products/products.json");
  const data = await result.json();
  const productTargeted = data[+productId];
  const productCartDiv = document.createElement("div");
  productCartDiv.classList.add("product-cart");
  productCartDiv.classList.add("product");
  productCartDiv.innerHTML = `
  <div class="product-cart-img">
  <img src="${productTargeted.image}" alt="" />
</div>
<div class="product-details product-cart-detail">
  <p class="product-title">${LimitText(productTargeted.title, 3)}</p>
  <p class="product-price">${productTargeted.price} $</p>
</div>
<div class="product-cart-buttons">
     <div class="product-cart-controller">
          <i class="fas fa-chevron-up"></i>
          <span>1</span>
          <i class="fas fa-chevron-down"></i>
     </div>
     <i class="fas fa-trash-can"></i>
</div>
  `;
  cartMain.appendChild(productCartDiv);
  const productPrice = productTargeted.price;
  totalPrice.innerHTML = +totalPrice.innerHTML + productPrice;
  numberOfProduct(productCartDiv, productPrice);
}

function openCartMenu() {
  productCartContainer.classList.toggle("open");
  menu.classList.toggle("open-cart");
  main.classList.toggle("open-cart");

  loginContainer.classList.remove("open");
  menu.classList.remove("open-login");
  main.classList.remove("open-login");
}

// This function changes the product number and also deletes the product
function numberOfProduct(item, itemPrice) {
  // increase number
  const chevronUp = item.childNodes[5].childNodes[1].childNodes[1];
  chevronUp.addEventListener("click", () => {
    item.childNodes[5].childNodes[1].childNodes[3].innerHTML =
      +item.childNodes[5].childNodes[1].childNodes[3].innerHTML + 1;
    totalPrice.innerHTML = +totalPrice.innerHTML + itemPrice;
  });
  // dicrease number
  const chevronDown = item.childNodes[5].childNodes[1].childNodes[5];
  chevronDown.addEventListener("click", () => {
    item.childNodes[5].childNodes[1].childNodes[3].innerHTML === "1"
      ? (item.remove(), (cartCounter.innerHTML = +cartCounter.innerHTML - 1))
      : (item.childNodes[5].childNodes[1].childNodes[3].innerHTML =
          +item.childNodes[5].childNodes[1].childNodes[3].innerHTML - 1);
    totalPrice.innerHTML = +totalPrice.innerHTML - itemPrice;
  });
  //  delete item
  const trash = item.childNodes[5].childNodes[3];
  trash.addEventListener("click", () => {
    item.remove();
    totalPrice.innerHTML =
      +totalPrice.innerHTML -
      itemPrice * +item.childNodes[5].childNodes[1].childNodes[3].innerHTML;
    cartCounter.innerHTML = +cartCounter.innerHTML - 1;
  });
}

function clearCart() {
  cartMain.innerHTML = "";
  totalPrice.innerHTML = "0";
  cartCounter.innerHTML = "0";
}

function openUserMenu() {
  loginContainer.classList.toggle("open");
  menu.classList.toggle("open-login");
  main.classList.toggle("open-login");

  productCartContainer.classList.remove("open");
  menu.classList.remove("open-cart");
  main.classList.remove("open-cart");
}

async function login() {
  const username = document.querySelector(".username").value;
  const password = document.querySelector(".password").value;

  if (username === "") {
    warningMessage.style.display = "block";
    return;
  } else if (password === "") {
    warningMessage.style.display = "block";
    return;
  }
  warningMessage.style.display = "none";
  loginButton.value = "Logging . . .";

  const req = await fetch("https://fakestoreapi.com/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "Application/json" },
  });
  const res = req.json();
  res
    .then((userData) => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          isLogged: true,
          username,
          token: userData.token,
          loginTime: [
            new Date().toLocaleDateString(),
            new Date().toLocaleTimeString(),
          ],
        })
      );
      loggedUser(JSON.parse(localStorage.getItem("user")));
      loginContainer.classList.toggle("open");
      menu.classList.toggle("open-login");
      main.classList.toggle("open-login");
    })
    .catch(
      (errorMessage.style.display = "block"),
      (loginButton.value = "Login")
    );
}

function loggedUser(userData) {
  if (!userData) return;
  loginContainer.classList.add("logged");
  user.classList.remove("fa-user-vneck");
  user.classList.add("fa-user-check");

  loginContainer.innerHTML = `
  <div class="logged-items">
      <i class="fal fa-circle-user"></i>
      <p>Hey <span>${userData.username}</span> , welcome!</p>
  </div>
  <div class="logged-items">
      <i class="fal fa-clock"></i>
      <p>Login Time: <span>${userData.loginTime[0]} , ${userData.loginTime[1]}</span></p>
  </div>
  <div class="logged-button">
      <button class="logout-button">Logout</button>
  </div>
  `;
  document.querySelector(".logout-button").addEventListener("click", logout);
}

function logout() {
  document.querySelector(".logout-button").innerHTML = "Logging Out ...";

  setInterval(() => {
    loginContainer.classList.remove("logged");
    user.classList.add("fa-user-vneck");
    user.classList.remove("user-check");

    loginContainer.innerHTML = `
      <div class="inputs">
          <i class="fa-light fa-user"></i>
          <input type="text" placeholder="Username" class="username" />
      </div>
      <div class="inputs">
          <i class="fa-light fa-lock-keyhole"></i>
         <input type="password" placeholder="Password" class="password" />
      </div>
      <input type="button" value="Login" class="login-button" />
    `;
  }, 1000);

  const userData = JSON.parse(localStorage.getItem("user"));
  userData.token = "";
  userData.isLogged = false;
  localStorage.setItem("user", JSON.stringify(userData));
}

async function description(image) {
  image.classList.toggle("hide");
  const description = image.parentNode.childNodes[3];
  description.classList.toggle("show");
}

function modal() {
  const modalDiv = document.createElement("div");
  modalDiv.className = "modal";
  modalDiv.innerHTML = `
  <div class="modal-box">

  <div class="modal-box-item">
  <h3>minimal shopping cart features</h3>
  <ul>
    <li>filter products</li>
    <li>add and remove item from cart</li>
    <li>minus and plus quantity cart items</li>
    <li>reset cart items</li>
    <li>show total price</li>
    <li>FakeSotreApi for login auth ( <a target="_blank" href="https://fakestoreapi.com/users">here</a> )</li>
    <li>create a product.json for get products</li>
  </ul>
  </div>

  <div class="modal-box-item">
  <h3>web development technologies</h3>
  <ul>
    <li>html,css</li>
    <li>vanillaJS</li>
  </ul>
  </div>

  <button>ok</button>
  
 </div>
  `;
  body.appendChild(modalDiv);
  hideModal(modalDiv);
}

function hideModal(modalDiv) {
  const okButton = modalDiv.childNodes[1].childNodes[5];
  okButton.addEventListener("click", () => {
    modalDiv.style.display = "none";
  });
}

main.addEventListener('click', () => {
  productCartContainer.classList.remove("open");
  loginContainer.classList.remove("open");
  menu.classList.remove("open-login");
  main.classList.remove("open-login");
  menu.classList.remove("open-cart");
  main.classList.remove("open-cart");
})