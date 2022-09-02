const maffia = (data) => {
  //set the recipes, the wholesaleprice and the maffia's request
  let recipes = data.recipes.sort((a, b) => a.name.localeCompare(b.name));;
  let wholesalePrices = data.wholesalePrices;
  let request = [{ name: "Francia krémes", amount: 300 },
  { name: "Rákóczi túrós", amount: 200 },
  { name: "Képviselőfánk", amount: 300 },
  { name: "Isler", amount: 100 },
  { name: "Tiramisu", amount: 150 }].sort((a, b) => a.name.localeCompare(b.name));

  //filter out the unneeded recipes and give the requested amount to the remained ones
  let requestNames = request.map(name => name.name)
  let filtered = recipes.filter(food => requestNames.indexOf(food.name) > -1).map((item, index) => ({ name: item.name, price: item.price, ingredients: item.ingredients, soldAmount: request[index].amount }));

  //multiply the ingredients quantity with the maffia's amount and convert them
  let multiplied = filtered.map(product => {
    product.totalPrice = 0;

    for (let i = 0; i < product.ingredients.length; i++) {
      product.ingredients[i].saleAmount = parseInt(product.ingredients[i].amount) * product.soldAmount;
      product.ingredients[i].saleAmount = product.ingredients[i].name !== "egg" ?
        product.ingredients[i].saleAmount / 1000
        : product.ingredients[i].saleAmount;

      //divide the ingredients with their unit sale and multiply the result with their price
      wholesalePrices.forEach(item => {
        if (item.name === product.ingredients[i].name) {
          product.ingredients[i].result = Math.ceil(product.ingredients[i].saleAmount / parseInt(item.amount));

          //multiply the divided amount with its price
          product.ingredients[i].multPrice = product.ingredients[i].result * item.price;

          //add the prices together
          product.totalPrice += product.ingredients[i].multPrice;
        }
      })
    }
    return product;
  })

  //sum the numbers of array
  let priceArr = multiplied.map(item => item.totalPrice);
  console.log(priceArr.reduce((a, b) => a + b));
  return priceArr.reduce((a, b) => a + b);
}

module.exports = maffia;