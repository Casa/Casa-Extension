<template>
  <div class="overlay container h-100">
    <div class="overlay_inner">
      <div class="overlay-message">
        <img src="~assets/images/check-success.svg" alt="success" />
        <h4 class="text-center">Lightning Payment Sent</h4>
        <h2 class="text-center">{{ this.amount | btc }} <span class="heartbeat">BTC</span></h2>
      </div>
      <div class="overlay-buttons">
        <a class="btn casa-button btn-outline btn-block" name="button" @click.prevent="$router.push('/lightning/channels/new')">Open Channel</a>
        <a class="btn casa-button btn-white btn-block" name="button" href="#" aria-label="close" @click.prevent="$router.push('/lightning')">Done</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: `LightningPaymentSent`,
  data() {
    return {
      amount: '',
    };
  },
  async created() {
    const baseUrl = this.$store.state.settings.baseUrl;
    const invoice = this.$store.state.invoice;

    try {
      const paymentInfo = (await this.$http.get(`${baseUrl}:3002/v1/lnd/lightning/invoice?paymentRequest=${invoice}`)).data;
      this.amount = paymentInfo.numSatoshis;
    } catch (err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err.response.data}`, position: 'top center' });
    }
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
  content: '';
  margin-right: 5px;
  margin-left: 5px;
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: #fff;
  position: relative;
  top: 0;
}
</style>
