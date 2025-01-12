const getProducts = async () => {
  try {
    const response = await fetch('https://6wdws3ku5i.execute-api.us-east-1.amazonaws.com/dev/products');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

window.onload = async () => {
  printProducts(await getProducts());
}

const printProducts = (products) => {
  console.log(products);
  let str = "";
  for (const product of products) {
    str += '<div class="product-card">';
    str += '<img src="'+ product['imgUrl'] +'" alt="Sapphire Ring">';
    str += '<div class="product-info">';
    str += '<h3>'+ product['productName'] + '</h3>';
    str += '<p>'+ product['productPrice'] + '</p>';
    str += '</div>';
    str += '</div>';
  }
  document.getElementById("products").innerHTML = str;
}