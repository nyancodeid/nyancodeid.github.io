Vue.component('widget', {
  props: ['widget', 'price'],
  methods: {
    calc(price) {
      const percent = (
        ((Number(price.last) - Number(price.last_24)) / Number(price.last)) *
        100
      ).toFixed(2);
      const indicator = percent < 0 ? `↘` : `↗`;
      const indicatorClass = percent < 0 ? `text-red-500` : `text-green-500`;

      return `<span class="${indicatorClass}">${indicator} ${percent}%</span>`;
    },
    toIndicator([sell, buy]) {
      if (sell >= 50) {
        if (sell <= 55) return "Neutral";
        if (sell <= 77.5) return "Sell";
        if (sell <= 100) return "Strong Sell";
      }

      if (buy >= 50) {
        if (buy <= 55) return "Neutral";
        if (buy <= 77.5) return "Buy";
        if (buy <= 100) return "Strong Buy";
      }
    },
    toIndicatorSort([sell, buy]) {
      if (sell >= 50) {
        if (sell <= 55) return "Neutral";
        if (sell <= 77.5) return "Sell";
        if (sell <= 100) return "Strong Sell";
      }

      if (buy >= 50) {
        if (buy <= 55) return "Neutral";
        if (buy <= 77.5) return "Buy";
        if (buy <= 100) return "Strong Buy";
      }
    },
    toDecimalReadable(pair, number) {
      if (!pair.endsWith("usdt")) {
        if (pair.endsWith("idr")) {
          let reverse = String(number).split("").reverse().join("");
          let ribuan = reverse.match(/\d{1,3}/g);

          ribuan = ribuan.join(".").split("").reverse().join("");

          return ribuan;
        }

        return number;
      }

      const [rill, decimal] = String(number).split(".");

      if (!decimal) {
        return number;
      } else if (rill.length >= 3) {
        return `${rill}.${decimal.slice(0, 3)}`;
      } else if (rill.length == 1 && decimal > 4) {
        return `${rill}.${decimal.slice(0, 8)}`;
      } else {
        return number;
      }
    },
    toDate(timestamp) {
      return new Date(timestamp).toLocaleString('id-ID');
    },
    stateTitle(state) {
      if (state == "StrongSell") return "Strong Sell";
      if (state == "StrongBuy") return "Strong Buy";

      return state;
    },
    stateTitleClass(state) {
      if (state.includes("Sell")) return "redColor";
      if (state == "Neutral") return "neutralColor";
      if (state.includes("Buy")) return "brandColor";
    },
  },
  template: '#widget-layout'
})