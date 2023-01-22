odoo.define('aspl_pos_kitchen_combo.ComboProductItem', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');
    const { useState } = owl.hooks;
    const { useListener } = require('web.custom_hooks');
    var rpc = require('web.rpc');

    class ComboProductItem extends PosComponent {
        constructor() {
            super(...arguments);
            this.state = useState({});
        }

        async willStart() {
            console.log("Ingresa en willStart de combos")
            console.log(this.props.product)
            var self = this;
            var product_related = this.props.product.id
            var registry_related = this.env.pos.selectedComboCategoryId

            if (registry_related === undefined) {
              registry_related = this.env.pos.defaultComboCategoryId
            }

            //console.log("Esto es product_related y registry_related")
            //console.log(product_related)
            //console.log(registry_related)
            const price_extra = await this.rpc({
                model: 'pos.combo.line.line',
                method: 'get_price_product',
                args: [0, product_related,registry_related],
            });
            this.props.product.price_product_extra = price_extra
            self.state.price_product_extra = price_extra

            const quantity_new = await this.rpc({
                model: 'pos.combo.line.line',
                 method: 'get_quantity_new_product',
                 args: [0, product_related,registry_related],
             });
             this.props.product.quantityNew = quantity_new

        }


        productClicked() {
            this.trigger('click-combo-product', { product: this.props.product, price_extra: this.props.product.price_product_extra, quantityNew: this.props.product.quantityNew});
        }
        clearClicked() {
            this.trigger('click-clear', { product: this.props.product});
        }
        get imageUrl() {
            const product = this.props.product;
            return `/web/image?model=product.product&field=image_128&id=${product.id}&write_date=${product.write_date}&unique=1`;
        }
        get quantity(){
            return this.props.productQuantityLine ? this.props.productQuantityLine[this.props.product.id] : 0;
        }
        get price_extra_quantity_new(){
            var product_related = this.props.product.id
            var registry_related = this.env.pos.selectedComboCategoryId
            var self = this

            if (registry_related === undefined) {
              registry_related = this.env.pos.defaultComboCategoryId
            }
            console.log("11111111111111111111111111111111111111111111111111111")
            console.log(this.props.product)

            const price_extra_promise = this.rpc({
                model: 'pos.combo.line.line',
                method: 'get_price_product',
                args: [0, product_related,registry_related],
            });
            
            const quantity_new_promise =  this.rpc({
                model: 'pos.combo.line.line',
                 method: 'get_quantity_new_product',
                 args: [0, product_related,registry_related],
             });

            price_extra_promise.then((value) => {
                quantity_new_promise.then((value2) => {
                self.props.product.price_product_extra = value
                self.props.product.quantityNew = value2
                self.state.price_product_extra = value
                self.state.quantityNew = value2
             })
            })
            
        }

    }
    ComboProductItem.template = 'ComboProductItem';

    Registries.Component.add(ComboProductItem);

    return ComboProductItem;
});
