<template>
  <div class="lightning">
    <!-- Alias & Node Options Menu -->
    <div class="alias">
      <content-loader id="alias-loader" v-if="infoLoading" :animate="true" :height="60" :width="400" :speed="1.5" primaryColor="#160c46" secondaryColor="#a29bbc">
        <rect x="37.7" y="15" rx="5" ry="5" width="336.6" height="15.3" />
      </content-loader>
      <h1 v-else>
        <span>{{ alias | truncate }}</span>
      </h1>
      <b-dropdown id="options" right text="" class="m-md-2" no-caret>
        <img src="~assets/images/menu-dots.svg" style="display:none;" />
        <b-dropdown-item>
          <span @click="missingCode" v-clipboard:copy="connectionCode" v-clipboard:success="onCopy" v-clipboard:error="onError">Copy Connection Code</span>
        </b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item to="/lightning/channels/new">Open Channel</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item to="/settings">Settings</b-dropdown-item>
      </b-dropdown>
    </div>
    <!-- Balance -->
    <div class="balance">
      <content-loader v-if="infoLoading" :animate="true" :height="60" :width="400" :speed="1.5" primaryColor="#160c46" secondaryColor="#a29bbc">
        <rect x="128.44" y="13.61" rx="5" ry="5" width="77.42" height="35.5" /> <rect x="217.44" y="17.61" rx="5" ry="5" width="50.78" height="30.9" />
      </content-loader>
      <h1 v-else>
        <span
          ><span class="numeric">{{ chBalance | units }}</span
          ><units-badge
        /></span>
      </h1>
      <span class="balance-info">In Lightning Channels</span> <br /><br />
      <img src="~assets/images/qr-code.svg" style="display:none;" /> <img src="~assets/images/send.svg" style="display:none;" />
      <button-action type="link" to="/lightning/pay" value="Send Payment" size="large" img="/src/assets/images/send.svg"></button-action>
      <button-action type="link" to="/lightning/request" value="Request Payment" size="large" img="/src/assets/images/qr-code.svg"></button-action>
    </div>

    <div class="transaction-list-wrap">
      <!-- Pending Transactions -->
      <div class="tx-list" v-if="pendingTxs.length">
        <h3>
          Pending <a class="btn ext-link" :href="baseUrl" target="_blank" rel="noopener"><strong>View All</strong> <img src="~assets/images/chevron.svg"/></a>
        </h3>
        <ul class="pending-tx">
          <li class="tx-item" v-for="(tx, index) in pendingTxs" :key="index">
            <div class="tx-row">
              <div class="tx-col-1">
                <div class="date-badge">
                  <span class="month">{{ (tx.creationDate * 1000) | getMonth }}</span> <span class="day">{{ (tx.creationDate * 1000) | getDate }}</span>
                </div>
              </div>
              <div class="tx-col-2">
                <h2 v-if="Math.sign(parseInt(tx.value)) === -1">Sending Lightning Payment</h2>
                <h2 v-else>Receiving Lightning Payment</h2>
                <h3>{{ tx.memo | truncate }}</h3>
              </div>
              <div class="tx-col-3">
                <h2>
                  <span>{{ tx.value | units }}</span> <span v-if="units === 'btc'">BTC</span><span v-else>sats</span>
                </h2>
                <h3>${{ ((parseInt(tx.value) / 100000000) * rate).toFixed(2) }}</h3>
              </div>
            </div>
            <hr />
          </li>
        </ul>
      </div>

      <content-loader v-if="txLoading" :height="200" :width="400" :speed="1.5" primaryColor="#160c46" secondaryColor="#a29bbc">
        <rect x="10" y="20" rx="3" ry="3" width="45.76" height="45.76" /> <rect x="77.59" y="48" rx="3" ry="3" width="224.91" height="14.2" />
        <rect x="78" y="21.61" rx="3" ry="3" width="291.38" height="18.2" /> <rect x="9" y="81" rx="3" ry="3" width="45.76" height="45.76" />
        <rect x="78" y="82.61" rx="3" ry="3" width="291.38" height="18.2" /> <rect x="77.59" y="108" rx="3" ry="3" width="224.91" height="14.2" />
        <rect x="9" y="142" rx="3" ry="3" width="45.76" height="45.76" /> <rect x="78" y="145.61" rx="3" ry="3" width="291.38" height="18.2" />
        <rect x="77.59" y="172" rx="3" ry="3" width="224.91" height="14.2" />
      </content-loader>

      <!-- Completed Transactions -->
      <div class="tx-list" v-if="completedTxs.length">
        <h3>
          Recent Transactions <a class="btn ext-link" :href="baseUrl" target="_blank" rel="noopener"><strong>View All</strong> <img src="~assets/images/chevron.svg"/></a>
        </h3>

        <ul class="pending-tx">
          <li class="tx-item" v-for="(tx, index) in completedTxs" :key="index">
            <div class="tx-row">
              <div class="tx-col-1">
                <div class="date-badge">
                  <span class="month">{{ (tx.creationDate * 1000) | getMonth }}</span> <span class="day">{{ (tx.creationDate * 1000) | getDate }}</span>
                </div>
              </div>
              <div class="tx-col-2">
                <h2 v-if="Math.sign(parseInt(tx.value)) === -1">Sent Lightning Payment</h2>
                <h2 v-else>Received Lightning Payment</h2>
                <h3>{{ tx.paymentHash | truncate }}</h3>
              </div>
              <div class="tx-col-3">
                <h2>
                  <span>{{ tx.value | units }}</span> <span v-if="units === 'btc'">BTC</span><span v-else>sats</span>
                </h2>
                <h3>${{ ((parseInt(tx.value) / 100000000) * rate).toFixed(2) }}</h3>
              </div>
            </div>
            <hr />
          </li>
        </ul>
      </div>

      <div class="tx-list placeholder" v-if="noTxHistory"><h2>No transactions found</h2></div>
    </div>
  </div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader';

