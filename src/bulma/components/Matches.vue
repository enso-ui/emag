<template>
    <modal show
        v-on="$listeners">
        <div class="box matches-box is-paddingless">
            <div class="box-header has-background-light">
                <p class="subtitle is-5">
                    {{ product.name }} - {{ product.part_number }}
                </p>
            </div>
            <div class="box-content">
                <product-card v-for="product in product.emagProducts"
                    :key="product.id"
                    :product="product"
                    @publish="publish(product)"/>
            </div>
        </div>
    </modal>
</template>

<script>
import { Modal } from '@enso-ui/modal/bulma';
import ProductCard from './ProductCard.vue';
import errorHandler from './errorHandler';

export default {
    name: 'Matches',

    inject: ['route'],

    mixins: [errorHandler],

    components: { Modal, ProductCard },

    props: {
        product: {
            type: Object,
            required: true,
        },
        state: {
            type: Object,
            required: true,
        },
        errorHandler: {
            type: Function,
            required: true,
        }
    },

    methods: {
        publish(emagProduct) {
            this.state.loading = true;

            axios.post(this.route('emag.emagProducts.publish', emagProduct.id))
                .then(({ data }) => {
                    this.state.loading = false;

                    this.product.emagOffer = data.offer;
                }).catch(this.handleError);

            this.$emit('close');
        },
    },
}
</script>

<style lang="scss">
    .matches-box {
        .box-header {
            padding: 1em;
            border-top-left-radius: inherit;
            border-top-right-radius: inherit;
        }

        .box-content {
            padding: 1em;
            max-height: 43em;
            overflow: auto;

            .box:not(:last-child) {
                margin-bottom: 0.6rem;
            }
        }
    }
</style>
