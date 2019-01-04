<template>
  <div>
    <section class="data-group">
      <h3>Review Lightning Payment</h3>
      <p>TO: {{ this.destination | truncate }}...</p>
      <p>INFO: {{ this.description }}</p>
      <p>{{ this.amount | btc }} BTC ({{ this.amount }} sats)</p>
      <a class="btn casa-button btn-block" @click="confirmPayment" name="button" :disabled="pending === true">
        <span v-if="!pending">Confirm Send</span> <span v-if="pending" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span v-if="pending">Sending</span>
      </a>
    </section>
    <section class="wallet-options">
      <p class="payment-info">{{ (this.chBalance - this.amount) | btc }}<span class="btc-heartbeat"> BTC</span></p>
      <p class="payment-details">New Lightning Balance</p>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: `LightningReview`,
  data() {
    return {
      expiry: '',
      amount: '',
      destination: '',
      description: '',
      chBalance: '',
      pending: false,
    };
  },
  async created() {
    const baseUrl = this.$store.state.settings.baseUrl;
    try {
      const { balance } = (await this.$http.get(`${baseUrl}:3002/v1/pages/lnd`)).data;
      this.chBalance = balance.channel.balance;
    } catch (err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err.response.data}`, position: 'top center' });
    }

    const invoice = this.$store.state.invoice;
    try {
      const paymentInfo = (await this.$http.get(`${baseUrl}:3002/v1/lnd/lightning/invoice?paymentRequest=${invoice}`)).data;
      this.expiry = paymentInfo.expiry;
      this.amount = paymentInfo.numSatoshis;
      this.destination = paymentInfo.destination;
      this.description = paymentInfo.description;
    } catch (err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err.response.data}`, position: 'top center' });
    }
  },
  methods: {
    async confirmPayment() {
      const baseUrl = this.$store.state.settings.baseUrl;
      this.pending = true;
      try {
        await this.$http.post(`${baseUrl}:3002/v1/lnd/lightning/payInvoice`, { paymentRequest: this.$store.state.invoice });
        this.$router.push({ path: '/lightning/pay/success' });
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
  margin: 1rem auto;
}

.wallet-options {
  background-color: #0a0525;
  padding: 4.25rem 1.5rem 6rem;
  margin-top: 4rem;
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
  -webkit-appearance: none;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  background-image: linear-gradient(to right, #5839f5, #9469fe);
  border: none;
}

.btn-outline {
  border: 3px solid white;
}

.btn-white {
  background: #fff;
  color: #000 !important;
}
</style>