export default {
  name: `Lightning`,
  components: {
    ContentLoader,
  },
  data() {
    return {
      rate: 0,
      alias: '',
      units: '',
      baseUrl: '',
      chBalance: '',
      isUnlocked: '',
      connectionCode: '',
      pendingTxs: [],
      completedTxs: [],
      infoLoading: true,
      txLoading: true,
      noTxHistory: false,
    };
  },

  async created() {
    // Get lightning channel settings
    this.baseUrl = this.$store.state.settings.baseUrl;
    this.units = this.$store.state.settings.units;
    // Check LND Status
    try {
      const status = (await this.$http.get(`${this.baseUrl}:3002/v1/lnd/info/status`)).data;
      this.isUnlocked = status.unlocked;
    } catch (err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'LND Error', text: 'Unable to retrieve status.', position: 'top center' });
    }
    //
    if (this.isUnlocked === true) {
      // Get Node Info
      try {
        const { balance, lightningInfo } = (await this.$http.get(`${this.baseUrl}:3002/v1/pages/lnd`)).data;
        const { lnd } = (await this.$http.get(`${this.baseUrl}:3000/v1/settings/read`)).data;
        this.alias = lnd.nickName || 'Lightning Node'; // use friendly default as a fallback
        this.chBalance = balance.channel.balance;
        this.connectionCode = lightningInfo.uris[0];
      } catch (err) {
        this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err.response.data}`, position: 'top center' });
      } finally {
        this.infoLoading = false;
      }

      // Get Transaction Data
      try {
        const invoices = (await this.$http.get(`${this.baseUrl}:3002/v1/lnd/lightning/invoices`)).data;
        const payments = (await this.$http.get(`${this.baseUrl}:3002/v1/lnd/lightning/payments`)).data;

        if (payments.length > 0) {
          payments.forEach(payment => {
            payment.value *= -1; // Payments should be negative to match the display of BTC transactions
            this.completedTxs.push(payment);
          });
        }

        // Loop through invoices and payments to determine which are pending and completed
        if (invoices.length > 0) {
          invoices.forEach(invoice => {
            if (invoice.settled) {
              this.completedTxs.push(invoice);
            } else {
              // If this invoice hasn't expired
              if (parseInt(invoice.creationDate) + parseInt(invoice.expiry) > new Date().getTime() / 1000) {
                this.pendingTxs.push(invoice);
              }
            }
          });
        }

        // If no history, display placeholder
        if (this.completedTxs.length === 0 && this.pendingTxs.length === 0) {
          this.noTxHistory = true;
        } else {
          // Sort the transactions by date now that invoices and payments been combined
          this.completedTxs.sort(sortTransactions);
        }
      } catch (err) {
        this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err.response.data}`, position: 'top center' });
      } finally {
        this.txLoading = false;
      }

      // Get BTC price
      try {
        const { USD } = (await this.$http.get('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')).data;
        this.rate = USD;
      } catch (err) {
        this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `There was a problem receiving exchange data.`, position: 'top center' });
      }
    } else if (this.isUnlocked === false) {
      // LND needs to be unlocked
      this.$router.push('/unlock');
    }
  },
  methods: {
    missingCode: function() {
      if (this.connectionCode === undefined) {
        this.$notify({ group: 'alerts', type: 'error', title: 'Copy Failed', text: 'Connection Code Not Available', position: 'top center' });
      }
    },
    onCopy: function(err) {
      if (this.connectionCode.length < 1) {
        this.$notify({ group: 'alerts', type: 'error', title: 'Copy Failed', text: 'Connection Code Not Available', position: 'top center' });
      }
      this.$notify({ group: 'alerts', type: 'success', title: 'Copied', text: 'Copied connection string text.', position: 'top center' });
    },
    onError: function(err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Copy Failed', text: 'Failed to copy address text.', position: 'top center' });
    },
  },
};

