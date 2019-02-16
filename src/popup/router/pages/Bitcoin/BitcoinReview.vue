<template>
  <div>
    <b-navbar>
      <img id="back-button" src="~assets/images/back.svg" class="d-inline-block align-top" alt="back" @click.prevent="$router.back()" />
      <h3 class="page-header">Review Bitcoin Withdrawal</h3>
      <img id="forward-button" src="~assets/images/back.svg" />
    </b-navbar>
    <main class="popup-main">
      <section class="data-group">
        <p><span class="payment-badge">You're Sending</span></p>
        <span class="destination">{{ transaction.addr }}</span> <br />
        <p class="payment-info">{{ transaction.amt | units }} <units-badge /></p>
        <span class="payment-fiat">{{ satsToUsd() }}</span> <br />
        <a class="btn casa-button btn-block" @click="sendPayment" name="button" :disabled="pending === true">
          <span v-if="!pending">Confirm Withdrawal</span> <span v-if="pending" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-if="pending">Sending</span>
        </a>
      </section>
      <section class="wallet-options">
        <p class="payment-info">{{ this.remainingBalance | units }} <units-badge /></p>
        <p class="payment-details">NEW BITCOIN NODE BALANCE</p>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: `BitcoinReview`,
  data() {
    return {
      rate: '',
      units: '',
      remainingBalance: '',
      pending: false,
    };
  },
  async created() {
    const baseUrl = this.$store.state.settings.baseUrl;
    this.units = this.$store.state.settings.units;
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
      const payload = { addr: this.transaction.addr, amt: this.transaction.amt };
      // funds are always sent as sats
      try {
        const tx = await this.$http.post(`${baseUrl}:3002/v1/lnd/transaction`, payload);
        this.$router.push({ path: '/bitcoin/send/success' });
      } catch (err) {
        this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err.response.data}`, position: 'top center' });
      } finally {
        this.pending = false;
      }
    },
    satsToUsd() {
      let usd = ((parseInt(this.transaction.amt) / 100000000) * this.rate).toFixed(2);
      if (isNaN(usd)) {
        return 0;
      }
      return '$' + usd;
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
.navbar {
  background-color: #160c46;
}

.popup-main {
  color: #fff !important;
  background-color: #160c46;
  padding-top: 0;
  padding-bottom: 0;
}

.page-header {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-top: 0.75rem;
}

.header-text {
  margin-bottom: 1rem;
}

.destination {
  display: inherit;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.payment-fiat {
  display: inherit;
  font-size: 17px;
}

p {
  text-align: center;

  .payment-badge {
    border-radius: 15px;
    background-color: #0a0525;
    margin: 0 auto;
    padding: 7px 10px;
    text-transform: uppercase;
    letter-spacing: 1.25px;
    font-size: 15px;
    font-weight: bold;
  }
}

.wallet-options {
  background-color: #0a0525;
  padding: 4rem 1.5rem 6rem;
  margin-top: 2rem;
}

.wallet-options p {
  text-align: center;
}

.data-group {
  border: none;
  padding-top: 2rem;
}

.data-group * {
  text-align: center;
}

.payment-info {
  font-size: 24px;
  margin: 0 0 1rem;
}

.payment-info span {
  font-size: 14px;
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
  text-decoration: none !important;
  -webkit-appearance: none;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  background-image: linear-gradient(to right, #5839f5, #9469fe);
  border: none;
  margin-top: 2rem;
}

.btn-outline {
  border: 3px solid white;
}

.btn-white {
  background: #fff;
  color: #000 !important;
}

#forward-button {
  visibility: hidden;
}
</style>
