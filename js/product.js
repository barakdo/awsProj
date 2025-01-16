const postOrder = async () => {
  const apiUrl = "https://6wdws3ku5i.execute-api.us-east-1.amazonaws.com/dev/orders";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": sessionStorage.getItem("tokenId")
  };
  const thisProduct = product();
  const body = {
    productId: thisProduct["productId"],
    quantity: document.getElementById('quantity').value
  };

  fetch(apiUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Success:", data);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

window.onload = () => {
  printProduct(product());
  quantityOperate();
  loader.style.display = "none";
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
}

const product = () => {
  return JSON.parse(localStorage.getItem("product"));
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
  str += '<div id=quantityBuy>';
  str += '<div class="quantity-container">';
  str += '<button type="button" id="minus">-</button>';
  str += '<input type="number" id="quantity" value="1" min="1">';
  str += '<button type="button" id="plus">+</button>';
  str += '</div>';
  str += '<button class="buy-now-btn">Buy Now</button>';
  str += '</div>';
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


const quantityOperate = () => {
  const minusButton = document.getElementById('minus');
  const plusButton = document.getElementById('plus');
  const quantityInput = document.getElementById('quantity');

  minusButton.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value, 10);
    if (currentValue > parseInt(quantityInput.min, 10)) {
      quantityInput.value = currentValue - 1;
    }
  });

  plusButton.addEventListener('click', () => {
    quantityInput.value = parseInt(quantityInput.value, 10) + 1;
  });
}