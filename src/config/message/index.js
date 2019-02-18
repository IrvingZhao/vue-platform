import Vue from 'vue';
import VueI18n from "vue-i18n";

import ZH from './zh';

Vue.use(VueI18n);

const message = {
    zh: ZH
};

let i18n;

const getI18n = () => {
    if (!i18n) {
        i18n = new VueI18n({
            locale: "zh",
            messages: message
        });
    }
    return i18n;
};

export default {
    getI18n
}