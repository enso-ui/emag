<template>
    <div class="box has-padding-large">
        <article class="media has-vertically-centered-content">
            <figure class="media-left">
                <p class="image is-128x128">
                    <img :src="product.imageUrl">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <div>
                        <a :href="product.url" target="_blank">
                            <strong>
                                {{ product.name }}
                            </strong>
                        </a>
                    </div>
                    <div>
                        {{ i18n('Brand') }}: {{ product.owner }}
                    </div>
                    <div class="is-inline">
                        {{ i18n('Part Number') }}: {{ product.partNumber }}
                    </div>
                </div>
            </div>
            <div class="media-right aligner">
                <a class="button is-success is-small is-bold"
                @click="$emit('publish')">
                    {{ i18n('publish') }}
                </a>
            </div>
        </article>
    </div>
</template>

<script>
export default {
    name: 'ProductCard',

    inject: ['i18n'],

    props: {
        product: {
            type: Object,
            required: true,
        },
    },
};
</script>

<style lang="scss">
    .matches-box {
        .box {
            border: 1px solid transparent;
            &:hover {
                border-color: blue;
            }
        }

        article {
            .media-right .button {
                visibility: hidden;
            }
        }

        article:hover {
            .media-right .button {
                visibility:visible;
            }
        }
    }
</style>