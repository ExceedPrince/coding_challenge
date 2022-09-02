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
}


function actualProfit(data) {
  //set all starting data
  let onlySales = allProfit(data);

  let salesArr = data.salesOfLastWeek;
  let salesNames = data.salesOfLastWeek.map(name => name.name)
  let usablesArr = data.recipes.filter(food => salesNames.indexOf(food.name) > -1);

  salesArr = salesArr.sort((a, b) => a.name.localeCompare(b.name));
  usablesArr = usablesArr.sort((a, b) => a.name.localeCompare(b.name));

  let multipliedRecepies = [];

  //collecting multiplied amounts
  for (let i = 0; i < salesArr.length; i++) {
    let multIngs = [];

    for (let o = 0; o < usablesArr[i].ingredients.length; o++) {
      let obj = { name: '', multAmount: 0 };

      if (usablesArr[i].ingredients[o].amount.indexOf(" pc") > -1) {
        obj.name = usablesArr[i].ingredients[o].name;
        obj.multAmount = salesArr[i].amount * parseInt(usablesArr[i].ingredients[o].amount);
      } else {
        obj.name = usablesArr[i].ingredients[o].name;
        obj.multAmount = salesArr[i].amount * (parseInt(usablesArr[i].ingredients[o].amount) / 1000);
      }

      multIngs.push(obj);
    }
    let recipeName = salesArr[i].name;
    let recipeObj = {};
    recipeObj.name = recipeName;
    recipeObj.ingredients = multIngs;

    multipliedRecepies.push(recipeObj);
  }

  //Sum all ingredients among recipes
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

  for (let u = 0; u < multipliedRecepies.length; u++) {
    for (let a = 0; a < multipliedRecepies[u].ingredients.length; a++) {
      for (let b = 0; b < summedIngredients.length; b++) {
        if (summedIngredients[b].name === multipliedRecepies[u].ingredients[a].name) {
          summedIngredients[b].amount += multipliedRecepies[u].ingredients[a].multAmount;
        }
      }
    }
  }

  //Divide the summed amounts with their unit price
  let wholeSP = data.wholesalePrices;
  let dividedIngredients = summedIngredients.map((item, i) => ({ name: item.name, result: Math.ceil(item.amount / parseInt(wholeSP[i].amount)) }));

  //Multiply the price with the divided results and sum them
  let allPrice = dividedIngredients.map((el, index) => el.result * wholeSP[index].price)
    .reduce((a, b) => a + b);

  //calculate the final result
  console.log(onlySales - allPrice);
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
}


function maffia(data) {
  //Set the new data arr, the recipes arr and the wholesalePrices arr
  let request = [{ name: "Francia krémes", amount: 300 },
  { name: "Rákóczi túrós", amount: 200 },
  { name: "Képviselőfánk", amount: 300 },
  { name: "Isler", amount: 100 },
  { name: "Tiramisu", amount: 150 }].sort((a, b) => a.name.localeCompare(b.name));

  let recipes = data.recipes;
  let wholesalePrices = data.wholesalePrices;

  //filter out the unneeded products
  let filtered = recipes.filter(item => {
    for (let i = 0; i < request.length; i++) {
      if (item.name === request[i].name) {
        return item;
      }
    }
  }).sort((a, b) => a.name.localeCompare(b.name));

  //calculate the needed quantity of ingredient (of each recipe) based on maffia's amount
  let priceArr = [];

  for (let o = 0; o < filtered.length; o++) {
    let number = 0;

    for (let u = 0; u < filtered[o].ingredients.length; u++) {
      if (filtered[o].ingredients[u].amount.indexOf(' pc') > -1) {
        filtered[o].ingredients[u].amount = parseInt(filtered[o].ingredients[u].amount) * request[o].amount;
      } else {
        filtered[o].ingredients[u].amount = (parseInt(filtered[o].ingredients[u].amount) / 1000) * request[o].amount;
      }

      //divide the received quantity with the unit's amount, round it up
      wholesalePrices.forEach(item => {
        if (item.name === filtered[o].ingredients[u].name) {
          filtered[o].ingredients[u].result = Math.ceil(filtered[o].ingredients[u].amount / parseInt(item.amount));

          //multiply the divided amount with its price
          filtered[o].ingredients[u].multPrice = filtered[o].ingredients[u].result * item.price;
        }
      })
      number += filtered[o].ingredients[u].multPrice;
    }
    priceArr.push(number);
  }

  //sum the prices (=price of 1 product), than add all of them together
  console.log(priceArr.reduce((a, b) => a + b));
}


