export default {
    created() {
        let errorMessage = !this.reset ? "未找到 reset 方法" : !this.loadData ? "未找到 loadData 方法" : null;
        if (errorMessage) {
            throw new Error(errorMessage);
        }
    },
    activated() {
        if (!this.hasWatch) {
            this.updateData();
        }
    },
    watch: {
        id() {
            this.hasWatch = true;
            this.updateData();
        }
    },
    deactivated() {
        this.reset();
        this.hasWatch = false;
    },
    data() {
        return {
            hasWatch: false,
            breadSplice: 3
        }
    },
    methods: {
        updateData() {
            this.$bread.splice(this.breadSplice);
            if (this.id) {
                this.loadData();
                if (!this.editBread) {
                    throw new Error("未找到 editBread 对象")
                }
                this.$bread.push(this.editBread)
            } else {
                this.reset();
                if (!this.addBread) {
                    throw new Error("未找到 editBread 对象")
                }
                this.$bread.push(this.addBread);
            }
        }
    }
}