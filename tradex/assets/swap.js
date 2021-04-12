const app = new Vue({
  el: "#app",
  data () {
    return {
      prices: null,
      portofolioChanged: 0,
      results: {},
      tokens: ["bgov", "pancaketools", "vancat"],
      amounts: [ 66.53, 80.67042621, 88758490 ]
    }
  },
  methods: {
    fetchPrices () {
      return fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${this.tokens.join(',')}&vs_currencies=idr&include_24hr_change=true`).then(res => res.json())
    },
    toPercentage (changed) {
      if (!changed) return 0;
      
      return changed.toFixed(2);
    }
  },
  async mounted () {
    let total = 0;

    const prices = await this.fetchPrices();
    
    let lastTotalAmount = window.localStorage.getItem("last_total_amount");

    this.prices = prices;
    this.tokens.forEach((token, index) => {
      const price = prices[token]["idr"];
      const totalPrice = this.amounts[index] * price;

      this.results[token] = { idr: price, amount: this.amounts[index], total: "Rp. " + (totalPrice).toFixed(0) }

      total += totalPrice;
    })

    if (!lastTotalAmount) {
      lastTotalAmount = total;
    }

    this.results.total = "Rp. " + total.toFixed(0);
    this.results.totalChanged = ((total - lastTotalAmount) / lastTotalAmount * 100).toFixed(2) + "%";

    window.localStorage.setItem("last_total_amount", total);
  }
})
