<template>
  <router-link class="btn ext-link" :href="url" :to="to" exact>
    <strong><slot></slot></strong> <img src="~assets/images/chevron.svg" />
  </router-link>
</template>

<script>
export default {
  name: 'ButtonLink',
  props: ['to'],
  data() {
    return {
      url: '',
    };
  },
};
</script>

<style lang="scss">
.ext-link {
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  margin-top: -15px;
  border-radius: 24px;
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.ext-link:hover {
  text-decoration: none;
  color: #ffffff;
}

.ext-link img {
  max-height: 12px;
  margin-left: 20px;
}

.ext-link strong {
  color: #fff;
}
</style>
