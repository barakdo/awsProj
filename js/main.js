const getProducts = () =>{
  
  fetch('https://6wdws3ku5i.execute-api.us-east-1.amazonaws.com/dev/products', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

window.onload = () => {
  const products = getProducts();
  console.log(products);
}