// Helper function to sort lightning transactions by date
function sortTransactions(a, b) {
  if (a.creationDate > b.creationDate) {
    return -1;
  }

  if (a.creationDate < b.creationDate) {
    return 1;
  }

  return 0;
}
</script>

<style>
section * {
  color: white;
}

section.data-group {
  border-bottom: 3px solid #231a52;
  padding: 1rem 1.5rem;
}

.lightning .alias {
  padding-left: 2rem;
  padding-right: 2rem;
  text-align: left;
}

.lightning .alias h1 {
  text-align: left;
  display: inline-block;
}

.lightning .alias .toggle {
  display: inline-block;
  float: right;
  text-decoration: none;
}

.lightning h1 {
  font-size: 1.75em;
  text-align: center;
  font-weight: bold;
  color: #fff;
}

.lightning p {
  color: #fff;
  margin-bottom: 0.2em;
  margin-top: 0.2em;
}

.lightning a.btn.ext-link {
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  margin-top: -6px;
  border-radius: 20px;
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  font-size: 14px;
  float: right;
}

.lightning a.btn.ext-link img {
  max-height: 11px;
  margin-left: 10px;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin: 0;
}

.placeholder h2 {
  font-weight: bold;
  color: #a29bbc;
  font-size: 22px;
}

#alias-loader {
  display: inline-block;
  max-width: 280px;
}

#options {
  float: right;
}

#options button {
  margin: 0;
  padding: 0;
  border: none;
  box-shadow: none;
  background-color: transparent;
}

#options button::before {
  content: url('~assets/images/menu-dots.svg');
}

#options .dropdown-menu {
  min-width: 12rem;
  left: 4px !important;
}

#options .dropdown-item > span {
  padding-top: 0.75em;
  padding-bottom: 0.75em;
  padding-left: 0.5em;
}

#options .dropdown-menu.show,
#options .dropdown-item:hover,
#options .dropdown-item:focus {
  background: #261d53;
}

#options .dropdown-divider {
  border-top: 3px solid #312958;
}

#options .dropdown-menu.show a {
  color: #fff;
  text-align: right;
}
</style>
