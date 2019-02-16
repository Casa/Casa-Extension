<template>
  <div>
    <b-navbar>
      <img id="back-button" src="~assets/images/back.svg" class="d-inline-block align-top" alt="back" @click.prevent="$router.back()" />
      <h3 class="page-header">Withdraw Bitcoin</h3>
      <img id="forward-button" src="~assets/images/back.svg" />
    </b-navbar>
    <main class="popup-main">
      <section class="data-group">
        <b-form-group class="font-weight-bold" label="Recipient BTC Address"> <b-form-input v-model="address"></b-form-input> </b-form-group>
        <b-form-group class="font-weight-bold currency-group" label="Amount">
          <div v-if="units === 'btc'">
            <div class="btc"><b-form-input class="btc" v-model="amount.btc" placeholder="BTC" required></b-form-input></div>
            <div class="usd"><b-form-input class="usd" :value="btcToUsd()" placeholder="USD"></b-form-input></div>
          </div>
          <div v-else>
            <div class="sats"><b-form-input class="sats" v-model="amount.sats" placeholder="SATS" required></b-form-input></div>
            <div class="usd"><b-form-input class="usd" :value="satsToUsd()" placeholder="USD"></b-form-input></div>
          </div>
        </b-form-group>
        <a @click="sendPayment" class="btn casa-button btn-block" name="button">Review Withdrawal</a>
      </section>
      <section class="wallet-options">
        <content-loader v-if="loading" :height="40" :width="400" :speed="2" primaryColor="#160c46" secondaryColor="#a29bbc">
          <rect x="93.59" y="107.61" rx="5" ry="5" width="220" height="16.5" /> <rect x="115.72" y="7.61" rx="5" ry="5" width="169.51" height="26.71" />
          <rect x="79.44" y="145" rx="5" ry="5" width="249.48" height="18.42" /> <rect x="125.44" y="83.61" rx="5" ry="5" width="147.4" height="18.27" />
          <circle cx="346.23" cy="90.61" r="1" />
        </content-loader>
        <p v-else class="payment-info">{{ btcBalance | units }} <units-badge /></p>
        <p class="payment-details">BITCOIN NODE BALANCE</p>
      </section>
    </main>
  </div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader';

export default {
  name: `BitcoinPayment`,
  components: {
    ContentLoader,
  },

  data() {
    return {
      address: '',
      btcBalance: '',
      chBalance: '',
      amount: {
        sats: 0,
        btc: 0,
        usd: 0,
      },
      units: '',
      loading: true,
    };
  },

  async created() {
    this.units = this.$store.state.settings.units;
    try {
      const baseUrl = this.$store.state.settings.baseUrl;
      const { balance } = (await this.$http.get(`${baseUrl}:3002/v1/pages/lnd`)).data;
      this.btcBalance = balance.wallet.totalBalance;
      this.chBalance = balance.channel.balance;
    } catch (err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err.response.data}`, position: 'top center' });
    } finally {
      this.loading = false;
    }

    try {
      const { USD } = (await this.$http.get('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')).data;
      this.amount.usd = USD;
    } catch (err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `Error getting conversion rate`, position: 'top center' });
    }
  },

  methods: {
    async sendPayment() {
      const payload = { addr: this.address, amt: this.amount.sats };
      if (this.units === 'btc') {
        payload.amt = this.amount.btc * 100000000;
      }
      this.$store.dispatch('setSendCoinsRequest', payload);
      this.$router.push('/bitcoin/send/review');
    },
    btcToUsd() {
      let usd = (this.amount.btc * this.amount.usd).toFixed(2);
      if (isNaN(usd)) {
        return 0;
      }
      return usd;
    },
    satsToUsd() {
      let usd = ((parseInt(this.amount.sats) / 100000000) * this.amount.usd).toFixed(2);
      if (isNaN(usd)) {
        return 0;
      }
      return usd;
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
  padding: 3rem 1.5rem 4rem;
  margin-top: 2rem;
}

.wallet-options svg {
  margin-bottom: 0.5rem;
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
  margin-bottom: 0.5rem;
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
  margin-bottom: 0.25rem;
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

#back-button {
  cursor: pointer;
}

#forward-button {
  visibility: hidden;
}
</style>
