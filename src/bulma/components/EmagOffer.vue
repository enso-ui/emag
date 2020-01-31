<template>
    <div>
        <v-popover placement="right"
            :disabled="popoverDisabled"
            trigger="hover"
            v-if="product.emagPartNumber">
            <span class="tag pnk is-clickable is-table-tag"
                  v-if="product.emagPartNumber"
                  :class="offerClass"
                  @click="openEmagPage">
                {{ product.emagPartNumber }}
            </span>
            <template v-slot:popover>
                <loader size="small"
                        v-if="loading"/>
                <ul v-else>
                    <li v-if="!product.emagOfferPublished">
                        <a class="button is-success is-small is-bold is-fullwidth has-margin-small"
                            @click="publishOffer">
                            {{ i18n('publish') }}
                        </a>
                    </li>
                    <li v-if="product.emagOfferPublished === 1 && !product.emagOfferActive">
                        <a class="button is-success is-small is-bold is-fullwidth has-margin-small"
                            @click="activateOffer">
                            {{ i18n('activate') }}
                        </a>
                    </li>
                    <li v-if="product.emagOfferPublished && product.emagOfferActive">
                        <a class="button is-primary is-small is-bold is-fullwidth has-margin-small"
                           @click="updatePrice">
                            {{ i18n('update price') }}
                        </a>
                    </li>
                    <li v-if="product.emagOfferPublished && product.emagOfferActive">
                        <a class="button is-info is-small is-bold is-fullwidth has-margin-small"
                           @click="updateStock">
                            {{ i18n('update stock') }}
                        </a>
                    </li>
                    <li v-if="product.emagOfferPublished && product.emagOfferActive">
                        <a class="button is-warning is-small is-bold is-fullwidth has-margin-small"
                            @click="deactivateOffer">
                            {{ i18n('deactivate') }}
                        </a>
                    </li>
                </ul>
            </template>
        </v-popover>
        <span class="icon is-small has-text-info has-padding-right-large is-clickable"
              @click="matchProduct"
              v-tooltip="i18n('Match')"
              v-else>
            {{ i18n('N/A') }}
        </span>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { VPopover, VTooltip } from 'v-tooltip';
import Loader from '@enso-ui/loader/bulma';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHandPaper, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

library.add(faHandPaper, faPencilAlt);

export default {
    name: 'EmagOffer',

    components: { VPopover, Loader },
    directives: { tooltip: VTooltip },

    inject: ['errorHandler', 'i18n', 'route'],

    props: {
        product: {
            type: Object,
            required: true,
        },
    },

    data: () => ({
        loading: false,
    }),

    computed: {
        ...mapState(['enums']),
        popoverDisabled() {
            return `${this.product.emagDocStatus}`
                !== this.enums.emagDocStatuses.ApprovedDocumentation;
        },
        offerClass() {
            if(this.popoverDisabled) {
                return 'is-dark';
            }

            if(`${this.product.emagPriceStatus}` === this.enums.emagPriceStatuses.Invalidprice) {
                return 'is-danger';
            }

            if(this.product.emagOfferActive) {
                return 'is-success';
            }

            return 'is-warning'; //! this.product.emagOfferActive & default
        }
    },

    methods: {
        openEmagPage() {
            const uri = `https://marketplace.emag.ro/offers/list?filters_pp%5Bproduct_identifier%5D=${this.product.emagPartNumber}`;
            window.open(uri, '_blank').focus();
        },
        matchProduct() {
            this.loading = true;

            axios.post(this.route('emag.offers.match', this.product.id))
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.loading = false;
                    this.$emit('updated');
                }).catch(this.handleError);
        },
        activateOffer() {
            this.loading = true;

            axios.patch(this.route('emag.offers.activate', this.product.emagOfferId))
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.loading = false;
                    this.$emit('updated');
                }).catch(this.handleError);
        },
        publishOffer() {
            this.loading = true;

            axios.patch(this.route('emag.offers.publish', this.product.emagOfferId))
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.loading = false;
                    this.$emit('updated');
                }).catch(this.handleError);
        },
        updatePrice() {
            this.loading = true;

            axios.patch(this.route('emag.offers.updatePrice', this.product.emagOfferId))
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.loading = false;
                    this.$emit('updated');
                }).catch(this.handleError);
        },
        updateStock() {
            this.loading = true;

            axios.patch(this.route('emag.offers.updateStock', this.product.emagOfferId))
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.loading = false;
                    this.$emit('updated');
                }).catch(this.handleError);
        },
        deactivateOffer() {
            this.loading = true;

            axios.patch(this.route('emag.offers.deactivate', this.product.emagOfferId))
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.loading = false;
                    this.$emit('updated');
                }).catch(this.handleError);
        },
        handleError(error) {
            const { status, data } = error.response;

            if (status === 422) {
                this.$toastr.error(data.message);
                this.loading = false;
                return;
            }

            this.errorHandler(error);
        },
    },
};
</script>

<style lang="scss">
    .tag.pnk {
        padding: 0 5px;
        font-size: 0.9em;
        height: unset;
    }
</style>
