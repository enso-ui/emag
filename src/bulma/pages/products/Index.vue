<template>
    <div>
        <div class="columns is-centered is-multiline"
            v-if="ready">
            <div class="column is-3">
                <suppliers class="select-wrapper box raises-on-hover"
                    :params="params"/>
            </div>
            <div class="column is-narrow">
                <enso-filter class="box raises-on-hover"
                    :name="i18n('Publisher')"
                    icons
                    :options="publisherOptions"
                    v-model="params.publisher"
                    @input="$refs.selectFilter.clear()"/>
            </div>
            <div class="column is-3">
                <enso-select-filter class="box raises-on-hover"
                    source="administration.publishers.options"
                    :name="i18n('Publisher')"
                    ref="selectFilter"
                    :disabled="!params.publisher"
                    v-model="filters.products.publisher_id"/>
            </div>
            <div class="column is-3">
                <enso-select-filter class="box raises-on-hover"
                    :opens-bottom="true"
                    source="administration.people.options"
                    :name="i18n('Author')"
                    :params="authorParams"
                    v-model="params.authorId"/>
            </div>
            <div class="column is-narrow">
                <boolean-filter class="box raises-on-hover"
                    :name="i18n('Emag')"
                    v-model="params.emag"/>
            </div>
            <div class="column is-narrow">
                <boolean-filter class="box raises-on-hover"
                    :name="i18n('Needs matching')"
                    v-model="params.emagMatched"/>
            </div>
            <div class="column is-narrow">
                <boolean-filter class="box raises-on-hover"
                    :name="i18n('Emag Valid')"
                    v-model="params.emagValid"/>
            </div>
            <div class="column is-narrow">
                <boolean-filter class="box raises-on-hover"
                    :name="i18n('Emag Active Offer')"
                    v-model="filters.emag_offers.is_active"/>
            </div>
            <div class="column is-narrow is-3">
                <enso-select-filter class="box raises-on-hover"
                    disable-search
                    :options="enums.emagDocumentationStatuses._select()"
                    :name="i18n('Emag Documentation')"
                    v-model="filters.emag_offers.documentation_status"/>
            </div>
            <div class="column is-narrow">
                <enso-filter class="box raises-on-hover"
                     :options="enums.emagPriceStatuses._filter()"
                     :name="i18n('Emag Price')"
                     v-model="filters.emag_offers.price_status"/>
            </div>
            <div class="column is-narrow">
                <enso-interval-filter class="box raises-on-hover narrow-filter"
                    :name="i18n('Quantity')"
                    type="number"
                    v-model="intervals.inventory_stocks.quantity"/>
            </div>
            <div class="column is-narrow">
                <enso-interval-filter class="box raises-on-hover narrow-filter"
                    :name="i18n('Rotation')"
                    type="number"
                    v-model="intervals.inventory_stocks.rotation"/>
            </div>
            <div class="column is-narrow">
                <enso-date-filter class="box raises-on-hover"
                    :name="i18n('Updated')"
                    default="lastMonth"
                    v-model="params.dateInterval"
                    @update="
                        intervals.products.updated_at.min = $event.min;
                        intervals.products.updated_at.max = $event.max;
                    "/>
            </div>
        </div>
        <enso-table class="box is-paddingless raises-on-hover"
            ref="stocks"
            id="products"
            :intervals="intervals"
            :filters="filters"
            :params="params"
            @manage-positions="productId=$event.id"
            @reset="$refs.filterState.reset()">
            <template v-slot:emagOffer="{ row }">
                <offer :classes="'is-info is-raised is-bold is-clickable'"
                    :product="row"
                    v-if="row.emagOffer"/>
                <product :classes="'is-info is-raised is-bold is-clickable'"
                    :product="row"
                    v-else/>
            </template>
            <template v-slot:orderReservations="{ row }">
                <order-reservations :product="row"
                    :classes="'is-info is-raised is-bold is-clickable'"/>
            </template>
            <template v-slot:pictureUrl="{ row }">
                <figure class="image product-image is-48x48 has-vertically-centered-content">
                    <a :href="row.pictureUrl" target="_blank">
                        <img :src="row.pictureUrl" alt="cover">
                    </a>
                </figure>
            </template>
        </enso-table>
        <modal show
            v-if="productId"
            @keyup.esc="close"
            @close="close">
            <positions-manager :product-id="productId"/>
        </modal>
        <filter-state :api-version="apiVersion"
            name="product_filters"
            :filters="filters"
            :intervals="intervals"
            :params="params"
            @ready="ready = true"
            ref="filterState"/>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import {
    Modal, BooleanFilter, EnsoDateFilter, EnsoFilter,
    EnsoSelectFilter, EnsoIntervalFilter, FilterState,
} from '@enso-ui/bulma';
import { EnsoTable } from '@enso-ui/tables/bulma';
import PositionsManager from '@enso-ui/commercial/src/bulma/components/inventory/PositionsManager.vue';
import OrderReservations from '@enso-ui/commercial/src/bulma/pages/components/OrderReservations.vue';
import Suppliers from '@enso-ui/commercial/src/bulma/pages/products/components/Suppliers.vue';
import Offer from '@enso-ui/emag/src/bulma/components/Offer.vue';
import Product from '@enso-ui/emag/src/bulma/components/Product.vue';

library.add(faBoxOpen);


export default {
    name: 'Index',

    components: {
        Offer,
        Product,
        Modal,
        BooleanFilter,
        PositionsManager,
        EnsoTable,
        EnsoDateFilter,
        EnsoFilter,
        EnsoSelectFilter,
        EnsoIntervalFilter,
        Suppliers,
        OrderReservations,
        FilterState,
    },

    inject: ['i18n', 'route'],

    data() {
        return {
            apiVersion: 1.4,
            ready: false,
            productId: null,
            filters: {
                products: {
                    publisher_id: null,
                },
                emag_offers: {
                    documentation_status: null,
                    price_status: null,
                },
            },
            intervals: {
                products: {
                    updated_at: {
                        min: null,
                        max: null,
                        dateFormat: null,
                    },
                },
                inventory_stocks: {
                    quantity: {
                        min: null,
                        max: null,
                    },
                    rotation: {
                        min: null,
                        max: null,
                    },
                },
            },
            params: {
                mapping: false,
                supplierId: null,
                authorId: null,
                emag: null,
                emagValid: null,
                emagMatched: null,
                dateInterval: 'all',
            },
            authorParams: {
                is_author: true,
            },
            publisherOptions: [
                { value: true, icon: 'building', class: null },
                { value: false, icon: 'building', class: 'has-text-danger' },
            ],
        };
    },

    computed: {
        ...mapState(['meta', 'enums']),
    },

    methods: {
        close() {
            this.productId = null;
            this.$refs.stocks.fetch();
        },
    },
};
</script>

<style lang="scss">
    .narrow-filter .input-wrapper {
        width: 16em;
    }

    .image.product-image.is-48x48 > a {
        width: 48px;
        height: 48px;

        img {
            margin: auto;
            width: auto;
            height: auto;
            max-width: 48px;
            max-height: 48px;
        }
    }
</style>
