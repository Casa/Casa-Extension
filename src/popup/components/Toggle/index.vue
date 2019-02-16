<template>
  <label :class="className">
    <input type="checkbox" class="v-switch-input" :name="name" :checked="value" @change.stop="toggle" />
    <div class="v-switch-core" :style="coreStyle"><div class="v-switch-button" :style="buttonStyle" /></div>
    <template v-if="labels">
      <span class="v-switch-label v-left" :style="labelStyle" v-if="toggled">
        <slot name="checked">
          <template>{{ labelUnchecked }}</template>
        </slot>
      </span>
      <span class="v-switch-label v-right" :style="labelStyle" v-else>
        <slot name="unchecked">
          <template>{{ labelChecked }}</template>
        </slot>
      </span>
    </template>
  </label>
</template>

<script>
const DEFAULT_COLOR_CHECKED = '#75c791';
const DEFAULT_COLOR_UNCHECKED = '#bfcbd9';
const DEFAULT_LABEL_CHECKED = 'on';
const DEFAULT_LABEL_UNCHECKED = 'off';
const DEFAULT_SWITCH_COLOR = '#fff';
const MARGIN = 3;

const contains = (object, title) => typeof object === 'object' && object.hasOwnProperty(title);

const px = v => v + 'px';

export default {
  name: 'ToggleButton',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    sync: {
      type: Boolean,
      default: false,
    },
    speed: {
      type: Number,
      default: 300,
    },
    color: {
      type: [String, Object],
      validator(value) {
        return typeof value === 'object' ? value.checked || value.unchecked || value.disabled : typeof value === 'string';
      },
    },
    switchColor: {
      type: [String, Object],
      validator(value) {
        return typeof value === 'object' ? value.checked || value.unchecked : typeof value === 'string';
      },
    },
    cssColors: {
      type: Boolean,
      default: false,
    },
    labels: {
      type: [Boolean, Object],
      default: false,
      validator(value) {
        return typeof value === 'object' ? value.checked || value.unchecked : typeof value === 'boolean';
      },
    },
    fontSize: {
      type: Number,
    },
  },
  computed: {
    className() {
      let { toggled, disabled } = this;
      return ['vue-js-switch', { toggled, disabled }];
    },

    coreStyle() {
      return {
        width: px(this.width),
        height: px(this.height),
        backgroundColor: 'transparent',
        borderRadius: px(Math.round(this.height / 2)),
      };
    },

    buttonRadius() {
      return this.height - MARGIN * 2;
    },

    distance() {
      return px(this.width - this.height + MARGIN);
    },

    buttonStyle() {
      const transition = `transform ${this.speed}ms`;
      const transform = this.toggled ? `translate3d(${this.distance}, 3px, 0px)` : null;
      const background = this.switchColor ? this.switchColorCurrent : null;

      return {
        width: px(this.buttonRadius),
        height: px(this.buttonRadius),
        transition,
        transform,
        background,
      };
    },

    labelStyle() {
      return {
        lineHeight: px(this.height),
        fontSize: this.fontSize ? px(this.fontSize) : null,
      };
    },

    colorChecked() {
      let { color } = this;

      if (typeof color !== 'object') {
        return color || DEFAULT_COLOR_CHECKED;
      }

      return contains(color, 'checked') ? color.checked : DEFAULT_COLOR_CHECKED;
    },

    colorUnchecked() {
      let { color } = this;
      return contains(color, 'unchecked') ? color.unchecked : DEFAULT_COLOR_UNCHECKED;
    },

    colorDisabled() {
      let { color } = this;
      return contains(color, 'disabled') ? color.disabled : this.colorCurrent;
    },

    colorCurrent() {
      return this.toggled ? this.colorChecked : this.colorUnchecked;
    },

    labelChecked() {
      const { labels } = this;
      return contains(labels, 'checked') ? labels.checked : DEFAULT_LABEL_CHECKED;
    },

    labelUnchecked() {
      const { labels } = this;
      return contains(labels, 'unchecked') ? labels.unchecked : DEFAULT_LABEL_UNCHECKED;
    },

    switchColorChecked() {
      const { switchColor } = this;
      return contains(switchColor, 'checked') ? switchColor.checked : DEFAULT_SWITCH_COLOR;
    },

    switchColorUnchecked() {
      const { switchColor } = this;
      return contains(switchColor, 'unchecked') ? switchColor.unchecked : DEFAULT_SWITCH_COLOR;
    },

    switchColorCurrent() {
      let { switchColor } = this;
      if (typeof switchColor !== 'object') {
        return switchColor || DEFAULT_SWITCH_COLOR;
      }
      return this.toggled ? this.switchColorChecked : this.switchColorUnchecked;
    },
  },
  watch: {
    value(value) {
      if (this.sync) {
        this.toggled = !!value;
      }
    },
  },
  data() {
    return {
      toggled: !!this.value,
    };
  },
  created() {
    if (this.$store.state.route.name === 'bitcoin') {
      this.toggled = false;
    }
  },
  methods: {
    toggle(event) {
      this.toggled = !this.toggled;
      this.$emit('input', this.toggled);
      this.$emit('change', {
        value: this.toggled,
        srcEvent: event,
      });
    },
  },
};
</script>

<style lang="scss">
.vue-js-switch {
  display: inline-block;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  user-select: none;
  font-size: 10px;
  border: 3px solid #383163;
  border-radius: 30px;
  cursor: pointer;
  min-width: 200px;

  .v-switch-input {
    opacity: 0;
    position: absolute;
    width: 1px;
    height: 1px;
  }

  .v-switch-label {
    position: absolute;
    font-weight: 900;
    color: white;
    z-index: 1;
    top: 8px;

    &.v-left {
      top: 12px;
      right: 14px;
    }
    &.v-right {
      top: 12px;
      left: 14px;
    }
  }

  .v-switch-core {
    display: block;
    position: relative;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: border-color 0.3s, background-color 0.3s;
    user-select: none;
    width: 180px !important;
    height: 39px !important;
    border-radius: 20px !important;
    background-color: #160c46;

    .v-switch-button {
      display: block;
      position: absolute;
      overflow: hidden;
      top: 0;
      left: 0;
      border-radius: 100%;
      background-color: #fff;
      z-index: 2;
      width: 100px !important;
      height: 36px !important;
      transition: transform 300ms ease 0s;
      border-radius: 20px;
    }
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.6;
  }
}

.vue-js-switch .v-switch-label {
  text-transform: uppercase;
}

.vue-js-switch .v-switch-label {
  top: 9px !important;
}
.vue-js-switch .v-switch-label::before {
  content: '';
  margin-right: 5px;
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 7.5px;
  border: 2px solid #383163;
  position: relative;
  top: 3.25px;
}

.vue-js-switch .v-switch-label.v-right {
  left: 8px;
}

.vue-js-switch .v-switch-core .v-switch-button {
  transform: translate3d(93px, 1.5px, 0);
}

.vue-js-switch.toggled .v-switch-core .v-switch-button {
  transform: translate3d(2px, 1.5px, 0) !important;
}
</style>
