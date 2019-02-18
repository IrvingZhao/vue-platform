import {mapState} from 'vuex';

export default {
    name: "xlb-operator-auth",
    props: {
        pageKey: {
            type: String,
            required: true
        },
        sort: {
            type: Array,
            default: null
        }
    },
    computed: {
        ...mapState("base_config", ["enableAuth"]),
    },
    render(_c) {
        let operators = this.$menu.getPageOperatorByKey(this.pageKey);
        let authOperatorKeys = operators.map((item) => item.key);
        return _c("xlb-config-slot", {
            props: {
                enabled: this.enableAuth,
                sort: this.sort,
                slotKeys: authOperatorKeys
            }
        }, this.$slots)
    }
}