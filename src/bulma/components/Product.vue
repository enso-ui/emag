<template>
    <v-popover placement="right"
        trigger="click"
        ref="popover">
        <span class="tag is-table-tag is-clickable"
            v-if="!emagProducts.length">
            {{ i18n('N/A') }}
        </span>
        <span class="tag is-table-tag is-clickable is-warning"
            v-else>
            {{ i18n('Not matched') }}
        </span>
        <template v-slot:popover>
            <ul class="emag-product-actions">
                <li>
                    <a class="button is-info is-small is-bold is-fullwidth"
                        @click="match">
                        {{ i18n('find matches') }}
                    </a>
                </li>
                <li v-if="emagProducts.length">
                    <a class="button is-warning is-small is-bold is-fullwidth"
                        @click="chooseMatch = true; $refs.popover.hide()">
                        {{ i18n('choose match') }}
                    </a>
                </li>
                <li>
                    <a class="button is-success is-small is-bold is-fullwidth"
                        @click="publish">
                        {{ i18n('publish product') }}
                    </a>
                </li>
            </ul>
            <loader v-if="state.loading"/>
            <matches :product="product"
                :state="state"
                :error-handler="errorHandler"
                @close="chooseMatch = false"
                v-if="chooseMatch"/>
        </template>
    </v-popover>
</template>

<script>
import { mapState } from 'vuex';
import { VPopover } from 'v-tooltip';
import Loader from '@enso-ui/loader/bulma';
import Matches from './Matches.vue';
import errorHandler from './errorHandler';

export default {
    name: 'Product',

    mixins: [errorHandler],

    components: { VPopover, Matches, Loader },

    inject: ['i18n', 'route'],

    props: {
        product: {
            type: Object,
            required: true,
        },
    },

    data: () => ({
        chooseMatch: false,
        state: {
            loading: false,
        },
    }),

    computed: {
        ...mapState(['enums']),
        emagProducts() {
            return this.product.emagProducts;
        },
    },

    methods: {
        match() {
            this.state.loading = true;

            axios.post(this.route('emag.products.match', this.product.id))
                .then(({ data }) => {
                    const { emagProducts } = data;
                    this.product.emagProducts = emagProducts;
                    this.state.loading = false;
                }).catch(this.handleError);
        },
        publish() {
            this.state.loading = true;

            axios.post(this.route('emag.products.publish', this.product.id))
                .then(({ data }) => {
                    const { offer } = data;
                    this.product.emagOffer = offer;
                    this.state.loading = false;
                }).catch(this.handleError);
        },
    },
};
</script>

<style lang="scss">
    .emag-product-actions li:not(:last-child) .button{
        margin-bottom: 3px;
    }
</style>
