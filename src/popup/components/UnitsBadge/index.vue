<template>
  <span class="btc-heartbeat"> <span v-if="units === 'btc'">BTC</span> <span v-if="units === 'sats'">sats</span> </span>
</template>

<script>
export default {
  name: 'UnitsBadge',
  data() {
    return {
      units: '',
    };
  },
  created() {
    this.units = this.$store.state.settings.units || 'sats';
  },
};
</script>

<style lang="scss">
.btc-heartbeat {
  font-size: 14px;

  span {
    letter-spacing: 0.2px;
  }
}

.btc-heartbeat:before {
  content: '';
  display: inline-block;
  position: relative;
  top: 0;
  width: 10px;
  height: 10px;
  margin: 0 5px;
  border-radius: 10px;
  background-color: #ff7200;
}
</style>
