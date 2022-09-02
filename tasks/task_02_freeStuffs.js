const freeStuffs = (data) => {
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

module.exports = freeStuffs;