const futureInventory = (data) => {
  //set all existing array separately
  let recipes = data.recipes.sort((a, b) => a.name.localeCompare(b.name));
  let inventory = data.inventory;
  let salesOfLastWeek = data.salesOfLastWeek.sort((a, b) => a.name.localeCompare(b.name));
  let wholesalePrices = data.wholesalePrices;

  //filter out the unneeded recipes and calculate the two weeks sale amount
  let usedNames = salesOfLastWeek.map(name => name.name)
  let filtered = recipes.filter(food => usedNames.indexOf(food.name) > -1).map((item, index) => ({ name: item.name, price: item.price, ingredients: item.ingredients, futureAmount: salesOfLastWeek[index].amount * 2 }));

  //multiply the recipes's ingredient's amount with the two weeks amount and convert them
  let multiplied = filtered.map(product => {
    for (let i = 0; i < product.ingredients.length; i++) {
      product.ingredients[i].newAmount = parseInt(product.ingredients[i].amount) * product.futureAmount;
      product.ingredients[i].newAmount = product.ingredients[i].name !== "egg" ?
        product.ingredients[i].newAmount / 1000
        : product.ingredients[i].newAmount;
    }

    return product;
  })
  //add together the ingredients is a new array and give them 10%
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
          summedIngredients[u].amount += prod.ingredients[o].newAmount;
        }
      }
    }
  })

  let upgradedIngredients = summedIngredients.map(item => ({ name: item.name, amount: item.amount * 1.1 })); //!!!!!

  //subtract the inventory's ingredient's amount from the receives amounts
  let subtractedIngredients = upgradedIngredients.map((elem, index) => ({ name: elem.name, amount: elem.amount - parseInt(inventory[index].amount) }));

  //divide the result with their unit sale and multiply them with their price
  let divided = subtractedIngredients.map((el, i) => {
    let obj = {};
    obj.name = el.name;
    obj.amount = el.amount;
    obj.unitAmount = Math.ceil(el.amount / parseInt(wholesalePrices[i].amount)); //!!!!!
    obj.uniquePrice = obj.unitAmount * wholesalePrices[i].price;

    return obj;
  });

  //put the name, the amount of difference and the received price into an object, and put it into an array, sorted by price
  let finalArr = divided.map(thing => {
    let uniqueAmount = "";

    if (thing.name === "flour" || thing.name === "gluten-free flour" || thing.name === "sugar" || thing.name === "butter" || thing.name === "vanilin sugar" ||
      thing.name === "fruit" || thing.name === "chocolate") {
      uniqueAmount = " kg";
    } else if (thing.name === "milk" || thing.name === "soy-milk") {
      uniqueAmount = " l";
    } else {
      uniqueAmount = " pc";
    }

    let obj = { name: thing.name, amount: thing.amount + uniqueAmount, totalPrice: thing.uniquePrice }
    return obj;
  })

  console.log(JSON.stringify(finalArr.filter(item => item.totalPrice > 0).sort((a, b) => b.totalPrice - a.totalPrice), null, 2));
  return JSON.stringify(finalArr.filter(item => item.totalPrice > 0).sort((a, b) => b.totalPrice - a.totalPrice), null, 2);
}

module.exports = futureInventory;