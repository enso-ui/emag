<template>
    <v-popover placement="right"
        :disabled="disabled"
        trigger="click"
        v-if="offer">
        <span class="tag is-clickable is-table-tag"
              v-if="offer.partNumberKey"
              :class="offerClass">
            {{ offer.partNumberKey }}
        </span>
        <template v-slot:popover>
            <div class="emag-offer">
                <ul class="actions">
                    <li v-if="offer.partNumberKey">
                        <a class="button is-info is-small is-bold is-fullwidth"
                           @click="openMarketplace">
                            {{ i18n('marketplace') }}
                        </a>
                    </li>
                    <li v-if="!offer.published">
                        <a class="button is-success is-small is-bold is-fullwidth"
                           @click="publishMatched">
                            {{ i18n('publish') }}
                        </a>
                    </li>
                    <template v-else>
                        <li v-if="!offer.active">
                            <a class="button is-success is-small is-bold is-fullwidth"
                               @click="activate">
                                {{ i18n('activate') }}
                            </a>
                        </li>
                        <template v-else>
                            <li>
                                <a class="button is-success is-small is-bold is-fullwidth"
                                   @click="updatePrice">
                                    {{ i18n('update price') }}
                                </a>
                            </li>
                            <li>
                                <a class="button is-primary is-small is-bold is-fullwidth"
                                   @click="updateStock">
                                    {{ i18n('update stock') }}
                                </a>
                            </li>
                            <li>
                                <a class="button is-warning is-small is-bold is-fullwidth"
                                   @click="deactivate">
                                    {{ i18n('deactivate') }}
                                </a>
                            </li>
                        </template>
                    </template>
                </ul>
                <loader size="small"
                    v-if="loading"/>
            </div>
        </template>
    </v-popover>
    <v-popover placement="right"
        trigger="click"
        v-else>
        <span class="tag is-table-tag is-clickable">
            {{ i18n('N/A') }}
        </span>
        <template v-slot:popover>
            <div class="emag-offer">
                <ul class="actions">
                    <li>
                        <a class="button is-info is-small is-bold is-fullwidth"
                           @click="matchProduct">
                            {{ i18n('match') }}
                        </a>
                    </li>
                    <li>
                        <a class="button is-success is-small is-bold is-fullwidth"
                           @click="publishNew">
                            {{ i18n('publish new') }}
                        </a>
                    </li>
                </ul>
            </div>
        </template>
    </v-popover>
</template>

<script>
import { mapState } from 'vuex';
import { VPopover } from 'v-tooltip';
import Loader from '@enso-ui/loader/bulma';

export default {
    name: 'EmagOffer',

    components: { VPopover, Loader },

    inject: ['errorHandler', 'i18n', 'route'],

    props: {
        productId: {
            type: Number,
            required: true,
        },
        offer: {
            type: Object,
            default: null,
        },
    },

    data: () => ({
        loading: false,
    }),

    computed: {
        ...mapState(['enums']),
        disabled() {
            return !!this.offer.published &&
                `${this.offer.documentationStatus}` !== this.enums.emagDocumentationStatuses.ApprovedDocumentation;
        },
        offerClass() {
            if(this.disabled) {
                return 'is-dark';
            }

            if(`${this.offer.priceStatus}` === this.enums.emagPriceStatuses.Invalidprice) {
                return 'is-danger';
            }

            if(this.offer.active) {
                return 'is-success';
            }

            return 'is-warning';
        }
    },

    methods: {
        openMarketplace() {
            window.open(this.offer.uri, '_blank').focus();
        },
        matchProduct() {
            this.loading = true;

            axios.post(this.route('emag.offers.match', this.productId))
                .then(this.then)
                .catch(this.handleError);
        },
        activate() {
            this.loading = true;

            axios.patch(this.route('emag.offers.activate', this.offer.id))
                .then(this.then)
                .catch(this.handleError);
        },
        publishMatched() {
            this.loading = true;

            axios.patch(this.route('emag.offers.publish', this.offer.id))
                .then(this.then)
                .catch(this.handleError);
        },
        updatePrice() {
            this.loading = true;

            axios.patch(this.route('emag.offers.updatePrice', this.offer.id))
                .then(this.then)
                .catch(this.handleError);
        },
        updateStock() {
            this.loading = true;

            axios.patch(this.route('emag.offers.updateStock', this.offer.id))
                .then(this.then)
                .catch(this.handleError);
        },
        deactivate() {
            this.loading = true;

            axios.patch(this.route('emag.offers.deactivate', this.offer.id))
                .then(this.then)
                .catch(this.handleError);
        },
        publishNew() {
            this.loading = true;

            axios.post(this.route('emag.products.publish', this.productId))
                .then(this.then)
                .catch(this.handleError);
        },
        then({ data }) {
            this.$toastr.success(data.message);
            this.loading = false;
            this.$emit('updated');
        },
        handleError(error) {
            this.loading = false;
            const { status, data } = error.response;

            if (status === 422) {
                this.$toastr.error(data.message);
                return;
            }

            this.errorHandler(error);
        },
    },
};
</script>

<style lang="scss">
    .emag-offer .actions li:not(:last-child) .button{
        margin-bottom: 3px;
    }
</style>
