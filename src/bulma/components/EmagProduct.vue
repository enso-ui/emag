<template>
    <modal show
        v-on="$listeners">
        <div class="box" style="width: 100%;">
            <h5 class="subtitle is-6">
                {{ i18n("Choose") }}
            </h5>
            <hr>
            <div
                 v-for="product in emagProducts">
                <div class="columns">
                    <div class="column">
                        <article class="media">
                            <figure class="media-left">
                                <p class="image is-128x128">
                                    <img :src="product.remote.images[0].url">
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
                            <div class="media-right">
                                <a class="button is-success is-small is-bold is-fullwidth"
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
        emagProducts: {
            type: Array,
            default: null,
        },
    },

    methods: {
        attribute(product, name) {
            debugger
            let attribute =  Object.entries(product.remote.characteristics)
                .find(attribute => attribute[1].name === name);

            return attribute ? attribute[1].values[0] : '';
        },
    },
}
</script>

<style scoped>

</style>
