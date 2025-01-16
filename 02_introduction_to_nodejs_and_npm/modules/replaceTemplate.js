module.exports = (tempCard, ele) => {
  let output = tempCard.replace(/{%ID%}/g, ele.id);
  output = output.replace(/{%PRODUCTNAME%}/g, ele.productName);
  output = output.replace(/{%PRICE%}/g, ele.price);
  output = output.replace(/{%IMAGE%}/g, ele.image);
  output = output.replace(/{%QUANTITY%}/g, ele.quantity);
  output = output.replace(/{%NUTRIENTS%}/g, ele.nutrients);
  output = output.replace(/{%LOCATION%}/g, ele.from);
  output = output.replace(/{%DESCRIPTION%}/g, ele.description);

  if (!ele.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  } else {
    output = output.replace(/{%NOT_ORGANIC%}/g, "");
  }

  return output;
};
