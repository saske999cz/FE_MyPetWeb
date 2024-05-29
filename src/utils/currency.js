const currency = (price) => {
  return price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
} 

export default currency;