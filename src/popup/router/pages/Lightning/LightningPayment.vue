<template>
  <div>
    <section class="data-group">
      <h3>Send Lightning Payment</h3>
      <b-form-group label="Enter Payment Code"> <b-form-textarea :rows="3" v-model="invoice"></b-form-textarea> </b-form-group>
      <a class="btn casa-button btn-block" name="button" @click="submitPayment">Review Payment</a>
    </section>
    <section class="wallet-options">
      <p class="payment-info">{{ maxPaymentOut | btc }}<span class="btc-heartbeat"> BTC</span></p>
      <p class="payment-details">MAX OUTGOING PAYMENT</p>
      <button-link to="/bitcoin/deposit">Add Funds</button-link>
      <button-link to="/lightning/channels/new">Create New Channel</button-link>
      <a class="btn ext-link" :href="baseUrl" target="_blank" rel="noopener"> <strong>View Existing Channels</strong> <img src="~assets/images/chevron.svg" /> </a>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'LightningPayment',
  data() {
    return {
      baseUrl: '',
      invoice: '',
      maxPaymentIn: '',
      maxPaymentOut: '',
    };
  },
  async created() {
    this.baseUrl = this.$store.state.settings.baseUrl;
    try {
      const lightning = await this.$http.get(`${this.baseUrl}:3002/v1/pages/lnd`);
      const { channels } = lightning.data;
      // Loop through channels to max payment amount, and sort channels by type
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
    } catch (err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err.response.data}`, position: 'top center' });
    }
  },
  methods: {
    submitPayment() {
      this.$store.dispatch('setInvoice', this.invoice);
      this.$router.push('/lightning/pay/review');
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
  max-width: 290px;
}

.wallet-options {
  background-color: #0a0525;
  padding: 1rem 1.5rem 2rem;
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
