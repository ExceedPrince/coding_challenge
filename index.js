const bakeryData = require('./bakery.json');


function allProfit(data) {
  let salesArr = data.salesOfLastWeek;
  let salesNames = data.salesOfLastWeek.map(name => name.name)
  let usablesArr = data.recipes.filter(food => salesNames.indexOf(food.name) > -1);

  salesArr = salesArr.sort((a, b) => a.name.localeCompare(b.name));
  usablesArr = usablesArr.sort((a, b) => a.name.localeCompare(b.name));

  let prices = [];

  for (let i = 0; i < salesArr.length; i++) {
    let result = salesArr[i].amount * parseInt(usablesArr[i].price);
    prices.push(result);
  }

  console.log(prices.reduce((a, b) => a + b));
  return prices.reduce((a, b) => a + b);
}

function freeStuffs(data) {
  let gluFree = [];
  let lacFree = [];
  let bothFree = [];

  data.recipes.forEach(item => {
    if (item.lactoseFree === true && item.glutenFree === true) {
      bothFree.push({ name: item.name, price: item.price });
      return;
    }
    if (item.lactoseFree === true) {
      lacFree.push({ name: item.name, price: item.price });
    }
    if (item.glutenFree === true) {
      gluFree.push({ name: item.name, price: item.price });
    }
  })

  let final = { glutenFree: gluFree, lactoseFree: lacFree, lactoseAndGlutenFree: bothFree };

  console.log(JSON.stringify(final, null, 2));
  return JSON.stringify(final, null, 2);
}

function actualProfit(data) {
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

function focusOnOne(data) {
  let allRecipe = data.recipes;
  let inventory = data.inventory;
  let final = [];

  for (let i = 0; i < allRecipe.length; i++) {
    let recepieIngrArr = [];
    for (let o = 0; o < allRecipe[i].ingredients.length; o++) {
      for (let u = 0; u < inventory.length; u++) {
        if (allRecipe[i].ingredients[o].name === inventory[u].name) {
          let amount = parseInt(inventory[u].amount);
          let ingrAmount = allRecipe[i].ingredients[o].amount.indexOf(' pc') > -1
            ? parseInt(allRecipe[i].ingredients[o].amount)
            : parseInt(allRecipe[i].ingredients[o].amount) / 1000;

          let obj = {};
          obj.name = inventory[u].name;
          obj.result = Math.floor(amount / ingrAmount);

          recepieIngrArr.push(obj);
        }
      }
    }

    let minimum = recepieIngrArr.sort((a, b) => a.result - b.result)[0].result;

    let recipeObj = {};
    recipeObj.name = allRecipe[i].name;
    recipeObj.amount = minimum;

    final.push(recipeObj);
  }
  console.log(JSON.stringify(final.sort((a, b) => a.name.localeCompare(b.name)), null, 2));
  return JSON.stringify(final.sort((a, b) => a.name.localeCompare(b.name)), null, 2);
}

function maffia(data) {
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

function futureInventory(data) {
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

allProfit(bakeryData);
freeStuffs(bakeryData);
actualProfit(bakeryData);
focusOnOne(bakeryData);
maffia(bakeryData);
//futureInventory(bakeryData);