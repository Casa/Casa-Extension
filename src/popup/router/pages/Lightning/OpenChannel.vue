<template>
  <div>
    <b-navbar>
      <img id="back-button" src="~assets/images/back.svg" class="d-inline-block align-top" alt="back" @click.prevent="$router.back()" />
      <h3 class="page-header">Create New Lightning Channel</h3>
      <img id="forward-button" src="~assets/images/back.svg" />
    </b-navbar>
    <main class="popup-main">
      <section class="data-group">
        <p class="details">Send transactions directly to another Lightning Node.</p>
        <!-- Channel Name -->
        <legend class="col-form-label pt-2">Channel Peer Name</legend>
        <input type="text" v-model="name" class="form-control" />
        <!-- Channel Purpose  -->
        <legend class="col-form-label pt-2">Purpose of Channel</legend>
        <input type="text" v-model="purpose" class="form-control" />
        <!-- Connection Code -->
        <legend class="col-form-label pt-2">Peer Connection Code</legend>
        <input type="text" v-model="connectionCode" class="form-control" />
        <!-- Funding Amount (BTC) -->
        <div v-if="units === 'btc'" class="currency-group">
          <legend class="col-form-label pt-2">Funding Amount</legend>
          <div class="btc"><input type="text" v-model="amount.btc" class="btc form-control" /></div>
        </div>
        <!-- Funding Amount (sats) -->
        <div v-else class="currency-group">
          <legend class="col-form-label pt-2">Funding Amount</legend>
          <div class="sats"><input type="text" v-model="amount.sats" class="sats form-control" /></div>
        </div>
        <a class="btn casa-button btn-block" @click="openChannel" name="button" :disabled="pending === true">
          <span v-if="!pending">Confirm Lightning Channel Opening</span> <span v-if="pending" class="spinner-border spinner-border-sm" role="status"></span>
          <span v-if="pending"> Opening Channel</span>
        </a>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'OpenChannel',
  data() {
    return {
      manualEntry: false,
      pending: false,
      connectionCode: '',
      pubKey: '',
      ip: '',
      port: '',
      amount: {
        btc: '',
        sats: '',
      },
      name: '',
      purpose: '',
      invoice: '',
      units: '',
      channel: {},
    };
  },
  created() {
    this.units = this.$store.state.settings.units;
  },
  methods: {
    async openChannel() {
      const baseUrl = this.$store.state.settings.baseUrl;
      this.pending = true;

      if (this.units === 'btc') {
        this.amount.sats = this.amount.btc * 100000000;
      }

      let data = {
        amt: this.amount.sats,
        name: this.name,
        purpose: this.purpose,
      };

      if (this.manualEntry) {
        data.pubKey = this.pubKey;
        data.ip = this.ip;
        data.port = this.port;
      } else {
        try {
          const parts = this.connectionCode.split('@');
          data.pubKey = parts[0];

          // The last semi is the deliminator between the IP address and the port number. This will suppose IPv6 and IPv4.
          const lastSemi = parts[1].lastIndexOf(':');

          // The port was not specified. The backend will determine the port to use.
          if (lastSemi === -1) {
            data.ip = parts[1];
          } else {
            data.ip = parts[1].substr(0, lastSemi);
            data.port = parts[1].substr(lastSemi + 1, parts[1].length - lastSemi - 1);
          }
        } catch (err) {
          this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err.response.data}`, position: 'top center' });
          return;
        }
      }

      try {
        const baseUrl = this.$store.state.settings.baseUrl;
        await this.$http.post(`${baseUrl}:3002/v1/lnd/channel/open`, data);
        this.$notify({ group: 'alerts', type: 'success', title: 'Success', text: `Opening Channel with ${this.name}`, position: 'top center' });
        this.$router.push('/lightning');
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
  line-height: 1.5;
  color: #a29bbc;
}

.data-group {
  border: none;
}

.data-group input {
  background: #160c46;
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
  margin-top: 2rem;
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

.currency-group input {
  border-radius: 4px !important;
}

#back-button {
  cursor: pointer;
}

#forward-button {
  visibility: hidden;
}
</style>
