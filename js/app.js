const main = document.querySelector('main')

// EventListener
document.addEventListener('DOMContentLoaded', getProducts)

// functions
async function getProducts(){
    const result = await fetch("products/products.json")
    const data = await result.json()
    createProduct(data)
}

function createProduct(data){
    data.forEach(product => {
        const productDiv = document.createElement('div')
        productDiv.classList.add('product')
        productDiv.innerHTML = `
         <div class="product-img">
                 <img src="${product.image}" alt="img">
         </div>
         <div class="product-details">
                 <p class="product-title" title="${product.title}">
                 ${LimitText(product.title, 3)}
                </p>
                <p class="product-price">${product.price}</p>
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

function LimitText(data, limited) {
    data = data.split(" ");
    if (data.length >= limited) {
      data.length = limited;
      data.push("...");
    }
    return data.join(" ");
  }
