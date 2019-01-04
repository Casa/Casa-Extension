<template>
  <div class="settings">
    <h4>Unlock Lightning Node</h4>
    <p class="instructions">This unlocks your Lightning Node, so it can make and route transactions. You will only need to do this once per node restart.</p>
    <section>
      <b-form @submit="onSubmit">
        <b-form-group class="base-url" label="Casa Node Password" label-for="Casa Node Password">
          <b-form-input type="password" v-model="password" required></b-form-input>
        </b-form-group>
        <b-button class="btn casa-button" type="submit" :disabled="pending === true">
          <span v-if="!pending">Unlock</span> <span v-if="pending" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-if="pending">Unlocking</span>
        </b-button>
      </b-form>
    </section>
  </div>
</template>

<script>
const delayRequest = ms => new Promise(res => setTimeout(res, ms));

export default {
  name: `Unlock`,

  data() {
    return {
      password: '',
      pending: '',
      isUnlocked: false,
    };
  },

  methods: {
    onSubmit: async function(evt) {
      const baseUrl = this.$store.state.settings.baseUrl;
      evt.preventDefault();
      try {
        this.pending = true;
        await this.$http.post(`${baseUrl}:3002/v1/lnd/wallet/unlock`, { password: this.password });
        this.isUnlocked = true;
      } catch (err) {
        this.$notify({ group: 'alerts', type: 'error', title: 'Unlock Failed', text: `Please verify your password and try again.`, position: 'top center' });
      } finally {
        await delayRequest(2000); // Delay to ensure unlock is finished
        this.pending = false;
      }
      // If unlocked successfully, navigate to lightning view
      if (this.isUnlocked === true) {
        this.$router.push('/lightning');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.settings h4 {
  margin-top: 0.5em;
  font-size: 24px;
  font-weight: bold;
  line-height: 1.5em;
}

p.instructions {
  color: #a29bbc;
  font-size: 18px;
  margin: 1.5em 0;
  line-height: 1.5em;
}

* {
  color: #fff;
}

.settings {
  margin: 0 1.5rem;
}

.popup-main {
  height: 100% !important;
}

.help-link {
  color: #3bccfc;
  text-decoration: none;
}

.report-error {
  color: #f0649e;
  font-size: 16px;
  font-weight: 500;
  display: inherit;
  float: right;
}

.report-error img {
  display: inline-block;
  vertical-align: top;
  margin-right: 0.25em;
  height: 25px;
}

.report-success {
  color: #2dcccd;
  float: right;
}

.report-error.level:not(:last-child) {
  margin-bottom: inherit;
}

.b-form-group input {
  height: 55px;
  color: #fff;
}

.base-url {
  font-weight: bold;
  font-size: 18px;
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
  width: 100%;
  position: absolute;
  bottom: 1.5rem;
  max-width: 354px;
}
</style>
