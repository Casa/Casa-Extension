<template>
  <div class="overlay container h-100">
    <div class="overlay_inner">
      <div class="overlay-message">
        <img src="~assets/images/check-success.svg" alt="success" />
        <h4 class="text-center">Bitcoin Withdrawn</h4>
        <h2 class="text-center">{{ transaction.amt | units }} <units-badge /></h2>
      </div>
      <div class="overlay-buttons">
        <a class="btn casa-button btn-outline btn-block" name="button" @click.prevent="$router.push('/bitcoin/send/receipt')">View Receipt</a>
        <a class="btn casa-button btn-white btn-block" name="button" href="#" aria-label="close" @click.prevent="$router.push('/bitcoin')">Done</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: `Withdrawl`,
  computed: {
    transaction: {
      get() {
        return this.$store.state.newTransaction;
      },
    },
    units: {
      get() {
        return this.$store.state.settings.units;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.overlay * {
  color: #fff;
}
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: scroll;
  background: #fff;
  z-index: 9999;
  background-image: linear-gradient(to right, #5839f5, #9469fe);

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

.overlay-message {
  margin-top: 10vh;
  top: 2rem;
}

.overlay-message img {
  display: block;
  width: 50px;
  margin: 0 auto 1rem;
}

.overlay-message h4 {
  font-size: 1.1rem;
}

.overlay-buttons {
  margin-top: 30vh;
}

.casa-button {
  padding: 1rem;
  margin: 2px;
  text-decoration: none !important;
  -webkit-appearance: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
  background: transparent;
}

.btn-outline {
  border: 3px solid white;
}

.btn-white {
  background: #fff;
  color: #000 !important;
}

a.btn.casa-button.btn-outline.btn-block {
  margin-bottom: 1rem;
}
</style>
