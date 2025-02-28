import productList from "./products.json"

const products: Product[] = [...productList]

type Product = {
  id: string
  guid: string
  in_stock: boolean
  on_sale: boolean
  name: string
  picture: string
  gender: string
  categories: string[]
  color: string
  price: string
  description: string
}

/**
 * Handles converting currency as a string to a number.
 * @param currencyString The currency as a string.
 * @returns a number.
 */
function convertCurrencyToNumber(currency: string) {
  // To be honest, I've used the Intl.NumberFormat API before, but only to convert to currency,
  // not the other way around. So I had to use Google to help me get this function.
  const numberFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
  const parts = numberFormat.formatToParts(Number(0))
  const decimalSeparator = parts.find((part) => part.type === "decimal")?.value

  let normalizedString = currency.replace(
    new RegExp(`[^\\d${decimalSeparator || "."}-]`, "g"),
    ""
  )

  if (decimalSeparator && decimalSeparator !== ".") {
    normalizedString = normalizedString.replace(decimalSeparator, ".")
  }

  return parseFloat(normalizedString)
}

/**
 * Converts a number to a currency format.
 * @param number The number to be converted.
 * @returns a number in currency format.
 */
function convertToCurrency(number: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number)
}

/**
 * Returns all products filtered by color
 * @param arr The array of products to use.
 * @param color The color to filter by.
 * @returns a transformed array of products filtered by color.
 */
function getProductsByColor(arr: Product[], color: string) {
  return arr.filter((item) => item.color === color).map((item) => item.name)
}

// Which products are out of stock, not on sale, and under $20?
function questionOne() {
  return products.filter(
    (p) => !p.in_stock && p.on_sale && convertCurrencyToNumber(p.price)! < 20
  )
}

// What is the most commonly used category?
function questionTwo() {
  const categories: Record<string, number> = {}

  products.forEach((product) => {
    product.categories.forEach((category) => {
      if (!categories[category]) {
        categories[category] = 1
      } else {
        categories[category] += 1
      }
    })
  })

  return Object.keys(categories).reduce((a, b) =>
    categories[a] > categories[b] ? a : b
  )
}

// What is the average price of sale items?
function questionThree() {
  const avg =
    products.reduce((a, b) => a + convertCurrencyToNumber(b.price), 0) /
    products.length

  return convertToCurrency(avg)
}

// How many women’s products are out of stock, broken down by color?
function questionFour() {
  const productMap = new Map()

  const womenProducts = products.filter(
    (p) => p.gender === "female" && !p.in_stock
  )

  products.forEach((p) => {
    if (!productMap.get(p.color)) {
      productMap.set(p.color, getProductsByColor(womenProducts, p.color).length)
    }
  })

  return productMap
}

console.log("Question one: ", questionOne())
console.log("Question two: ", questionTwo())
console.log("Question three: ", questionThree())
console.log("Question four: ", questionFour())
