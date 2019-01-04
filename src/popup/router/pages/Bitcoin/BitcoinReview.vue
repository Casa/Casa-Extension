<template>
  <div>
    <section class="data-group">
      <h3 class="header-text">Review Bitcoin Withdrawal</h3>
      <span class="destination">TO: {{ transaction.addr }}</span> <br />
      <p class="payment-info">{{ transaction.amt }} <span class="btc-heartbeat"> BTC</span></p>
      <span>{{ '$' + (transaction.amt * rate).toFixed(2) }}</span> <br />
      <a class="btn casa-button btn-block" @click="sendPayment" name="button" :disabled="pending === true">
        <span v-if="!pending">Confirm Withdrawal</span> <span v-if="pending" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span v-if="pending">Sending</span>
      </a>
    </section>
    <section class="wallet-options">
      <p class="payment-info">{{ this.remainingBalance | btc }} <span class="btc-heartbeat"> BTC</span></p>
      <p class="payment-details">NEW BITCOIN NODE BALANCE</p>
    </section>
  </div>
</template>

<script>
export default {
  name: `BitcoinReview`,
  data() {
    return {
      rate: '',
      remainingBalance: '',
      pending: false,
    };
  },
  async created() {
    const baseUrl = this.$store.state.settings.baseUrl;

    // Get lightning channel settings
    try {
      const { balance } = (await this.$http.get(`${baseUrl}:3002/v1/pages/lnd`)).data;
      this.remainingBalance = balance.wallet.totalBalance - parseInt(this.transaction.amt);
    } catch (err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err.response.data}`, position: 'top center' });
    }

    // Get BTC price
    try {
      const { USD } = (await this.$http.get('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')).data;
      this.rate = USD;
    } catch (err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: 'Error getting conversion rate.', position: 'top center' });
    }
  },
  methods: {
    async sendPayment() {
      this.pending = true;
      const baseUrl = this.$store.state.settings.baseUrl;
      const payload = { amt: Math.round(this.transaction.amt * 100000000), addr: this.transaction.addr };
      try {
        const tx = await this.$http.post(`${baseUrl}:3002/v1/lnd/transaction`, payload);
        this.$router.push({ path: '/bitcoin/send/success' });
      } catch (err) {
        this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err.response.data}`, position: 'top center' });
      } finally {
        this.pending = false;
      }
    },
  },
  computed: {
    transaction: {
      get() {
        return this.$store.state.newTransaction;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.header-text {
  margin-bottom: 1rem;
}

.destination {
  font-size: 15px;
}

.ext-link {
  padding-top: 0.33em;
  padding-bottom: 0.33em;
  margin-top: 1rem;
  border-radius: 24px;
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
  display: block;
  margin: 1rem auto;
}

.wallet-options {
  background-color: #0a0525;
  padding: 4rem 1.5rem 6rem;
  margin-top: 3rem;
}

.wallet-options > a.ext-link > img {
  max-height: 11px !important;
  margin-left: 10px !important;
  margin-top: -2px !important;
}

.wallet-options p {
  text-align: center;
}

.data-group {
  border: none;
}

.data-group textarea {
  background-color: rgba(255, 255, 255, 0.03);
}

.payment-info {
  font-size: 24px;
  margin: 1rem 0;
}

.payment-info span {
  font-size: 12px;
  font-weight: bold;
}

.payment-details {
  font-size: 13px;
  font-weight: 900;
  line-height: 1.3;
  letter-spacing: 1px;
  text-align: center;
  color: #a29bbc;
}

.casa-button {
  padding: 1rem;
  margin-left: -1px;
  text-decoration: none !important;
  -webkit-appearance: none;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  background-image: linear-gradient(to right, #5839f5, #9469fe);
  border: none;
  margin-top: 0.25rem;
}

.btn-outline {
  border: 3px solid white;
}

.btn-white {
  background: #fff;
  color: #000 !important;
}
</style>
