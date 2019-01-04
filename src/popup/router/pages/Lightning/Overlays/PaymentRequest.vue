<template>
  <div class="overlay">
    <div class="overlay_inner">
      <h4>Lightning Request Generated</h4>
      <p class="details">You’ll need to send this code to the person you’re looking to receive a payment from.</p>
      <section class="copy-request">
        <p>{{ paymentRequest }}</p>
        <a type="button" class="btn casa-button" v-clipboard:copy="paymentRequest" v-clipboard:success="onCopy" v-clipboard:error="onError">
          <span v-if="!copied">Copy</span> <span v-else><img src="~assets/images/btn-check.svg" alt="check" /> Copied</span>
        </a>
      </section>
      <section class="qr-code">
        <br />
        <qr-code :text="paymentRequest" :size="150" error-level="L"></qr-code>
      </section>
      <a class="btn casa-button btn-block" href="#" aria-label="close" @click.prevent="$router.push('/lightning')">Done</a>
    </div>
  </div>
</template>

<script>
export default {
  name: `PaymentRequestSuccess`,
  data() {
    return {
      copied: false,
    };
  },
  methods: {
    onCopy: function(err) {
      this.copied = true;
    },
    onError: function(err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Copy Failed', text: 'Failed to copy address text.', position: 'top center' });
    },
  },
  computed: {
    paymentRequest: {
      get() {
        return this.$store.state.paymentRequest || '';
      },
      set(value) {
        this.$store.dispatch('setPaymentRequest', value);
        // this.$router.push({ path: '/lightning' });
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.details {
  font-size: 17px;
  font-weight: 500;
  line-height: 1.25;
  color: #a29bbc;
}

.copy-request {
  width: 100%;
  height: auto;
  border-radius: 4px;
  border: 1px solid #a29bbc;
  background-color: rgba(255, 255, 255, 0.03);
  word-wrap: break-word;
  padding: 0.75rem;
}

.copy-request p {
  color: #865efc;
  font-size: 14px;
}

.copy-request > .btn {
  margin: 0;
}

.qr-code {
  height: auto;
}

.qr-code > div {
  background: #fff;
  padding: 0.5rem !important;
  display: inline-block;
}

.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: scroll;
  background: #fff;
  color: #fff;
  z-index: 9999;
  background-color: #160c46;

  &_inner {
    position: relative;
    max-width: 42em;
    margin-right: auto;
    margin-left: auto;
    padding: 1em;
  }

  &_close {
    position: absolute;
    text-decoration: none;
    font-size: 1.25em;
    color: #fff;
    transition: color 0.2s;
    float: left;
    &:hover,
    &:focus {
      color: #999;
    }
  }
}

.casa-button {
  padding: 0.5rem 1rem;
  margin-left: -1px;
  margin-top: 2.5rem;
  text-decoration: none !important;
  -webkit-appearance: none;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  background-image: linear-gradient(to right, #5839f5, #9469fe);
  border: none;
  color: #fff;
  min-width: 105px;
}
</style>
