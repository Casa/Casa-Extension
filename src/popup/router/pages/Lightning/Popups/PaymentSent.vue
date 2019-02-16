<template>
  <div class="overlay container h-100">
    <div class="overlay_inner">
      <div class="overlay-message">
        <img src="~assets/images/check-success.svg" alt="success" />
        <h4 class="text-center">Lightning Payment Sent</h4>
        <h2 class="text-center">{{ this.amount | units }} <units-badge /></h2>
      </div>
      <div class="overlay-buttons"><a class="btn casa-button btn-white btn-block" name="button" href="#" @click="closeWindow">Done</a></div>
    </div>
  </div>
</template>

<script>
export default {
  name: `PopupLightningPaymentSent`,
  data() {
    return {
      amount: '',
      invoice: '',
    };
  },
  async created() {
    const baseUrl = this.$store.state.settings.baseUrl;
    this.invoice = localStorage.getItem('invoice');

    try {
      const paymentInfo = (await this.$http.get(`${baseUrl}:3002/v1/lnd/lightning/invoice?paymentRequest=${this.invoice}`)).data;
      this.amount = paymentInfo.numSatoshis;
    } catch (err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err.response.data}`, position: 'top center' });
    }
  },
  methods: {
    closeWindow() {
      window.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.overlay * {
  color: #fff;
}
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: scroll;
  background: #fff;
  z-index: 9999;
  background-image: linear-gradient(to right, #5839f5, #9469fe);

  &_inner {
    position: relative;
    max-width: 42em;
    margin-right: auto;
    margin-left: auto;
    padding: 1em;
  }
}

.overlay-message {
  margin-top: 10vh;
  top: 2rem;
}

.overlay-message img {
  display: block;
  width: 50px;
  margin: 0 auto 1rem;
}

.overlay-message h4 {
  font-size: 1.1rem;
}

.overlay-buttons {
  margin-top: 30vh;
}

.casa-button {
  padding: 1rem;
  margin: 2px;
  text-decoration: none !important;
  -webkit-appearance: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
  background: transparent;
}

.btn-outline {
  border: 3px solid white;
}

.btn-white {
  background: #fff;
  color: #000 !important;
}

a.btn.casa-button.btn-outline.btn-block {
  margin-bottom: 1rem;
}

.heartbeat {
  font-size: 16px;
}

.btc-heartbeat:before {
  background-color: #fff !important;
}
</style>
