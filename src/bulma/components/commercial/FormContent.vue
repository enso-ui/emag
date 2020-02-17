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
                            <div class="control is-flex">
                                <form-field :field="form.field('emag_number')"
                                    v-bind="$attrs"/>
                                <a class="button sync-control"
                                    :class="{ 'is-loading': loading }"
                                    @click="sync">
                                    <span class="icon">
                                        <fa icon="sync"/>
                                    </span>
                                </a>
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

    inject: ['i18n', 'order', 'hasLines', 'route', 'reloadOrder'],

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

            &.sync-control {
                margin-top: 2em;
            }
        }

        .field > .control > .input {
            width: 10.5em;
        }
    }
</style>
