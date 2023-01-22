odoo.define('aspl_pos_kitchen_combo.ProductScreen', function(require) {
    'use strict';

    const ProductScreen = require('point_of_sale.ProductScreen')
    const PosComponent = require('point_of_sale.PosComponent');
    const ControlButtonsMixin = require('point_of_sale.ControlButtonsMixin');
    const NumberBuffer = require('point_of_sale.NumberBuffer');
    const { useListener } = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');
    const { onChangeOrder, useBarcodeReader } = require('point_of_sale.custom_hooks');
    const { useState } = owl.hooks;


    const AsplKitchenProductScreen = ProductScreen =>
        class extends ProductScreen {
            constructor() {
                super(...arguments);
                useListener('set-order-type-mode', this._setOrderTypeMode);
            }
            _setOrderTypeMode(event) {
                const { mode } = event.detail;
                this.state.orderTypeMode = mode;
            }
            async _setValue(val){
                let line = this.currentOrder.get_selected_orderline();
                if(line === undefined){
                    super._setValue(...arguments);
                    return;
                }
                if(line.state != 'Waiting' && this.state.numpadMode === 'quantity'){
                    this.showNotification('You can not change the quantity!')
                }else{
                    super._setValue(...arguments);
                }
            }
            async _onClickPay() {
                if(this.env.pos.user.kitchen_screen_user === "manager"){
                    await super._onClickPay();
                }else{
                    return;
                }
            }
            _clickCombo(product){
                this.showScreen('CreateComboScreen', {
                    product:product,
                    mode: 'new',
                });
            }
            async _getAddProductOptions(product) {
                let price_extra = 0.0;
                let draftPackLotLines, weight, description, packLotLinesToEdit;

                if (this.env.pos.config.product_configurator && _.some(product.attribute_line_ids, (id) => id in this.env.pos.attributes_by_ptal_id)) {
                    let attributes = _.map(product.attribute_line_ids, (id) => this.env.pos.attributes_by_ptal_id[id])
                                      .filter((attr) => attr !== undefined);
                    let { confirmed, payload } = await this.showPopup('ProductConfiguratorPopup', {
                        product: product,
                        attributes: attributes,
                    });

                    if (confirmed) {
                        description = payload.selected_attributes.join(', ');
                        price_extra += payload.price_extra;
                    } else {
                        return;
                    }
                }
                // Gather lot information if required.
                if (['serial', 'lot'].includes(product.tracking) && (this.env.pos.picking_type.use_create_lots || this.env.pos.picking_type.use_existing_lots)) {
                    const isAllowOnlyOneLot = product.isAllowOnlyOneLot();
                    if (isAllowOnlyOneLot) {
                        packLotLinesToEdit = [];
                    } else {
                        const orderline = this.currentOrder
                            .get_orderlines()
                            .filter(line => !line.get_discount())
                            .find(line => line.product.id === product.id);
                        if (orderline) {
                            packLotLinesToEdit = orderline.getPackLotLinesToEdit();
                        } else {
                            packLotLinesToEdit = [];
                        }
                    }
                    const { confirmed, payload } = await this.showPopup('EditListPopup', {
                        title: this.env._t('Lot/Serial Number(s) Required'),
                        isSingleItem: isAllowOnlyOneLot,
                        array: packLotLinesToEdit,
                    });
                    if (confirmed) {
                        // Segregate the old and new packlot lines
                        const modifiedPackLotLines = Object.fromEntries(
                            payload.newArray.filter(item => item.id).map(item => [item.id, item.text])
                        );
                        const newPackLotLines = payload.newArray
                            .filter(item => !item.id)
                            .map(item => ({ lot_name: item.text }));

                        draftPackLotLines = { modifiedPackLotLines, newPackLotLines };
                    } else {
                        // We don't proceed on adding product.
                        return;
                    }
                }

                // Take the weight if necessary.
                if (product.to_weight && this.env.pos.config.iface_electronic_scale) {
                    // Show the ScaleScreen to weigh the product.
                    if (this.isScaleAvailable) {
                        const { confirmed, payload } = await this.showTempScreen('ScaleScreen', {
                            product,
                        });
                        if (confirmed) {
                            weight = payload.weight;
                        } else {
                            // do not add the product;
                            return;
                        }
                    } else {
                        await this._onScaleNotAvailable();
                    }
                }
                if(product.is_combo){
                    this._clickCombo(product);
                    var is_merge = false;
                }
                var option_val = { draftPackLotLines,
                    description,
                    price_extra,
                    quantity: weight,
                    merge: is_merge };
                // NumberBuffer.reset();
                return option_val
            }
            async _clickProduct(event) {
                super._clickProduct(...arguments);
                this.sendTOKitchenFlag();
            }
            sendTOKitchenFlag(){
                if(this.currentOrder){
                    this.currentOrder.set_send_to_kitchen(false)
                }
            }
        };

    Registries.Component.extend(ProductScreen, AsplKitchenProductScreen);

    return ProductScreen;
});
