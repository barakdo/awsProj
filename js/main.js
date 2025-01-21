const HomePageUrl = "http://localhost:5500/index.html";

const getOrders = async () => {
  const apiUrl = "https://6wdws3ku5i.execute-api.us-east-1.amazonaws.com/dev/orders";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": sessionStorage.getItem("tokenId")
  };

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Success:", data);  // Log the response data
    return data;  // Return the fetched data
  } catch (error) {
    console.error("Error:", error);
    return null;  // Return null if an error occurs
  }
}

const getProducts = async () => {
  try {
    const response = await fetch('https://6wdws3ku5i.execute-api.us-east-1.amazonaws.com/dev/products');
    const data = await response.json();
    finishFetching();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


const checkParameters = () => {
  const urlParams = new URLSearchParams(window.location.hash.substring(1));
  if (urlParams.size != 0) {
    sessionStorage.setItem("tokenId", urlParams.get("id_token"));
    window.location.href = HomePageUrl;
  }
}


window.onload = async () => {
  document.getElementById('buy-btn').addEventListener('click', buyCart);
  document.getElementById("submitBtn").addEventListener("click", addJewel);
  checkParameters();
  checkAdmin();
  loginOperate();
  modalOperate();
  printProducts(await getProducts());
  if (localStorage.getItem("music") == null) {
    localStorage.setItem("music", "false");
  }
  else if (localStorage.getItem("music") == "true") {
    document.getElementById('stopMusic').innerText = "Stop Music";
  }
  else {
    document.getElementById('stopMusic').innerText = "Start Music";
  }
  const audio = new Audio('/music/Die with a smile.mp3');
  audio.loop = true;
  let audioStarted = false;
  document.addEventListener('mousemove', () => {
    if (!audioStarted && localStorage.getItem("music") == "true") {
      audio.play().then(() => {
        audioStarted = true;
      }).catch((error) => {
      });
    }
  });
  if (!audioStarted && localStorage.getItem("music") == "true") {
    audio.play().then(() => {
      audioStarted = true;
    }).catch((error) => {
    });
  }
  const stopButton = document.getElementById('stopMusic');
  stopButton.addEventListener('click', () => {
    if (localStorage.getItem("music") == "true") {
      audio.pause();
      audio.currentTime = 0;
      stopButton.innerText = "Start Music";
      localStorage.setItem("music", "false");
    }
    else {
      audio.play();
      localStorage.setItem("music", "true");
      stopButton.innerText = "Stop Music";
    }
  })
};

const printProducts = (products) => {
  let str = "";
  for (const product of products) {
    str += '<div id=product' + product["productId"] + ' class="product-card">';
    str += '<img src="' + product['imgUrl'] + '" alt="Sapphire Ring">';
    str += '<div class="product-info">';
    str += '<h3>' + product['productName'] + '</h3>';
    str += '<p>' + product['productPrice'] + "$" + '</p>';
    str += '</div>';
    str += '</div>';
  }
  document.getElementById("products").innerHTML = str;
  for (const product of products) {
    const productCard = document.getElementById("product" + product["productId"]);
    productCard.addEventListener('click', (event) => {
      localStorage.setItem('product', JSON.stringify(product));
      window.location.href = '/html/product.html';
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
});

const finishFetching = () => {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
}


const modalOperate = () => {
  const modal = document.getElementById("myModal");
  document.getElementById("modal-title").innerText = "Orders List";
  const openModalButton = document.getElementById("openModalButton");
  const closeModalButton = document.getElementsByClassName("close")[0];
  if (sessionStorage.getItem("tokenId") == null) {
    //openModalButton.style.display = "none";
  }
  modal.style.display = "none";
  // Prevent default behavior of anchor tag and open the modal
  openModalButton.onclick = function (event) {
    event.preventDefault();  // Prevents the page from navigating
    modal.style.display = "block";
  }

  closeModalButton.onclick = function () {
    modal.style.display = "none";
  }

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }

}

const loginOperate = () => {
  const loginBtn = document.getElementById("loginBtn");
  if (sessionStorage.getItem("tokenId") != null) {
    loginBtn.innerText = "Log out";
  }
  else {
    loginBtn.innerText = "Log In";
    document.getElementById("shoppinCartBtn").style.display = "none";
  }
  loginBtn.addEventListener('click', function (event) {
    event.preventDefault();
    if (sessionStorage.getItem("tokenId") != null) {
      sessionStorage.clear();
      location.reload();
    }
    else {
      window.location.href = "https://us-east-1yrns7hepw.auth.us-east-1.amazoncognito.com/login/continue?client_id=7khoarepmud5tr0imq9khtsjtt&redirect_uri=http%3A%2F%2Flocalhost%3A5500%2Findex.html&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile";
    }
  })
}


const orderOperate = async () => {
  ordersData = await getOrders();

  const ordersContainer = document.getElementById('orders-container');

  if (!ordersData) {
    console.error('No orders available or invalid data:', ordersData);
    return; // Exit early if the data is invalid
  }

  ordersData.orders.forEach(order => {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card-modal';

    // Order Header
    const orderHeader = document.createElement('div');
    orderHeader.className = 'order-header-modal';
    orderHeader.innerHTML = `Order ID: ${order.orderId} - Total: $${order.totalPrice}`;

    // Order Details
    const orderDetails = document.createElement('div');
    orderDetails.className = 'order-details-modal';
    orderDetails.innerHTML = `Email: ${order.userEmail}<br>Order Date: ${new Date(order.orderDate).toLocaleString()}`;

    // Items Container
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'items-container-modal';

    // Loop over items in the order
    order.items.forEach(item => {
      const itemCard = document.createElement('div');
      itemCard.className = 'item-card-modal';

      const itemImage = document.createElement('img');
      itemImage.src = item.imgUrl;
      itemImage.alt = item.productName;

      const itemName = document.createElement('h3');
      itemName.innerText = item.productName;

      const itemQuantity = document.createElement('p');
      itemQuantity.innerText = `Quantity: ${item.quantity}`;

      const itemTotalPrice = document.createElement('p');
      itemTotalPrice.className = 'price';
      itemTotalPrice.innerText = `Total Price: $${item.totalPrice}`;

      itemCard.append(itemImage, itemName, itemQuantity, itemTotalPrice);
      itemsContainer.appendChild(itemCard);
    });

    // Append order header, details, and items to the order card
    orderCard.append(orderHeader, orderDetails, itemsContainer);
    ordersContainer.appendChild(orderCard);
  });
}


function displayCartItems() {
  let items;
  if (sessionStorage.getItem("cart") == null) {
    items = [];

    document.getElementById("cart-title").innerText = "Your shopping list is empty!";

  }
  else {
    items = JSON.parse(sessionStorage.getItem("cart"));

    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = ''; // Clear current cart content

    let totalPrice = 0;

    items.forEach((item) => {
      const itemTotalPrice = item.totalPrice * item.quantity;
      const itemElement = document.createElement('div');
      itemElement.classList.add('cart-item');
      itemElement.innerHTML = `
      <div class="cart-item-content">
        <img src="${item.imgUrl}" alt="${item.productName}" class="cart-item-image">
        <div class="cart-item-details">
          <h3>${item.productName}</h3>
          <p>Quantity: ${item.quantity}</p>
          <p>Price: ${itemTotalPrice}$</p>
        </div>
        <button class="remove-btn" onclick="removeItem(${item.productId})">Remove</button>
      </div>
    `;
      cartContainer.appendChild(itemElement);

      totalPrice += itemTotalPrice; // Add item total to the grand total
    });


    // Display total price and the buy button
    const totalElement = document.getElementById('total-price');
    totalElement.innerHTML = `Total: ${totalPrice}$`;
  }
  if (JSON.parse(sessionStorage.getItem("cart")) == null) {
    document.getElementById("buy-btn").style.display = "none";
    document.getElementById("total-price").style.display = "none";
  }
}

function removeItem(productId) {
  let items = JSON.parse(sessionStorage.getItem("cart"));
  let newList = [];
  for (const item of items) {
    if (item["productId"] != productId) {
      newList.push(item);
    }
  }
  sessionStorage.setItem("cart", JSON.stringify(newList));
  displayCartItems(); // Re-render the cart with the updated items
}

// Open cart modal
function openCartModal() {
  document.getElementById('cart-modal').style.display = 'block';
  displayCartItems();
}

// Close cart modal
function closeCartModal() {
  document.getElementById('cart-modal').style.display = 'none';
}

// Close modal when clicking on the close button
document.getElementById('cart-close').addEventListener('click', closeCartModal);

document.getElementById('order-close').addEventListener('click', closeOrderModal);

function closeOrderModal() {
  document.getElementById('myModal').style.display = 'none';
}


function showSuccessPopup() {
  const popup = document.getElementById('popup-alert');
  popup.classList.remove('hidden');
}

function closeSuccessPopup() {
  const popup = document.getElementById('popup-alert');
  popup.classList.add('hidden');
  window.location.href = HomePageUrl;
}

function showErrorPopup() {
  const popup = document.getElementById('error-popup');
  popup.classList.remove('hidden');
}

function closeErrorPopup() {
  const popup = document.getElementById('error-popup');
  popup.classList.add('hidden');
}

function productsConvert(productsList) {
  let arr = [];
  for (const item of productsList) {
    arr.push({
      productId: item["productId"],
      quantity: item["quantity"]
    })
  }
  return arr;
}


const postOrder = async () => {
  const apiUrl = "https://6wdws3ku5i.execute-api.us-east-1.amazonaws.com/dev/orders";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": sessionStorage.getItem("tokenId")
  };
  const conProducts = productsConvert(JSON.parse(sessionStorage.getItem("cart")));
  const body = {
    items: conProducts
  };
  console.log(body);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return true;
  } catch (error) {
    showErrorPopup();
    return null;  // Return null if an error occurs
  }
}


const buyCart = () => {
  closeCartModal();
  if (postOrder()) {
    showSuccessPopup();
    sessionStorage.removeItem('cart');
  }
}

const checkAdmin = async () => {
  const thisResponse = await GETAdmin();
  if (thisResponse["isAdmin"]) {
    document.getElementById("jewelBtn").style.display = "inline";
  }
  else {
    document.getElementById("jewelBtn").style.display = "none";
  }
  if (sessionStorage.getItem("tokenId") != null) {
    orderOperate();
    document.getElementById("openModalButton").removeAttribute('style');
  }
  else {
    document.getElementById("openModalButton").style.display = "none";
  }

}

const GETAdmin = async () => {
  const apiUrl = "https://6wdws3ku5i.execute-api.us-east-1.amazonaws.com/dev/isAdmin";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": sessionStorage.getItem("tokenId")
  };

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    //console.log("Success:", data);  // Log the response data
    return data;  // Return the fetched data
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}



