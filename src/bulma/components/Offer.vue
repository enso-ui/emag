<template>
    <v-popover placement="right"
        trigger="click">
        <span class="tag is-table-tag is-clickable"
            :class="offerClass"
            v-if="offer.partNumberKey">
            {{ offer.partNumberKey }}
        </span>
        <span class="tag is-table-tag is-clickable is-danger"
            v-else>
            {{ enums.emagDocumentationStatuses._get(offer.documentationStatus) }}
        </span>
        <template v-slot:popover>
            <ul class="emag-offer-actions">
                <li v-if="offer.partNumberKey">
                    <a class="button is-info is-small is-bold is-fullwidth"
                        @click="openMarketplace">
                        {{ i18n('marketplace') }}
                    </a>
                </li>
                <li v-if="offer.partNumberKey">
                    <a class="button is-info is-light is-small is-bold is-fullwidth"
                        @click="fetchPicture">
                        {{ i18n('fetch picture') }}
                    </a>
                </li>
                <template v-if="valid">
                    <li v-if="offer.active">
                        <a class="button is-warning is-small is-bold is-fullwidth"
                            @click="deactivate">
                            {{ i18n('deactivate') }}
                        </a>
                    </li>
                    <li v-else>
                        <a class="button is-success is-small is-bold is-fullwidth"
                            @click="activate">
                            {{ i18n('activate') }}
                        </a>
                    </li>
                </template>
                <li>
                    <a class="button is-primary is-small is-bold is-fullwidth"
                        @click="update">
                        {{ i18n('update') }}
                    </a>
                </li>
            </ul>
            <loader v-if="state.loading"/>
        </template>
    </v-popover>
</template>

<script>
import { mapState } from 'vuex';
import { VPopover } from 'v-tooltip';
import Loader from '@enso-ui/loader/bulma';
import errorHandler from './errorHandler';

export default {
    name: 'Offer',

    mixins: [errorHandler],

    components: { VPopover, Loader },

    inject: ['i18n', 'route'],

    props: {
        product: {
            type: Object,
            required: true,
        },
    },

    data: () => ({
        state: {
            loading: false
        },
    }),

    computed: {
        ...mapState(['enums']),
        offer() {
            return this.product.emagOffer;
        },
        valid() {
            return `${this.offer.documentationStatus}` == this.enums
                .emagDocumentationStatuses.ApprovedDocumentation;
        },
        offerClass() {
            if(this.disabled) {
                return 'is-dark';
            }

            if(`${this.offer.priceStatus}` === this.enums.emagPriceStatuses.Invalid) {
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
        activate() {
            this.state.loading = true;

            axios.patch(this.route('emag.offers.activate', this.offer.id))
                .then(this.then)
                .catch(this.handleError);
        },
        update() {
            this.state.loading = true;

            axios.patch(this.route('emag.offers.update', this.offer.id))
                .then(this.then)
                .catch(this.handleError);
        },
        deactivate() {
            this.state.loading = true;

            axios.patch(this.route('emag.offers.deactivate', this.offer.id))
                .then(this.then)
                .catch(this.handleError);
        },
        fetchPicture() {
            this.state.loading = true;

            axios.post(this.route('emag.products.fetchPicture', this.product.id))
                .then(({ data }) => {
                    this.state.loading = false;
                    this.toastr.success(data.message);
                })
                .catch(this.handleError);
        },
        then({ data }) {
            this.product.emagOffer = data.offer;
            this.state.loading = false;
        },
    },
};
</script>

<style lang="scss">
    .emag-offer-actions li:not(:last-child) .button{
        margin-bottom: 3px;
    }
</style>
