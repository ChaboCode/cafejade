odoo.define('aspl_pos_kitchen_combo.SyncOrderScreen', function (require) {
    'use strict';

    const { useState } = owl.hooks;
    const models = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');
    const IndependentToOrderScreen = require('point_of_sale.IndependentToOrderScreen');
    const NumberBuffer = require('point_of_sale.NumberBuffer');
    const { useListener, useAutofocus } = require('web.custom_hooks');
    const { posbus } = require('point_of_sale.utils');
    const { parse } = require('web.field_utils');


    class SyncOrderScreen extends IndependentToOrderScreen {
        constructor() {
            super(...arguments);
            useListener('close-order-screen', this.close);
            useListener('pay-order', this._onPayOrEdirOrder);
            useListener('cancel-order', this._onCancelOrDeleteOrder);
            useListener('delete-order', this._onCancelOrDeleteOrder);
            useListener('search', this._onSearch);
            this.searchDetails = {};
            this.filter = null;
        }
        async _onCancelOrDeleteOrder({ detail: order, type: type }) {
            let cancelNote = '';
            const string = type == 'cancel-order' ? 'cancel' : 'delete';
            const { confirmed } = await this.showPopup('ConfirmPopup', {
                title: this.env._t(string),
                body: this.env._t(
                    `Would you like to ${type == 'cancel-order' ? 'cancel' : 'delete'} selected order?`
                ),
            });
            if (confirmed) {
                if(type === 'cancel-order'){
                    const { confirmed, payload: inputNote } = await this.showPopup('TextAreaPopup', {
                        startingValue: '',
                        title: this.env._t('Add Cancel Order Reason'),
                    });
                    cancelNote = type === 'cancel-order' ? inputNote : '';
                }
                var order = await this.rpc({
                    model: 'pos.order',
                    method: 'cancel_or_delete_pos_order',
                    args: [order.order_id, cancelNote, string]
                });
            }
        }
        async _onPayOrEdirOrder({ detail: order, type: type }){
            var order = await this.rpc({
                model: 'pos.order',
                method: 'get_table_draft_orders_for_payment',
                args: [order.order_id]
            });
            delete order[0].floor;
            delete order[0].table;
            delete order[0].table_id;
            var newOrder = await new models.Order({}, { pos: this.env.pos, json: order[0]});
            await newOrder.set_is_from_sync_screen(true);
            newOrder.set_send_to_kitchen(true);
            await this.env.pos.get("orders").add(newOrder);
            await newOrder.save_to_db();
            await this.env.pos.set('selectedOrder', newOrder, {});
            await this.showScreen('PaymentScreen');
            this.render()
        }
        _onSearch(event) {
            Object.assign(this.searchDetails, event.detail);
            this.render();
        }
        get DbOrders() {
            return this.env.pos.kitchenScreenData;
        }
        get clients() {
            if (this.state.query && this.state.query.trim() !== '') {
                return this.env.pos.db.search_orders(this.state.query.trim());
            }
        }
        get filteredOrders() {
            const filterCheck = (order) => {
                if (this.filter && this.filter !== 'All Orders') {
                       const screen = order.get_screen_data();
                    return this.filter === this.constants.screenToStatusMap[screen.name];
                }
                return true;
            };
            const { fieldName, searchTerm } = this.searchDetails;
            const searchField = this._getSearchFields()[fieldName];
            const searchCheck = (order) => {
                if (!searchField) return true;
                const repr = searchField.repr(order);
                if (repr === null) return true;
                if (!searchTerm) return true;
                return repr && repr.toString().toLowerCase().includes(searchTerm.toLowerCase());
            };
            const predicate = (order) => {
                return searchCheck(order);
            };
            return this.DbOrders.filter(predicate);
        }
        getDate(order) {
            return moment(order.order_time).format('YYYY-MM-DD hh:mm A');
        }
        getTotal(order) {
            return this.env.pos.format_currency(order.total);
        }
        getSearchOrderSyncConfig() {
            return {
                searchFields: new Map(
                    Object.entries(this._getSearchFields()).map(([key, val]) => [key, val.displayName])
                ),
                filter: { show: true, options: this._getFilterOptions() },
                defaultSearchDetails: this.searchDetails,
                defaultFilter: this.filter,
            };
        }
        _getSearchFields() {
            const fields = {
                ORDER_REFERENCE: {
                    repr: (order) => order.pos_reference,
                    displayName: this.env._t('Receipt/Ref'),
                    modelField: 'pos_reference',
                },
                ORDER_DATE: {
                    repr: (order) => moment(order.order_time).locale('en').format('YYYY-MM-DD hh:mm A'),
                    displayName: this.env._t('Order Date(YYYY-MM-DD hh:mm A)'),
                    modelField: 'order_time',
                },
                CUSTOMER: {
                    repr: (order) => order.customer,
                    displayName: this.env._t('Customer'),
                    modelField: 'customer',
                },
                TABLE: {
                    repr: (order) => order.table,
                    displayName: this.env._t('Table'),
                    modelField: 'table',
                },
                FLOOR: {
                    repr: (order) => order.floor,
                    displayName: this.env._t('Floor'),
                    modelField: 'floor',
                },
            };
            return fields;
        }
        _getFilterOptions() {
            const orderStates = this._getOrderStates();
            return orderStates;
        }
        _getOrderStates() {
            const states = new Map();
            states.set('ALL_ORDERS', {
                text: this.env._t('All Orders'),
            });
            return states;
        }
        get_orderlines_from_order(line_ids){
            var self = this;
            var orderLines = [];
            return new Promise(function (resolve, reject) {
                rpc.query({
                    model: 'pos.order.line',
                    method: 'search_read',
                    domain: [['id', 'in', line_ids]],
                }).then(function (order_lines) {
                    resolve(order_lines);
                })
            });
        }
    }
    SyncOrderScreen.template = 'SyncOrderScreen';
    SyncOrderScreen.defaultProps = {
        destinationOrder: null,
        reuseSavedUIState: false,
        ui: {},
    };

    Registries.Component.add(SyncOrderScreen);

    return SyncOrderScreen;
});
