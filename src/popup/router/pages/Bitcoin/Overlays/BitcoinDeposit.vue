<template>
  <div id="bitcoin-deposit" class="overlay">
    <b-navbar>
      <img id="back-button" src="~assets/images/back.svg" class="d-inline-block align-top" alt="back" @click.prevent="$router.back()" />
      <h3 class="page-header">Deposit Bitcoin</h3>
      <img id="forward-button" src="~assets/images/back.svg" />
    </b-navbar>
    <main class="popup-main">
      <div class="overlay_inner">
        <p class="details">You’ll need to use this code to deposit Bitcoin to your Bitcoin Node.</p>
        <section class="copy-request">
          <p>{{ address }}</p>
          <a v-if="!copied" type="button" class="btn casa-button" v-clipboard:copy="address" v-clipboard:success="onCopy" v-clipboard:error="onError">Copy</a>
          <a v-if="copied" type="button" class="btn casa-button" v-clipboard:copy="address" v-clipboard:success="onCopy" v-clipboard:error="onError">
            <img src="~assets/images/btn-check.svg" alt="check" /> Copied</a
          >
        </section>
        <br />
        <p class="details">Or scan this QR code:</p>
        <section class="qr-code"><qr-code :text="address" :size="160"></qr-code></section>
        <a class="btn casa-button btn-block btn-done" href="#" aria-label="close" @click.prevent="$router.push('/lightning')">Done</a>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: `BitcoinDeposit`,
  data() {
    return {
      address: '',
      copied: false,
    };
  },
  async created() {
    const baseUrl = this.$store.state.settings.baseUrl;
    try {
      const response = await this.$http.get(`${baseUrl}:3002/v1/lnd/address`);
      this.address = response.data.address;
    } catch (err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err.response.data}`, position: 'top center' });
    }
  },
  methods: {
    onCopy: function(err) {
      this.copied = true;
    },
    onError: function(err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Copy Failed', text: 'Failed to copy address text.', position: 'top center' });
    },
  },
};
</script>

<style lang="scss">
#bitcoin-deposit {
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

  .details {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.35;
    color: #a29bbc;
  }

  .copy-request {
    width: 100%;
    height: auto;
    border-radius: 4px;
    border: 1px solid #a29bbc;
    background-color: rgba(255, 255, 255, 0.03);
    word-wrap: break-word;
    padding: 0.8rem;
  }

  .copy-request p {
    color: #865efc;
    font-size: 15px;
    margin-bottom: 0.5rem;
  }

  .copy-request > .btn {
    margin: 0;
  }

  .qr-code {
    height: 100px;
  }

  .qr-code img {
    background-color: white;
    padding: 1rem;
  }

  .overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: scroll;
    color: #fff;
    z-index: 9999;
    background-color: #160c46 !important;

    &_inner {
      position: relative;
      max-width: 42em;
      margin-right: auto;
      margin-left: auto;
      padding: 1em;
    }
  }

  .casa-button {
    padding: 0.5rem 1rem;
    min-width: 105px;
    margin-top: 6rem;
    text-decoration: none !important;
    -webkit-appearance: none;
    display: inline-block;
    font-size: 16px;
    font-weight: bold;
    border-radius: 4px;
    background-image: linear-gradient(to right, #5839f5, #9469fe);
    border: none;
    color: #fff;
    border-radius: 20px;
  }

  .casa-button.btn-block {
    padding: 1rem;
    margin-top: 7rem;
  }

  section.qr-code > div > img {
    background: #fff;
    padding: 0.5rem !important;
  }

  .btn-done {
    border-radius: 5px !important;
  }
}

#back-button {
  cursor: pointer;
}

#forward-button {
  visibility: hidden;
}
</style>