const POSTNewJewel = async (name, description, price, imageStr) => {
  const apiUrl = "https://6wdws3ku5i.execute-api.us-east-1.amazonaws.com/dev/products";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": sessionStorage.getItem("tokenId")
  };
  const body = {
    "productName": name,
    "productDescription": description,
    "productPrice": price,
    "productImgUrl": imageStr
  };
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    alert("New Product added successfully to catalog!");
    return true;
  } catch (error) {
    console.log(error);
    return false;  // Return null if an error occurs
  }
}


function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No file provided");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result); // Base64 string
    };

    reader.onerror = () => {
      reject("Error reading file");
    };

    reader.readAsDataURL(file); // Read the file as a Base64 URL
  });
}



const addJewelform = () => {
  document.getElementById("newJewelDiv").style.display = "block";
  document.getElementById("jewelBtn").style.display = "none";
}

const addJewel = async (event) => {
  event.preventDefault();
  const jewelName = document.getElementById("jewel-name").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const image = document.getElementById("chooseImg").files.length;
  const imageFile = document.getElementById("chooseImg").files[0];

  if (!jewelName) {
    alert("Jewel Name cannot be empty!");
    return;
  }
  if (!description) {
    alert("Description cannot be empty!");
    return;
  }
  if (!price) {
    alert("Price cannot be empty!");
    return;
  }
  if (Number(price) <= 0) {
    alert("Price must be positive!");
    return;
  }

  if (image === 0) {
    alert("Please upload an image!");
    return;
  }
  try {
    const base64Image = await imageToBase64(imageFile);
    if(await POSTNewJewel(jewelName, description, price, base64Image)){
      location.reload();
    }
  } catch (error) {
    console.error("Error converting image to Base64:", error);
    alert("Failed to process the image. Please try again.");
  }

}
