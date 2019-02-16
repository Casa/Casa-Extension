<template>
  <div class="settings">
    <h4>Sign In</h4>
    <p class="instructions">Your session timed out. Please enter your password to log back in.</p>
    <section>
      <b-form @submit="onSubmit">
        <b-form-group class="base-url" label="Casa Node Password" label-for="Casa Node Password">
          <b-form-input type="password" v-model="password" required></b-form-input>
        </b-form-group>
        <b-button class="btn casa-button" type="submit" :disabled="pending === true">
          <span v-if="!pending">Sign In</span> <span v-if="pending" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-if="pending">Connecting</span>
        </b-button>
      </b-form>
    </section>
  </div>
</template>

<script>
export default {
  name: `Login`,
  data() {
    return {
      nextPath: '',
      password: '',
      pending: false,
    };
  },
  async created() {
    // store intended path for redirect after authentication
    this.nextPath = localStorage.getItem('nextPath') || '/lightning';
  },
  methods: {
    onSubmit: async function(evt) {
      evt.preventDefault();
      try {
        this.pending = true;
        await this.$store.dispatch('login', { password: this.password });
        this.$router.push(this.nextPath);
      } catch (err) {
        this.$notify({ group: 'alerts', type: 'error', title: 'Authentication Failed', text: `Please verify your password and try again.` });
      } finally {
        this.pending = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.settings {
  margin: 0 1.5rem;

  h4 {
    margin-top: 0.5em;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    line-height: 1.5em;
  }

  .instructions {
    color: #a29bbc;
    font-size: 18px;
    margin: 1.5em 0;
    line-height: 1.5em;
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
    font-weight: bold;
    background-image: linear-gradient(to right, #5839f5, #9469fe);
    border: none;
    width: 100%;
    position: relative;
    top: 240px;
  }
}
</style>
