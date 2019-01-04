<template>
  <div class="settings">
    <h4>Almost Done</h4>
    <p class="help-text">Just enter your Casa Node password and we'll take care of the rest.</p>
    <section>
      <b-form @submit="onSubmit">
        <b-form-group class="password-label" label="Casa Node Password" label-for="Casa Node Password">
          <b-form-input id="password" type="password" v-model="password" required></b-form-input>
        </b-form-group>

        <div class="buttons">
          <b-button class="btn casa-button" type="submit" :disabled="pending === true">
            <span v-if="!pending">Sign In</span> <span v-if="pending" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span v-if="pending">Connecting</span>
          </b-button>
        </div>
      </b-form>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: `Login`,

  data() {
    return {
      password: '',
      pending: '',
    };
  },

  methods: {
    onSubmit: async function(evt) {
      evt.preventDefault();
      try {
        this.pending = true;
        await this.$store.dispatch('login', { password: this.password });
        this.$router.push('/lightning');
      } catch (err) {
        this.$notify({ group: 'alerts', type: 'error', title: 'Authentication Failed', text: `Please verify your password and try again.`, position: 'top center' });
      } finally {
        this.pending = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.settings h4 {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.5em;
}

.settings .help-text {
  margin: 1.5em 0;
  line-height: 1.5em;
  color: #a29bbc;
}

.password-label {
  font-weight: bold;
  font-size: 18px;
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

#password {
  font-weight: bold;
  font-size: 18px;
}

.buttons {
  position: absolute;
  bottom: 2em;
  left: 0;
  right: 0;
  padding: 0 2em 0 1.8em;
}

.casa-button {
  padding: 1rem;
  text-decoration: none !important;
  -webkit-appearance: none;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  background-image: linear-gradient(to right, #5839f5, #9469fe);
  border: none;
  width: 100%;
  max-width: 354px;
}
</style>
