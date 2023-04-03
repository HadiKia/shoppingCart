import LimitText from "./LimitText.js";

// Dom
const main = document.querySelector("main");
const search = document.querySelector(".searchContainer input");
const catItems = document.querySelectorAll(".category li");
const cartCounter = document.querySelector(".cartCounter");
const cartMain = document.querySelector(".cart-main");
const cartButton = document.querySelector(".cartContainer");
const productCartContainer = document.querySelector(".product-cart-container");
const menu = document.querySelector(".menu");
const totalPrice = document.querySelector('.totalPrice')
const clearButton = document.querySelector('.clearButton')

// EventListener
document.addEventListener("DOMContentLoaded", getProducts);
search.addEventListener("input", searchProducts);
catItems.forEach((catItem) => {
  catItem.addEventListener("click", filterProducts);
});
cartButton.addEventListener("click", openCartMenu);
clearButton.addEventListener('click',clearCart)

// functions
async function getProducts() {
  const result = await fetch("products/products.json");
  const data = await result.json();
  createProduct(data);
}

function createProduct(data) {
  if (data.length === 0) {
    main.innerHTML = `
            <p style="padding: 0 .5em">Sorry, there is'nt available product for you...</p>
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
      break;
    case "addto-favorite":
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
  const productPrice = productTargeted.price
  totalPrice.innerHTML = +totalPrice.innerHTML + productPrice
  numberOfProduct(productCartDiv,productPrice);
}

function openCartMenu() {
  productCartContainer.classList.toggle("open");
  menu.classList.toggle("open-cart");
  main.classList.toggle("open-cart");
}

// This function changes the product number and also deletes the product
function numberOfProduct(item,itemPrice) {
  // increase number
  const chevronUp = item.childNodes[5].childNodes[1].childNodes[1];
  chevronUp.addEventListener("click", () => {
    item.childNodes[5].childNodes[1].childNodes[3].innerHTML = +item.childNodes[5].childNodes[1].childNodes[3].innerHTML + 1;
    totalPrice.innerHTML = +totalPrice.innerHTML + itemPrice
  });
  // dicrease number
  const chevronDown = item.childNodes[5].childNodes[1].childNodes[5];
  chevronDown.addEventListener("click", () => {
    item.childNodes[5].childNodes[1].childNodes[3].innerHTML === "1" ? (item.remove(), cartCounter.innerHTML = +cartCounter.innerHTML - 1) : (item.childNodes[5].childNodes[1].childNodes[3].innerHTML = +item.childNodes[5].childNodes[1].childNodes[3].innerHTML - 1);
    totalPrice.innerHTML = +totalPrice.innerHTML - itemPrice
  });
  //  delete item
  const trash = item.childNodes[5].childNodes[3];
  trash.addEventListener("click", () => {
    item.remove();
    totalPrice.innerHTML = +totalPrice.innerHTML - itemPrice * +item.childNodes[5].childNodes[1].childNodes[3].innerHTML
    cartCounter.innerHTML = +cartCounter.innerHTML - 1
  });
}

function clearCart(){
  cartMain.innerHTML = ""
  totalPrice.innerHTML = "0"
  cartCounter.innerHTML = "0"
}