function futureInventory(data) {
  //set all existing array separately
  let recipes = data.recipes.sort((a, b) => a.name.localeCompare(b.name));
  let inventory = data.inventory;
  let salesOfLastWeek = data.salesOfLastWeek.sort((a, b) => a.name.localeCompare(b.name));
  let wholesalePrices = data.wholesalePrices;

  recipes = recipes.filter(item => {
    for (let i = 0; i < salesOfLastWeek.length; i++) {
      if (item.name === salesOfLastWeek[i].name) {
        return item;
      }
    }
  });

  //calculate the next 2 weeks sales
  let salesOfNext2Week = salesOfLastWeek.map(item => ({ name: item.name, amount: item.amount * 2 }));

  //multiply the recipes's ingredient's amount with the two weeks amount and convert them
  for (let o = 0; o < recipes.length; o++) {
    for (let u = 0; u < recipes[o].ingredients.length; u++) {
      if (recipes[o].ingredients[u].amount.indexOf(' pc') > -1) {
        recipes[o].ingredients[u].amount = parseInt(recipes[o].ingredients[u].amount) * salesOfNext2Week[o].amount;
      } else {
        recipes[o].ingredients[u].amount = (parseInt(recipes[o].ingredients[u].amount) / 1000) * salesOfNext2Week[o].amount;
      }
    }
  }

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

  for (let u = 0; u < recipes.length; u++) {
    for (let a = 0; a < recipes[u].ingredients.length; a++) {
      for (let b = 0; b < summedIngredients.length; b++) {
        if (summedIngredients[b].name === recipes[u].ingredients[a].name) {
          summedIngredients[b].amount += (recipes[u].ingredients[a].amount) * 1.1;
        }
      }
    }
  }

  //calc the difference between ingredients
  for (let c = 0; c < summedIngredients.length; c++) {
    summedIngredients[c].amount -= parseInt(inventory[c].amount);

    //divide the result of positive ingredients with their unit amount, round them up, then multiply them with their price
    summedIngredients[c].unitQuantity = Math.ceil(summedIngredients[c].amount / parseInt(wholesalePrices[c].amount));

    summedIngredients[c].price = summedIngredients[c].unitQuantity * wholesalePrices[c].price;

  }

  //put the name, the amount of difference and the receives price into an object, and put that into an array, sorted by price
  let finalArr = summedIngredients.map(elem => {
    let uniqueAmount = "";

    if (elem.name === "flour" || elem.name === "gluten-free flour" || elem.name === "sugar" || elem.name === "butter" || elem.name === "vanilin sugar" ||
      elem.name === "fruit" || elem.name === "chocolate") {
      uniqueAmount = " kg";
    } else if (elem.name === "milk" || elem.name === "soy-milk") {
      uniqueAmount = " l";
    } else {
      uniqueAmount = " pc";
    }

    let obj = { name: elem.name, amount: elem.amount.toFixed(2) + uniqueAmount, totalPrice: elem.price }
    return obj;
  })

  console.log(JSON.stringify(finalArr.filter(item => item.totalPrice > 0).sort((a, b) => b.totalPrice - a.totalPrice), null, 2));
}

//allProfit(bakeryData);
//freeStuffs(bakeryData);
//actualProfit(bakeryData);
//focusOnOne(bakeryData);
//maffia(bakeryData);
//futureInventory(bakeryData);
