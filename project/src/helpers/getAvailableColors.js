
export default function getAvailableColors(product) {
  return product.colors.filter(color => {
    return product.offers.some(offer => {
      return offer.propValues['0'].value.replaceAll('ё', 'е') === color.color.title.replaceAll('ё', 'е');
    });
  })
}
