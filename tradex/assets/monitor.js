Vue.use(VueTippy);
Vue.component("tippy", VueTippy.TippyComponent);

function debounce(func, wait, immediate) {
	let timeout;
	return function() {
		const context = this;
    const args = arguments;

		let later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		let callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

var app = new Vue({
  el: "#app",
  data: {
    states: ["StrongSell", "Sell", "Neutral", "Buy", "StrongBuy"],
    search: "btc",
    debounce: null,
    filtered: [],
    widgets: [],
    summaries: {},
    prevWidgets: {},
    currentPage: 1,
    itemsPerPage: 6,
    resultCount: 0
  },
  mounted() {
    this.filtered = this.states;

    // this.subscribeRealtimeData();

    this.semiRealtime();
  },
  methods: {
    async semiRealtime () {
      while (true) {
        await this.fetchData();
        await this.delay(1000);
      }
    },
    debounceSearch: debounce(function (event) {
      if (event && event.target) {
        this.search = event.target.value;
      }
    }, 500),
    calc(price) {
      const percent = (
        ((Number(price.last) - Number(price.last_24)) / Number(price.last)) *
        100
      ).toFixed(2);
      const indicator = percent < 0 ? `↘` : `↗`;
      const indicatorClass = percent < 0 ? `text-red-500` : `text-green-500`;

      return `<span class="${indicatorClass}">${indicator} ${percent}%</span>`;
    },
    async fetchData() {
      try {
        const res = await fetch("https://tradex.nyandev.id/api/calculation");
        const { data } = await res.json();

        this.updateWidget(data);
      } catch (err) {
        return `Fetch Error: ${err}`;
      }
    },
    subscribeRealtimeData() {
      const client = mqtt.connect(`ws://broker.hivemq.com:8000/mqtt`, {
        debug: true
      });

      client.subscribe("tradex/pair/#");
      client.on("message", (topic, message) => {
        if (topic.startsWith("tradex/pair/")) {
          const pair = topic.split("/")[2];

          const data = JSON.parse(message);
          const widgets = JSON.parse(JSON.stringify(this.widgets))
          
          const updated = widgets.map(widget => {
            if (widget.pair == data.pair && data.pair == pair) {
              return {
                ...widget,
                ...data
              }
            }

            return widget
          })

          this.updateWidget(updated);
        }
      });
    },
    updateWidget(data) {
      console.info(`Widget Updated!`);

      for (const widget of this.widgets) {
        this.prevWidgets[widget.pair] = widget._meta_.state;
      }

      const widgets = data.map((item) => {
        this.summaries[item.pair] = item.price;

        const state = this.states[item.calculation.result[0]];

        if (!this.prevWidgets[item.pair]) {
          this.prevWidgets[item.pair] = state;
        }

        return {
          ...item,
          _meta_: {
            state,
          },
        };
      });

      this.widgets = Object.freeze(widgets);

      this.$nextTick(() => {
        for (const widget of widgets) {
          if (this.prevWidgets[widget.pair] === widget._meta_.state) {
            const arrow = document.getElementById(
              `arrow-element-${widget.pair}`
            );
            if (arrow && arrow.classList.length > 1) {
              continue;
            }
          }

          const arrow = document.getElementById(`arrow-element-${widget.pair}`);

          if (arrow) {
            const prevState = this.prevWidgets[widget.pair];

            arrow.classList.remove(`arrow${prevState}Shudder`);
            void arrow.offsetWidth;
            if (arrow.classList.length > 1) {
              arrow.classList.replace(
                `arrowTo${prevState}`,
                `arrowTo${widget._meta_.state}`
              );
            } else {
              arrow.classList.add(`arrowTo${widget._meta_.state}`);
            }
            setTimeout(() => {
              arrow.classList.add(`arrow${widget._meta_.state}Shudder`);
            }, 1700);
          }
        }
      });
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
      return new Date(timestamp).toLocaleString();
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
    toggleTest() {
      const pair = `btcidr`;
      const arrow = document.getElementById(`arrow-element-${pair}`);

      if (arrow) {
        const classes = arrow.classList.value
          .replace("arrow", "")
          .trim()
          .split(" ");

        if (classes.includes("arrowStrongSellShudder")) {
          arrow.classList.remove(`arrowStrongSellShudder`);
          void arrow.offsetWidth;
          arrow.classList.replace(`arrowToStrongSell`, `arrowToStrongBuy`);
          setTimeout(() => {
            arrow.classList.add(`arrowStrongBuyShudder`);
          }, 1700);
        } else {
          arrow.classList.remove(`arrowStrongBuyShudder`);
          void arrow.offsetWidth;
          arrow.classList.replace(`arrowToStrongBuy`, `arrowToStrongSell`);
          setTimeout(() => {
            arrow.classList.add(`arrowStrongSellShudder`);
          }, 1700);
        }
      }
    },
    setPage: function(pageNumber) {
      this.currentPage = pageNumber
    },
    delay (ms) {
      return new Promise(res => setTimeout(res, ms))
    }
  },
  computed: {
    totalPages: function() {
      return Math.ceil(this.resultCount / this.itemsPerPage)
    },
    filteredWidget() {
      if (!this.widgets || this.widgets.length != this.widgets.length) {
        return [];
      }

      const widgets = this.widgets
        .filter((item) => {
          if (this.search.includes(',')) {
            const searchs = this.search.split(',');

            let found = false;

            for (const search of searchs) {
              if (search == "") break;

              if ((item.pair.includes(search) && this.filtered.includes(item._meta_.state))) {
                found = true;
              }
            }

            return found;
          } else {
            return (item.pair.includes(this.search) && this.filtered.includes(item._meta_.state));
          }
        });

      this.resultCount = widgets.length;

      if (this.currentPage >= this.totalPages) {
        this.currentPage = this.totalPages;
      }

      if (this.totalPages > 0 && this.currentPage == 0) {
        this.currentPage = 1;
      }

      const index = this.currentPage * this.itemsPerPage - this.itemsPerPage
      return widgets.slice(index, index + this.itemsPerPage)
    }
  }
});
