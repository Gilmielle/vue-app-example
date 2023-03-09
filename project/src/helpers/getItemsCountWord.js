
export default function getItemsCountWord(totalItems) {
  const lastDigit = String(totalItems).substring(String(totalItems).length - 1);
  if(totalItems === 1 || (totalItems > 20 && lastDigit === '1')) {
    return 'товар';
  } else if((totalItems > 1 && totalItems < 5) || (totalItems > 20 && lastDigit > 1 && lastDigit < 5)) {
    return 'товара'
  } else {
    return 'товаров'
  }
}
