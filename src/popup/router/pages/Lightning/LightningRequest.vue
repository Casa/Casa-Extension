<template>
  <div>
    <section class="data-group">
      <h3>Request Lightning Payment</h3>
      <b-form-group class="font-weight-bold currency-group" label="Amount">
        <div class="btc"><b-form-input v-model="amount.btc" placeholder="BTC" required></b-form-input></div>
        <div class="usd"><b-form-input :value="(amount.btc * amount.usd).toFixed(2)" placeholder="USD" disabled></b-form-input></div>
      </b-form-group>
      <b-form-group class="font-weight-bold" label="Memo *optional"> <b-form-textarea :rows="3" v-model="memo"></b-form-textarea> </b-form-group>
      <a class="btn casa-button btn-block" @click="createRequest" name="button" :disabled="pending === true">
        <span v-if="!pending">Generate Payment Code</span> <span v-if="pending" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span v-if="pending">Generating</span>
      </a>
    </section>

    <section class="wallet-options">
      <p class="payment-info">{{ maxPaymentOut | btc }}<span class="btc-heartbeat"> BTC</span></p>
      <p class="payment-details">MAX OUTGOING PAYMENT</p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'LightningRequest',
  data() {
    return {
      memo: '',
      amount: {
        btc: 0,
        usd: 0,
      },
      pending: false,
      maxPaymentIn: '',
      maxPaymentOut: '',
    };
  },
  async created() {
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
        this.amount.usd = USD;
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
      const payload = { amt: this.amount.btc * 100000000, memo: this.memo };

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
  },
};
</script>

<style lang="scss" scoped>
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
  margin-top: 1rem;
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
</style>
