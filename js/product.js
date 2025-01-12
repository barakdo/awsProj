const getProducts = async () => {
  try {
    const response = await fetch('https://6wdws3ku5i.execute-api.us-east-1.amazonaws.com/dev/products');
    const data = await response.json();
    loader.style.display = "none"; 
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

window.onload = async () => {
  printProduct(product(await getProducts()));
}

const product = (products) => {
  const productId = localStorage.getItem("productId");
  for (const product of products) {
    if (product["productId"] == productId) {
      return product;
    }
  }
  return null;
}

const printProduct = (product) => {
  document.querySelector("link[rel='icon']").href = product["imgUrl"];
  document.title = product["productName"];
  let str = "";
  str += '<div class="product-image">';
  str += '<img src="' + product["imgUrl"] + '" alt="Sapphire Ring">';
  str += '</div>';
  str += '<div class="product-details">';
  str += '<h2 class="product-name">' + product["productName"] + '</h2>';
  str += ' <p class="price">' + product["productPrice"] + "$" + '</p>';
  str += ' <p class="description">' + product["productDescription"] + '</p>';
  str += '<button class="buy-now-btn">Buy Now</button>';
  str += '</div>';

  document.getElementById("product").innerHTML = str;
  colorHandle();
}

const colorHandle = () => {
    // Select the product image
    const productImage = document.querySelector(".product-page img");
    const productCanvas = document.getElementById("product");
    // Add event listener for mouseover
    productCanvas.addEventListener("mouseover", () => {
      productImage.style.filter = "grayscale(0%)";
    });
  
    // Add event listener for mouseout
    productCanvas.addEventListener("mouseout", () => {
      productImage.style.filter = "grayscale(100%)";
    });
  
}

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
});
