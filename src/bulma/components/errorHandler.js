export default {
    inject: ['errorHandler', 'toastr'],

    methods: {
        handleError(error) {
            this.state.loading = false;
            const { status, data } = error.response;

            if (status === 422) {
                this.toastr.error(data.message);
                return;
            }

            this.errorHandler(error);
        },
    },
};
