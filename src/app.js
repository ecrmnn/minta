'use strict';

const Vue = require('vue/dist/vue');
const regexgen = require('regexgen');
const Clipboard = require('clipboard');

new Vue({
  el: '#app',

  data() {
    return {
      items: [],
      newItem: '',
      selectedItemIndex: -1,
      copyFeedback: false
    }
  },

  created() {
    new Clipboard('.copy');

    this.$nextTick(() => this.$refs.input.focus());
  },

  computed: {
    regex() {
      if (/\\u(\w{4})/g.test(regexgen(this.items).toString())) { // Works only for UTF-16 hex
        return regexgen(this.items).toString()
          .replace(/\\\u(\w{4})/g, (undefined, utf8) => String.fromCharCode(parseInt(utf8, 16)));
      }
      else {
        return regexgen(this.items).toString();
      }
    }
  },

  methods: {
    add() {
      if (this.newItem.length && this.items.indexOf(this.newItem) === -1) {
        this.items.push(this.newItem);
        this.newItem = '';

        this.selectedItemIndex = this.items.length - 1;
      }
    },

    remove(index) {
      this.items = this.items.filter((item, _index) => _index !== index);
    },

    triggerCopyFeedback() {
      this.copyFeedback = true;

      setTimeout(() => this.copyFeedback = false, 650);
    },

    selectItem(event) {
      if (event.keyCode === 40) {
        this.selectNext();
      } else if (event.keyCode === 38) {
        this.selectPrevious();
      } else if (event.keyCode === 46 || event.metaKey && event.keyCode === 8) {
        this.deleteSelected();
      }
    },

    selectNext() {
      this.selectedItemIndex++;

      if (this.selectedItemIndex >= this.items.length) {
        this.selectedItemIndex = 0;
      }
    },

    selectPrevious() {
      this.selectedItemIndex--;

      if (this.selectedItemIndex === -1) {
        this.selectedItemIndex = this.items.length - 1;
      }
    },

    deleteSelected() {
      if (this.selectedItemIndex !== -1) {
        this.remove(this.selectedItemIndex);
      }
    },

    showSelectedItemIndex() {
      this.selectedItemIndex = 0;
    },

    hideSelectedItemIndex() {
      this.selectedItemIndex = -1;
    }
  }
});