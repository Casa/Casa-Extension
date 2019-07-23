<template>
  <div>
    <b-navbar>
      <img id="back-button" src="~assets/images/back.svg" class="d-inline-block align-top" alt="back" @click.prevent="$router.back()" />
      <h3 class="page-header">Request Lightning Payment</h3>
      <img id="forward-button" src="~assets/images/back.svg" />
    </b-navbar>
    <main class="popup-main">
      <section class="data-group">
        <b-form-group class="font-weight-bold currency-group" label="Amount">
          <div v-if="units === 'btc'">
            <div class="btc"><b-form-input id="currencyInput" @keyup.native="convertUSD" :value="btc"></b-form-input></div>
            <div class="usd"><b-form-input @keyup.native="convertBTC" :value="usd" placeholder="USD"></b-form-input></div>
          </div>
          <div v-else>
            <div class="sats"><b-form-input id="currencyInput" @keyup.native="convertUSD" :value="btc"></b-form-input></div>
            <div class="usd"><b-form-input @keyup.native="convertBTC" :value="usd"></b-form-input></div>
          </div>
        </b-form-group>
        <b-form-group class="font-weight-bold" label="Memo *optional"> <b-form-textarea :rows="3" v-model="memo"></b-form-textarea> </b-form-group>
        <a class="btn casa-button btn-block" @click="createRequest" name="button" :disabled="pending === true">
          <span v-if="!pending">Generate Payment Code</span> <span v-if="pending" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-if="pending">Generating</span>
        </a>
      </section>
      <section class="wallet-options">
        <p class="payment-info">{{ maxPaymentOut | units }}<units-badge /></p>
        <p class="payment-details">MAX OUTGOING PAYMENT</p>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'LightningRequest',
  data() {
    return {
      memo: '',
      btc: 0.0,
      sats: 0,
      usd: 0.0,
      exchangeRate: 0.0,
      units: '',
      btcSelected: true,
      pending: false,
      maxPaymentIn: '',
      maxPaymentOut: '',
    };
  },
  async created() {
    this.units = this.$store.state.settings.units;
    const baseUrl = this.$store.state.settings.baseUrl;

    try {
      const { channels } = (await this.$http.get(`${baseUrl}:3002/v1/pages/lnd`)).data;
      channels.forEach(channel => {
        const localBalance = parseInt(channel.localBalance) || 0;
        const remoteBalance = parseInt(channel.remoteBalance) || 0;
        if (channel.type === 'OPEN') {
          if (remoteBalance > this.maxPaymentIn) {
            this.maxPaymentIn = remoteBalance;
          }
          if (localBalance > this.maxPaymentOut) {
            this.maxPaymentOut = localBalance;
          }
        }
      });

      try {
        const { USD } = (await this.$http.get('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')).data;
        this.exchangeRate = USD;
      } catch (err) {
        this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `Error getting conversion rate`, position: 'top center' });
      }
    } catch (err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err.response.data}`, position: 'top center' });
    }
  },

  methods: {
    async createRequest() {
      this.pending = true;
      const baseUrl = this.$store.state.settings.baseUrl;
      const payload = { memo: this.memo };

      // format btc to sats
      if (this.units === 'btc') {
        payload.amt = parseInt(this.btc * 100000000);
      } else {
        payload.amt = parseInt(this.btc);
      }
      try {
        const payReq = await this.$http.post(`${baseUrl}:3002/v1/lnd/lightning/addInvoice`, payload);
        this.$store.dispatch('setPaymentRequest', payReq.data.paymentRequest);
        this.$router.push('/lightning/request/success');
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
          this.usd = ((value / 100000000) * this.exchangeRate).toFixed(5);
        }
      } else {
        this.usd = value;

        if (this.units === 'btc') {
          this.btc = (value / this.exchangeRate).toFixed(5);
        } else {
          this.btc = Math.floor((value / this.exchangeRate) * 100000000);
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

.ext-link {
  padding-top: 0.33em;
  padding-bottom: 0.33em;
  margin-top: 1rem;
  border-radius: 24px;
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
  display: block;
  margin: 2rem auto;
  width: 175px;
}

.wallet-options {
  background-color: #0a0525;
  padding: 2rem 1.5rem;
  margin-top: 2.5rem;
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
  margin-bottom: 0.8rem;
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
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  background-image: linear-gradient(to right, #5839f5, #9469fe);
  border: none;
  color: #fff;
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
