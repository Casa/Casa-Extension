<template>
  <div>
    <section class="data-group">
      <h4>Create New Lightning Channel</h4>
      <p class="details">Send transactions directly to another Lightning Node.</p>
      <b-form-group class="font-weight-bold" label="Channel Peer Name"> <b-form-input v-model="name"></b-form-input> </b-form-group>
      <b-form-group class="font-weight-bold" label="Purpose of Channel"> <b-form-input v-model="purpose"></b-form-input> </b-form-group>
      <b-form-group class="font-weight-bold" label="Peer Connection Code"> <b-form-input v-model="connectionCode"></b-form-input> </b-form-group>
      <b-form-group class="font-weight-bold" label="Funding Amount (in BTC)"> <b-form-input v-model="fundingAmount"></b-form-input> </b-form-group>

      <a class="btn casa-button btn-block" @click="openChannel" name="button" :disabled="pending === true">
        <span v-if="!pending">Confirm Lightning Channel Opening</span> <span v-if="pending" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span v-if="pending">Opening Channel</span>
      </a>
    </section>
  </div>
</template>

<script>
export default {
  name: 'OpenChannel',
  data() {
    return {
      manualEntry: false,
      connectionCode: null,
      pubKey: null,
      ip: null,
      port: null,
      fundingAmount: null,
      name: null,
      purpose: null,
      pending: false,
      invoice: '',
      channel: {},
    };
  },
  methods: {
    async openChannel() {
      const baseUrl = this.$store.state.settings.baseUrl;
      this.pending = true;

      let data = {
        amt: Math.floor(this.fundingAmount * 100000000), // convert from btc to sats
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
.details {
  font-size: 18px;
  font-weight: 500;
  line-height: 1.5;
  color: #a29bbc;
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

.wallet-options {
  background-color: #0a0525;
  padding: 1rem 1.5rem;
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
