<template>
  <div class="bitcoin">
    <h1>Bitcoin Node</h1>
    <div class="balance">
      <content-loader v-if="infoLoading" :animate="true" :height="50" :width="400" :speed="1.5" primaryColor="#160c46" secondaryColor="#a29bbc">
        <rect x="128.44" y="13.61" rx="5" ry="5" width="77.42" height="35.5" /> <rect x="217.44" y="17.61" rx="5" ry="5" width="50.78" height="30.9" />
      </content-loader>
      <h1 v-else>
        <span class="numeric">{{ btcBalance | units }}</span> <units-badge />
      </h1>
      <span class="balance-info">Balance on-chain</span> <br /><br />
      <img src="~assets/images/qr-code.svg" style="display:none;" /> <img src="~assets/images/send.svg" style="display:none;" />
      <button-action type="link" to="/bitcoin/send" value="Withdraw" size="large" img="/src/assets/images/send.svg"></button-action>
      <button-action type="link" to="/bitcoin/deposit" value="Deposit" size="large" img="/src/assets/images/qr-code.svg"></button-action>
    </div>

    <div class="transaction-list-wrap">
      <div class="tx-list" v-if="pendingTxs.length">
        <h3>Pending</h3>
        <ul class="pending-tx">
          <li class="tx-item" v-for="(tx, index) in pendingTxs" :key="index">
            <a :href="`https://blockstream.info/tx/${tx.txHash}`" target="_blank" rel="noopener">
              <div class="tx-row">
                <div class="tx-col-1">
                  <div class="date-badge">
                    <span class="month">{{ (tx.timeStamp * 1000) | getMonth }}</span> <span class="day">{{ (tx.timeStamp * 1000) | getDate }}</span>
                  </div>
                </div>
                <div class="tx-col-2">
                  <h2 v-if="tx.type === 'ON_CHAIN_TRANSACTION_SENT'">Sending Bitcoin</h2>
                  <h2 v-else>Receiving Bitcoin</h2>
                  <h3>{{ tx.destAddresses[0] | truncate }}...</h3>
                </div>
                <div class="tx-col-3">
                  <h2>
                    <span>{{ tx.amount | units }}</span> <span v-if="units === 'btc'">BTC</span><span v-else>sats</span>
                  </h2>
                  <h3>${{ (satsToBtc(tx.amount) * rate).toFixed(2) }}</h3>
                </div>
              </div>
            </a>
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

      <div class="tx-list" v-if="completedTxs.length">
        <h3>Completed</h3>
        <ul class="pending-tx">
          <li class="tx-item" v-for="(tx, index) in completedTxs" :key="index">
            <a :href="`https://blockstream.info/tx/${tx.txHash}`" target="_blank" rel="noopener">
              <div class="tx-row">
                <div class="tx-col-1">
                  <div class="date-badge">
                    <span class="month">{{ (tx.timeStamp * 1000) | getMonth }}</span> <span class="day">{{ (tx.timeStamp * 1000) | getDate }}</span>
                  </div>
                </div>
                <div class="tx-col-2">
                  <h2 v-if="tx.type === 'ON_CHAIN_TRANSACTION_SENT'">Sent Bitcoin</h2>
                  <h2 v-else>Received Bitcoin</h2>
                  <h3>{{ tx.destAddresses[0] | truncate }}...</h3>
                </div>
                <div class="tx-col-3">
                  <h2>
                    <span>{{ tx.amount | units }}</span> <span v-if="units === 'btc'">BTC</span><span v-else>sats</span>
                  </h2>
                  <h3>${{ ((parseInt(tx.amount) / 100000000) * rate).toFixed(2) }}</h3>
                </div>
              </div>
            </a>
            <hr />
          </li>
        </ul>
      </div>

      <div class="tx-list placeholder" v-if="noTxHistory"><h2>No transactions found</h2></div>
    </div>

    <p>View<router-link to="/setup">Settings</router-link>.</p>
  </div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader';
import { satsToBtc } from '../../../helpers/units';

export default {
  name: `Bitcoin`,
  components: {
    ContentLoader,
  },
  data() {
    return {
      rate: 0,
      units: '',
      btcBalance: '',
      pendingTxs: [],
      completedTxs: [],
      transactions: '',
      infoLoading: true,
      txLoading: true,
      noTxHistory: false,
    };
  },

  async created() {
    const baseUrl = this.$store.state.settings.baseUrl;
    this.units = this.$store.state.settings.units;
    try {
      const { balance } = (await this.$http.get(`${baseUrl}:3002/v1/pages/lnd`)).data;
      this.btcBalance = balance.wallet.totalBalance;
      this.infoLoading = false;

      const response = (await this.$http.get(`${baseUrl}:3002/v1/lnd/transaction`)).data;

      if (response) {
        this.transactions = response;
        response.forEach(tx => {
          if (tx.type === 'ON_CHAIN_TRANSACTION_SENT' || tx.type === 'ON_CHAIN_TRANSACTION_RECEIVED') {
            if (tx.numConfirmations > 0) {
              this.completedTxs.push(tx);
            } else {
              this.pendingTxs.push(tx);
            }
          }
        });

        if (this.transactions.length === 0) {
          // If no history, display placeholder
          this.noTxHistory = true;
        }
      }
    } catch (err) {
      this.$notify({ group: 'alerts', type: 'error', title: 'Error', text: `${err}`, position: 'top center' });
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
  },
};
</script>

<style media="screen">
.bitcoin h1 {
  font-size: 1.75em;
  text-align: center;
  font-weight: bold;
  color: #fff;
}

.bitcoin p {
  color: #fff;
  margin-bottom: 0.2em;
  margin-top: 0.2em;
}

.bitcoin a.btn.ext-link {
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  margin-top: -10px;
  border-radius: 20px;
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  font-size: 14px;
  float: right;
}

.bitcoin a.btn.ext-link img {
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
</style>
