const focusOnOne = (data) => {
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

module.exports = focusOnOne;