const pageStates = {
    pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
    },
    query: {},
};
const pageMutations = {
    updatePageIndex(state, pageIndex) {
        state.pageInfo.pageIndex = pageIndex;
    },
    updatePageSize(state, pageSize) {
        state.pageInfo.pageSize = pageSize;
    },
    updateQuery(state, query) {
        state.query = query;
    }
};

export {
    pageStates,
    pageMutations
};