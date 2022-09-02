const allProfit = require("./task_01_allProfit.js");

const actualProfit = (data) => {
  //set the lastweek sales, the whole sale price and the recipes
  let onlySales = allProfit(data);
  let salesOfLAstWeek = data.salesOfLastWeek.sort((a, b) => a.name.localeCompare(b.name));
  let recipes = data.recipes.sort((a, b) => a.name.localeCompare(b.name));
  let wholesalePrices = data.wholesalePrices;

  //filter out the unneeded recipes and give the sold amount for the rest
  let salesNames = data.salesOfLastWeek.map(name => name.name)
  let filtered = recipes.filter(food => salesNames.indexOf(food.name) > -1).map((item, index) => ({ name: item.name, price: item.price, ingredients: item.ingredients, soldAmount: salesOfLAstWeek[index].amount }));

  //multiply the ingredients quantity with the sold amount and convert them
  let multiplied = filtered.map(product => {
    for (let i = 0; i < product.ingredients.length; i++) {
      product.ingredients[i].saleAmount = parseInt(product.ingredients[i].amount) * product.soldAmount;
      product.ingredients[i].saleAmount = product.ingredients[i].name !== "egg" ?
        product.ingredients[i].saleAmount / 1000
        : product.ingredients[i].saleAmount;
    }
    return product;
  })

  //add the ingredients together
  let summedIngredients = [
    { name: "flour", amount: 0 },
    { name: "gluten-free flour", amount: 0 },
    { name: "egg", amount: 0 },
    { name: "sugar", amount: 0 },
    { name: "milk", amount: 0 },
    { name: "soy-milk", amount: 0 },
    { name: "butter", amount: 0 },
    { name: "vanilin sugar", amount: 0 },
    { name: "fruit", amount: 0 },
    { name: "chocolate", amount: 0 }
  ];

  multiplied.map(prod => {
    for (let o = 0; o < prod.ingredients.length; o++) {
      for (let u = 0; u < summedIngredients.length; u++) {
        if (summedIngredients[u].name === prod.ingredients[o].name) {
          summedIngredients[u].amount += prod.ingredients[o].saleAmount;
        }
      }
    }
  })

  //divide the total ingredients with their unit sale and multiply the result with their price
  let divided = summedIngredients.map((elem, i) => {
    elem.dividedAmount = elem.amount / parseInt(wholesalePrices[i].amount);
    elem.totalPrice = elem.dividedAmount * wholesalePrices[i].price;
    return elem;
  })

  //add the prices togeher and subtract it from the onlySales
  let final = divided.map(price => price.totalPrice).reduce((a, b) => a + b);

  console.log(onlySales - final)
  return onlySales - final;
}

module.exports = actualProfit;