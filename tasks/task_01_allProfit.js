const allProfit = (data) => {
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

module.exports = allProfit;