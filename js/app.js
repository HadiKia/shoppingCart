import LimitText from './LimitText.js';

// Dom
const main = document.querySelector('main')
const search = document.querySelector('.searchContainer input')
const catItems = document.querySelectorAll('.category li')

// EventListener
document.addEventListener('DOMContentLoaded', getProducts)
document.addEventListener('input', searchProducts)
catItems.forEach(catItem => catItem.addEventListener('click', filterProducts));

// functions
async function getProducts() {
    const result = await fetch("products/products.json")
    const data = await result.json()
    createProduct(data)
}

function createProduct(data) {
    if (data.length === 0) {
        main.innerHTML = `
            <p style="padding: 0 .5em">Sorry, there is'nt available product for you...</p>
        `
        return
    }
    main.innerHTML = ''
    data.forEach(product => {
        const productDiv = document.createElement('div')
        productDiv.classList.add('product')
        productDiv.innerHTML = `
         <div class="product-img">
                 <img src="${product.image}" alt="${product.title}">
         </div>
         <div class="product-details">
                 <p class="product-title" title="${product.title}">
                 ${LimitText(product.title, 3)}
                </p>
                <p class="product-price">${product.price} $</p>
          </div>
          <div class="product-buttons">
                <button class="addto-cart fa-light fa-cart-circle-plus"></button>
                 <button class="addto-description fad fa-circle-ellipsis"></button>
                <button class="addto-favorite fa-light fa-heart"></button>
          </div>
        `
        main.appendChild(productDiv)
    });
}

async function searchProducts() {
    if (search.value.length === 1) return
    const result = await fetch("products/products.json")
    const data = await result.json()
    const productResults = data.filter((product) => product.title.toLowerCase().includes(search.value.toLowerCase()))
    createProduct(productResults)
}

async function filterProducts(event) {
    let targetCat = event.target.nodeName === "IMG" ? event.target.alt : event.target.innerText
    const result = await fetch("products/products.json")
    const data = await result.json()
    const productResults = data.filter((product) => product.category === targetCat.toLowerCase())
    createProduct(productResults)
}
