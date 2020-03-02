<template>
    <div class="columns order-form">
        <div class="column is-5-tablet is-6-widescreen">
            <partners v-bind="$attrs"/>
        </div>
        <div class="column">
            <div class="columns">
                <div class="column is-narrow">
                    <div class="columns">
                        <div class="column is-narrow">
                            <form-field v-bind="$attrs"
                                :field="form.field('date')"/>
                        </div>
                        <div class="column is-narrow">
                            <form-field v-bind="$attrs"
                                :field="form.field(form.param('fulfillingAttribute'))"/>
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column is-narrow">
                            <form-field v-bind="$attrs"
                                :field="form.field('number')"/>
                        </div>
                        <div class="column is-narrow"
                             v-if="[enums.orders.Purchase, enums.orders.PurchaseReturn]
                                .includes(form.param('type'))">
                            <form-field v-bind="$attrs"
                                :field="form.field('supplier_number')"/>
                        </div>
                        <div class="column is-narrow"
                            v-else-if="enums.orders.Sale === form.param('type')">
                            <div class="field"
                                v-if="form.field('emag_number').value">
                                <label class="label">
                                    {{ i18n(form.field('emag_number').label) }}
                                </label>
                                <div class="control has-margin-small">
                                    <div class="tags has-addons" >
                                        <span class="tag is-success is-medium is-clickable"
                                            @click="openMarketplace">
                                            {{form.field('emag_number').value}}
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
                        </div>
                    </div>
                </div>
                <div class="column">
                    <actions v-on="$listeners"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { FormField } from '@enso-ui/forms/bulma';
import Partners from './Partners.vue';
import Actions from './Actions.vue';

export default {
    name: 'FormContent',

    components: { Partners, Actions, FormField },

    inject: ['i18n', 'order', 'hasLines', 'route', 'reloadOrder', 'fulfilling'],

    data: () => ({
        loading: false,
    }),

    computed: {
        ...mapState(['enums']),
        form() {
            return this.order.form;
        },
        readonlyDate() {
            return this.hasLines();
        },
    },

    watch: {
        readonlyDate: {
            handler(readonly) {
                this.form.field('date').meta.readonly = readonly;
            },
            immediate: true,
        },
    },

    methods: {
        openMarketplace() {
            const url = this.enums.emagApi.offerURL
                .replace(':orderId', this.form.field('emag_number').value)
                .replace(':apiCode', this.enums.emagApi.apiCode);

            window.open(url, '_blank').focus();
        },
        sync() {
            this.loading = true;
            this.order.processing = true;

            axios.patch(this.route(
                'commercial.sales.syncEmag',
                this.$route.params
            )).then(() => {
                this.loading = false;
                this.order.processing = false;
                this.reloadOrder();
            }).catch(error => {
                this.loading = false;
                this.order.processing = false;
                this.errorHandler(error);
            })
        }
    }
};
</script>

<style lang="scss">
    .order-form {
        .button {
            padding-left: 0.6em;
            padding-right: 0.6em;
        }

        .field > .control > .input {
            width: 10.5em;
        }
    }
</style>
