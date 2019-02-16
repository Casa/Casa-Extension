<template>
  <div class="popup-container">
    <b-navbar>
      <!-- Logo Left -->
      <img src="~assets/images/nav-logo.svg" class="d-inline-block align-top" alt="logo" />
      <!-- Toggle Nav Right -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form> <toggle @change="onToggle($event.value)" v-model="toggled" :value="false" :labels="{ checked: 'Lightning', unchecked: 'Bitcoin' }" /> </b-nav-form>
      </b-navbar-nav>
    </b-navbar>
    <main class="popup-main">
      <transition-page> <router-view /> </transition-page>
    </main>
    <footer class="footer">
      <div class="container">
        <a href="https://keys.casa/node-help/" target="_blank" rel="noopener">Help</a>
        <a class="btn ext-link" :href="baseUrl" target="_blank" rel="noopener"> <strong>Go To Casa Node</strong> <img src="~assets/images/chevron.svg" /> </a>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: `popup-container`,
  data() {
    return {
      toggled: true,
      baseUrl: null,
    };
  },
  async created() {
    this.baseUrl = this.$store.state.settings.baseUrl;
  },
  methods: {
    goToSettings() {
      browser.runtime.openOptionsPage();
    },
    onToggle(event) {
      if (this.toggled === true) {
        this.$router.push('/lightning');
      } else {
        this.$router.push('/bitcoin');
      }
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

html {
  line-height: 1.6;
  color: #333;
  background-color: #160c46;
  font-family: -apple-system, 'Roboto', sans-serif;
}

.navbar {
  background-color: #000000;
}

.navbar-menu {
  display: block !important;
}

.vue-js-switch {
  margin-bottom: 0;
}

.v-switch-button {
  background-image: url('~assets/images/btc-toggle.png');
  background-repeat: no-repeat;
  font-weight: bold;
  font-size: 12px;
  background-size: 80px 20px;
  background-position: 6px;
}

.toggled .v-switch-button {
  background-image: url('~assets/images/lnd-toggle.png');
}

.logo-center {
  display: block;
  margin: 0 auto;
  width: 100px;
  margin-top: 1em;
}

.popup-container {
  margin-right: auto;
  margin-left: auto;
  width: 400px;
  height: 540px;
  background-color: #160c46;
}

.popup-nav {
  padding-top: 1em;
  padding-bottom: 1em;
  border-bottom: 1px solid #c0c0c0;
  text-align: center;
}

.popup-main {
  padding-top: 0.75em;
  padding-bottom: 2.5em;
}

.router-link-exact-active {
  font-weight: bold;
}

.balance {
  text-align: center;
  padding-bottom: 1.25rem;
  padding-top: 1rem;
  border: 3px solid #231a52;
  border-left: none;
  border-right: none;
}

.balance-info {
  font-size: 13px;
  font-weight: 900;
  line-height: 1.31;
  letter-spacing: 1px;
  text-align: center;
  text-transform: uppercase;
  color: #a29bbc;
}

.transaction-list-wrap {
  height: 50vh;
  overflow: auto;
  padding: 0.5rem 1rem 4rem 1rem;
  border-bottom: 3px solid #231a52;

  .tx-list {
    margin-top: 0.5rem;
    margin-bottom: 1rem;

    .tx-item {
      list-style: none !important;
      cursor: pointer;

      a {
        color: #4a4a4a;
        text-decoration: none;
      }

      .tx-row {
        display: flex;

        .tx-col-1 {
          flex: 0 0 auto;

          .date-badge {
            width: 40px;
            height: 45px;
            border-radius: 9.5px;
            background-color: transparent;
            border: solid 1.8px #231a52;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;

            span {
              font-size: 10px;
              font-weight: bold;
              text-transform: uppercase;
            }

            .month {
              font-size: 10px;
              font-weight: 900;
              text-align: center;
              color: #8d8e8e;
              margin-top: 3px;
            }

            .day {
              font-size: 16px;
              font-weight: 500;
              text-align: center;
              color: #fff;
              margin-top: -2px;
            }
          }
        }

        .tx-col-2 {
          flex: 1 1 auto;
          margin-left: 0.5rem;

          h2 {
            font-weight: bold;
            font-size: 15px;
          }

          h3 {
            font-size: 12px;
          }
        }

        .tx-col-3 {
          flex: 0 0 auto;

          h2 {
            margin-top: 4px;
            font-size: 12px;
            text-align: right;
          }

          h3 {
            font-size: 12px;
            text-align: right;
          }
        }
      }
    }
  }
}

.tx-list > h3 {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 1rem;
}

.tx-list * {
  color: #fff;
}

.transactions li.tx-item:hover * {
  color: #3bccfc;
}

.popup-footer {
  padding-top: 1em;
  padding-bottom: 1em;
  border-top: 1px solid #c0c0c0;
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 20px;
  line-height: 12px;
  background-color: #000000;
  padding: 2rem 0.25rem;

  .ext-link {
    float: right;
    font-weight: normal;
  }

  a {
    color: white;
    float: left;
    font-weight: bold;
    text-decoration: none;
  }
}

.footer > div > a:nth-child(1) {
  margin-top: -6px;
}
.footer > div > a:nth-child(2) {
  margin-top: -18px;
}
</style>
