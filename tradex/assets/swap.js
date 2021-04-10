const app = new Vue({
  el: "#app",
  data () {
    return {
      prices: null,
      results: {},
      tokens: ["bgov", "pancaketools", "vancat"],
      amounts: [ 65.03, 50.67042621, 43200400 ]
    }
  },
  methods: {
    fetchPrices () {
      return fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${this.tokens.join(',')}&vs_currencies=idr&include_24hr_change=true`).then(res => res.json())
    }
  },
  async mounted () {
    let total = 0;

    const prices = await this.fetchPrices();

    this.prices = prices;
    this.tokens.forEach((token, index) => {
      const price = prices[token]["idr"];
      const totalPrice = this.amounts[index] * price;

      this.results[token] = { idr: price, amount: this.amounts[index], total: "Rp. " + (totalPrice).toFixed(0) }

      total += totalPrice;
    })

    this.results.total = "Rp. " + total.toFixed(0)
  }
})
