<template>
    <modal show
        v-on="$listeners">
        <div class="box" style="width: 100%;">
            <h5 class="subtitle is-6">
                {{ i18n("Choose for") }} ᵒ {{ product.name }} ᵒ {{ product.part_number }}
            </h5>
            <hr>
            <div
                 v-for="product in emagProducts">
                <div class="columns">
                    <div class="column">
                        <article class="media">
                            <figure class="media-left">
                                <p class="image is-128x128">
                                    <img :src="product.remote.images[0].url"
                                        v-if="product.remote.images.length">
                                    <img src="/images/not-available-circle.svg" alt="N/A"
                                        v-else>
                                </p>
                            </figure>
                            <div class="media-content">
                                <div class="content">
                                    <p>
                                        <strong>
                                            <a :href="product.remote.product_url" target="_blank">
                                                {{ product.remote.name }}
                                            </a>
                                        </strong>
                                        <br>
                                        {{ product.remote.owner }} ᵒ {{ attribute(product, 'Autor:') }}
                                        <br>
                                        <strong>{{ product.remote.part_number }}</strong>
                                    </p>
                                </div>
                            </div>
                            <div class="media-right aligner">
                                <a class="button is-success is-small is-bold has-margin-medium"
                                   @click="$emit('matched', product)">
                                    {{ i18n('choose') }}
                                </a>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
import { Modal } from '@enso-ui/modal/bulma';

export default {
    name: 'EmagProduct',

    inject: ['errorHandler', 'i18n', 'route'],

    components: { Modal },

    props: {
        product: {
            type: Object,
            required: true,
        },
    },

    computed: {
        emagProducts() {
            return this.product.emag_products;
        }
    },

    methods: {
        attribute(product, name) {
            let attribute =  Object.entries(product.remote.characteristics)
                .find(attribute => attribute[1].name === name);

            return attribute ? attribute[1].values[0] : '';
        },
    },
}
</script>

<style lang="scss" scoped>

    article {
        border: 1px solid transparent;

        .media-right .button {
            visibility: hidden;
        }
    }

    article:hover {
        border: 1px solid #d0d0d0;

        .media-right .button {
            visibility:visible;
        }
    }

    .aligner {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 8em;
    }
</style>
