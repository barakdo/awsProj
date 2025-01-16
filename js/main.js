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
    window.location.href = 'http://localhost:5500/index.html';
  }
}


window.onload = async () => {
  checkParameters();
  if (sessionStorage.getItem("tokenId") != null) {
    orderOperate();
  }
  else {
    document.getElementById("openModalButton").style.display = "none";
  }
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
  if(sessionStorage.getItem("tokenId") != null){
    loginBtn.innerText = "Log out";
  }
  else{
    loginBtn.innerText = "Log In";
  }
  loginBtn.addEventListener('click', function(event) {
    event.preventDefault();
    if(sessionStorage.getItem("tokenId") != null){     
      sessionStorage.clear();
      location.reload();
    }
    else{  
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




