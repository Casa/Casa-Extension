<template>
  <div>
    <b-navbar>
      <img id="back-button" src="~assets/images/back.svg" class="d-inline-block align-top" alt="back" @click.prevent="$router.back()" />
      <h3 class="page-header">Review Lightning Payment</h3>
      <img id="forward-button" src="~assets/images/back.svg" />
    </b-navbar>
    <main class="popup-main">
      <section class="data-group">
        <p><span class="payment-badge">You're Paying</span></p>
        <p class="pay-to">{{ this.destination | truncate }}...</p>
        <p>{{ this.description }}</p>
        <hr />
        <b-form-group v-if="customInvoice" class="font-weight-bold currency-group" label="Custom Invoice Amount">
          <div v-if="units === 'btc'">
            <div class="btc"><b-form-input id="currencyInput" @keyup.native="convertUSD" :value="btc"></b-form-input></div>
            <div class="usd"><b-form-input @keyup.native="convertBTC" :value="usd" placeholder="USD"></b-form-input></div>
          </div>
          <div v-else>
            <div class="sats"><b-form-input id="currencyInput" @keyup.native="convertUSD" :value="btc"></b-form-input></div>
            <div class="usd"><b-form-input @keyup.native="convertBTC" :value="usd"></b-form-input></div>
          </div>
        </b-form-group>
        <div v-else>
          <p class="pay-amount">{{ this.amount | units }} <units-badge /></p>
          <p class="pay-fiat">{{ fiatValue }}</p>
        </div>
        <!-- Disable if amount is 0 or payment is pending -->
        <button class="btn casa-button btn-block" @click="confirmPayment" name="button" :disabled="pending === true || (customInvoice && btc === 0)">
          <span v-if="!pending">Confirm Send</span> <span v-if="pending" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-if="pending">Sending</span>
        </button>
      </section>
      <section class="wallet-options">
        <p class="payment-info">{{ (this.chBalance - this.amount) | units }} <units-badge /></p>
        <p class="payment-details">New Lightning Balance</p>
      </section>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import { satsToBtc, btcToSats } from '../../../helpers/units';

export default {
  name: `LightningReview`,
  data() {
    return {
      units: '',
      expiry: '',
      amount: '',
      fiatValue: '',
      destination: '',
      description: '',
      chBalance: '',
      pending: false,
      btc: 0.0,
      usd: 0.0,
      exchangeRate: 0.0,
      btcSelected: true,
      customInvoice: false,
    };
  },
  async created() {
    this.units = this.$store.state.settings.units;
    const baseUrl = this.$store.state.settings.baseUrl;
    const invoice = this.$store.state.invoice;

    try {
      const paymentInfo = (await this.$http.get(`${baseUrl}:3002/v1/lnd/lightning/invoice?paymentRequest=${invoice}`)).data;
      this.expiry = paymentInfo.expiry;
      this.destination = paymentInfo.destination;
      this.description = paymentInfo.description;
      this.amount = paymentInfo.numSatoshis;
      if (this.amount === '0') {
        this.customInvoice = true;
      }
    } catch (err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err.response.data}`, position: 'top center' });
    }

    try {
      const { balance } = (await this.$http.get(`${baseUrl}:3002/v1/pages/lnd`)).data;
      this.chBalance = balance.channel.balance;
    } catch (err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err.response.data}`, position: 'top center' });
    }

    try {
      const { USD } = (await this.$http.get('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')).data;
      let fiatVal = (satsToBtc(this.amount) * USD).toFixed(4);
      if (fiatVal.match(/\./)) {
        fiatVal = fiatVal.replace(/\.?0+$/, ''); // trim trailing zeros
      }
      this.fiatValue = `$${fiatVal}`;
      this.exchangeRate = USD;
    } catch (err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `Error getting conversion rate`, position: 'top center' });
    }
  },
  methods: {
    async confirmPayment() {
      const baseUrl = this.$store.state.settings.baseUrl;
      const payload = { paymentRequest: this.$store.state.invoice };
      this.pending = true;

      // ensure value set for zero sat invoices
      if (this.amount === '0') {
        // convert to sats
        if (this.units === 'btc') {
          payload.amt = btcToSats(this.btc);
        } else {
          payload.amt = this.btc;
        }
      }

      try {
        await this.$http.post(`${baseUrl}:3002/v1/lnd/lightning/payInvoice`, payload);
        this.$router.push({ path: '/lightning/pay/success' });
      } catch (err) {
        this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err.response.data}`, position: 'top center' });
      } finally {
        this.pending = false;
      }
    },

    convertUSD(e, rate) {
      this.btcSelected = true;
      this.calculate(e, rate);
    },

    convertBTC(e, rate) {
      this.btcSelected = false;
      this.calculate(e, rate);
    },

    calculate(e, value) {
      var value = parseFloat(e.target.value);
      if (isNaN(value)) {
        this.btc = '';
        this.usd = '';
        return;
      }

      if (this.btcSelected) {
        this.btc = value;
        if (this.units === 'btc') {
          this.usd = (value * this.exchangeRate).toFixed(2);
        } else {
          this.usd = (satsToBtc(value) * this.exchangeRate).toFixed(5);
        }
      } else {
        this.usd = value;
        if (this.units === 'btc') {
          this.btc = (value / this.exchangeRate).toFixed(5);
        } else {
          this.btc = btcToSats(value / this.exchangeRate);
        }
      }
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

.data-group {
  border: none;
  margin-top: 2rem;
  min-height: 350px;

  textarea {
    background-color: rgba(255, 255, 255, 0.03);
  }

  hr {
    border: 1px solid #fff;
    opacity: 0.1;
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

  .pay-to {
    font-size: 22px;
    font-weight: bold;
  }

  .pay-amount {
    letter-spacing: -0.9px;
    font-size: 36px;
  }

  .pay-fiat {
    letter-spacing: -0.5px;
    font-size: 20px;
    margin-top: -10px;
    margin-bottom: 10px;
  }
}

.wallet-options {
  background-color: #0a0525;
  padding: 3rem 1.5rem 3rem;
  p {
    text-align: center;
  }
}

.wallet-options > a.ext-link > img {
  max-height: 11px !important;
  margin-left: 10px !important;
  margin-top: -2px !important;
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

.payment-info {
  font-size: 24px;
  margin-bottom: 0.8rem;

  span {
    font-size: 12px;
    font-weight: bold;
  }
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
  margin-top: 1rem;
  margin-bottom: 0.25rem;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  background-image: linear-gradient(to right, #5839f5, #9469fe);
  -webkit-appearance: none;
  text-decoration: none !important;
  border: none;
}

#back-button {
  cursor: pointer;
}

#forward-button {
  visibility: hidden;
}

.currency-group {
  margin-bottom: 0;
  margin-top: -0.5em;
}
</style>
