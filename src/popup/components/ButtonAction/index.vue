<template>
  <router-link class="casa-btn" :to="to" v-if="type === 'link'" exact>
    <span :class="btnClass">
      <i v-if="icon" :class="'casa-btn-icon'" aria-hidden="true">{{ icon }}</i> <img v-if="!icon && img" :src="img" :class="'casa-btn-img'" aria-hidden="true" />
      <span class="casa-btn-value" v-if="value">{{ value }}</span>
    </span>
  </router-link>

  <a class="casa-btn" v-else-if="type === 'anchor'">
    <span :class="btnClass">
      <i v-if="icon" :class="'casa-btn-icon'" aria-hidden="true">{{ icon }}</i> <span class="casa-btn-value" v-if="value"> {{ value }}</span>
    </span>
  </a>

  <button class="casa-btn" :type="type" v-else>
    <span :class="btnClass">
      <i v-if="icon" :class="'casa-btn-icon'" aria-hidden="true">{{ icon }}</i> <img v-if="!icon && img" :src="img" :class="'casa-btn-img'" aria-hidden="true" />
      <span class="casa-btn-value" v-if="value">{{ value }}</span>
    </span>
  </button>
</template>

<script>
export default {
  name: 'buttonAction',
  props: ['value', 'icon', 'icon-pos', 'img', 'type', 'size', 'theme', 'to', 'color'],
  computed: {
    btnClass() {
      let value = 'casa-btn-container';
      if (this.iconPos) {
        value += ` casa-btn-icon-${this.iconPos}`;
      }
      if (this.size) {
        value += ` casa-btn-size-${this.size}`;
      }
      if (this.theme) {
        value += ` casa-btn-theme-${this.theme}`;
      }
      if (this.color) {
        value += ` casa-btn-${this.color}`;
      }
      return value;
    },
  },
};
</script>

<style lang="scss">
.casa-btn {
  padding: 0;
  margin: 2px;
  width: 165px;
  border: none;
  text-decoration: none !important;
  -webkit-appearance: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
  background-image: linear-gradient(to right, #5839f5, #9469fe);
}
/* firefox fix - padding */
.casa-btn::-moz-focus-inner {
  padding: 0;
  border: 0;
}
.casa-btn-container::before,
.casa-btn-container::after {
  content: '';
  flex: 1 0 auto;
}
.casa-btn-container {
  font-size: 0.95rem !important;
  font-weight: 400;
  height: 2em;
  line-height: 1;
  color: #fff !important;
  padding: 1.25rem 0.5rem;
  margin: 0;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-appearance: none;
}
.casa-btn-container:hover:enabled {
  color: #fff;
  text-decoration: none;
  background: #fff;
}
.casa-btn-icon {
  font-size: 1em;
  line-height: 1;
}
.casa-btn-icon + .casa-btn-value,
.casa-btn-img + .casa-btn-value {
  padding-left: 0.375em;
}
.casa-btn-img {
  height: 1em;
}
.casa-btn-value {
  line-height: 1.5;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
/* disabled */
.casa-btn.disabled,
.casa-btn[disabled] {
  opacity: 0.333;
  cursor: not-allowed;
  user-select: none;
  pointer-events: none;
  color: #fff !important;
}
.casa-btn.disabled:focus:enabled,
.casa-btn[disabled]:focus:enabled {
  outline: none;
}
/* right aligned icons */
.casa-btn-container.casa-btn-icon-right {
  flex-direction: row-reverse;
}
.casa-btn-container.casa-btn-icon-right .casa-btn-icon + .casa-btn-value {
  padding-left: 0;
  padding-right: 0.375em;
}
/* sizes */
.casa-btn-container.casa-btn-size-sm {
  font-size: 0.75em;
  height: 1.5rem;
  line-height: 1rem;
  padding: 0 1rem;
}
.casa-btn-container.casa-btn-size-sm i.fa,
.casa-btn-container.casa-btn-size-sm i {
  font-size: 0.75rem;
  line-height: 1;
}
.casa-btn-container.casa-btn-size-sm .casa-btn-value {
  font-size: 0.75rem;
}
.casa-btn-container.casa-btn-size-lg {
  font-size: 1.125em !important;
  height: 3rem;
  font-weight: normal;
  padding: 0 1rem;
}
.casa-btn-container.casa-btn-primary {
  background: #99f;
}
.casa-btn-container.casa-btn-primary i.fa,
.casa-btn-container.casa-btn-primary i {
  color: rgba(255, 255, 255, 0.667);
}
.casa-btn-container.casa-btn-primary .casa-btn-value {
  color: #fff;
}
.casa-btn-container.casa-btn-success {
  border-color: #fff;
}
.casa-btn-container.casa-btn-success .casa-btn-value {
  color: #000;
}
.casa-btn-container.casa-btn-danger {
  border-color: #fff;
}
.casa-btn-container.casa-btn-danger .casa-btn-value {
  color: #000;
}
</style>
