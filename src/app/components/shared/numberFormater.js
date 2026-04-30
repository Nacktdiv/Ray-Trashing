const NumberFormater = (number) => {
    return formaterNumber = new Intl.NumberFormat('id-ID').format(number)
}

const PriceFormater = (number) => {
    return formaterNumber = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number)
}
module.exports = {NumberFormater, PriceFormater}