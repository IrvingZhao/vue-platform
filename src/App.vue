<template>
    <router-view v-if="activeRouterView"></router-view>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "app",
        computed: {
            ...mapState("base_system", ["activeRouterView"])
        },
    }
</script>

<style scoped>

</style>
