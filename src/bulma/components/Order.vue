<template>
    <div class="field">
        <label class="label">
            {{ i18n(form.field('client_order_reference').label) }}
        </label>
        <div class="control has-margin-small">
            <div class="tags has-addons">
                <span class="tag is-success is-medium is-clickable"
                    @click="openMarketplace">
                    {{ form.field('client_order_reference').value }}
                </span>
                <a class="tag is-info is-medium"
                    :class="{ 'is-loading': loading }"
                    :disabled="fulfilling()"
                    @click="sync">
                    <span class="icon">
                        <fa icon="sync"/>
                    </span>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'EmagOrder',

    inject: ['i18n', 'order', 'reloadOrder', 'route', 'fulfilling'],

    data: () => ({
        loading: false,
    }),

    computed: {
        ...mapState(['enums']),
        form() {
            return this.order.form;
        },
    },

    methods: {
        openMarketplace() {
            const url = this.enums.emagApi.orderUrl
                .replace(':orderId', this.form.field('client_order_reference').value)
                .replace(':apiCode', this.enums.emagApi.apiCode);

            window.open(url, '_blank').focus();
        },
        sync() {
            this.loading = true;
            this.order.processing = true;

            axios.patch(this.route(
                'commercial.sales.syncEmag',
                this.$route.params,
            )).then(() => {
                this.loading = false;
                this.order.processing = false;
                this.reloadOrder();
            }).catch((error) => {
                this.loading = false;
                this.order.processing = false;
                this.errorHandler(error);
            });
        },
    },
};
</script>
