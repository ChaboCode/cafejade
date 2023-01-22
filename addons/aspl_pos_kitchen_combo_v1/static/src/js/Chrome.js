odoo.define('aspl_pos_kitchen_combo.Chrome', function(require) {
    'use strict';

    const Chrome = require('point_of_sale.Chrome');
    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');
    const core = require('web.core');
    var rpc = require('web.rpc');
    const { Gui } = require('point_of_sale.Gui');
    const { useListener } = require('web.custom_hooks');

    require('bus.BusService');
    var bus = require('bus.Longpolling');
    var cross_tab = require('bus.CrossTab').prototype;
    var session = require('web.session');
    const { posbus } = require('point_of_sale.utils');


    const AsplKitchenChrome = (Chrome) =>
        class extends Chrome {
            constructor(){
                super(...arguments);
                useListener('click-kitchen-screen', this._clickKitchenScreen);
                useListener('click-sync-order-screen', this._clickSyncOrderScreen);
                this.state.orderData = [];
                this.state.lastScreen = '';
            }
            _clickSyncOrderScreen(){
                if(this.mainScreen.name === 'SyncOrderScreen'){
                    this.showScreen(this.start.lastScreen);
                }else{
                    this.start.lastScreen = this.mainScreen.name;
                    this.showScreen('SyncOrderScreen');
                }
            }
            get isTicketButtonShown(){
                return this.mainScreen.name !== 'KitchenScreen';
            }
            get isKitchenScreen(){
                return this.mainScreen.name === 'KitchenScreen';
            }
            get startScreen(){
                const arr = ['cook', 'chef'];
                if(arr.includes(this.env.pos.user.kitchen_screen_user) ) {
                    return { name: 'KitchenScreen'};
                }else{
                    return super.startScreen;
                }
            }
            get isManager(){
                return this.env.pos.user.kitchen_screen_user === 'manager';
            }

            get isCashier(){
                return this.env.pos.user.kitchen_screen_user === 'cashier';
            }

            async start(){
                await super.start();
                this._pollData();
            }
            _pollData(){
                this.env.services['bus_service'].updateOption('pos.order.line',session.uid);
                this.env.services['bus_service'].onNotification(this,this._onNotification);
                this.env.services['bus_service'].startPolling();
                cross_tab._isRegistered = true;
                cross_tab._isMasterTab = true;
            }
            orderNotification(message){
                $('div.span4').remove();
                $('body').append(`<div class="span4 pull-right">
                                    <div class="alert alert-success fade">
                                    <i class="fa fa-bell"></i> ${message}
                                    </div>
                                '</div>`);
                $(".alert").removeClass("in").show();
                $(".alert").delay(200).addClass("in").fadeOut(10000);
            }
            _onNotification(notifications){
                var self = this;
                for (var item of notifications) {
                    if(item.payload.screen_display_data){
                        if(item.payload.new_order){
                            Gui.playSound('bell');
                        }
                        let categoryList = this.env.pos.user.pos_category_ids;
                        var order_data = [];
                        var allOrderLines = {};
                        _.each(item.payload.screen_display_data, function(order){
                            let localTime =  moment.utc(order.order_time).toDate();
                            order['order_time'] =  moment(localTime).format('HH:mm:ss');
                            var order_line_data = [];
                            _.each(order.order_lines,function(line){
                                allOrderLines[line.id] = line.state;
                                let domain = _.contains(['Done','Cancel'], line.state);
                                if(!domain && _.contains(categoryList, line.categ_id) && !item.payload.manager){
                                    order_line_data.push(line);
                                }else if(!domain && item.payload.manager){
                                    order_line_data.push(line);
                                }
                            });
                            order.order_lines = order_line_data;
                            order['display'] = true;
                            if(order.order_lines.length > 0){
                                order_data.push(order);
                            }
                        });
                        this.state.orderData = order_data;
                        if(allOrderLines){
                            self.updatePosScreenOrder(allOrderLines);
                        }
                    }
                    if(item.payload.remove_or_cancel){
                        self.orderNotification(item.payload.message);
                        if(this.env.pos.get_order_list().length > 0){
                            var collection_orders = this.env.pos.get_order_list()[0].collection.models;
                            for (let i = 0; i < collection_orders.length; i++){
                                let collection_order = collection_orders[i];
                                if(item.payload.order_id == collection_order.server_id){
                                    if(['delete', 'paid'].includes(item.payload.is_remove)){
                                        collection_order.server_id = false;
                                    }
                                    collection_order.destroy({ reason: 'abandon' });
                                    posbus.trigger('order-deleted');
                                }
                            }
                        }
                    }
                    if(item.payload.order_sync_data){
                        self.env.pos.set_kitchen_screen_data(item.payload.order_sync_data);
                    }
                }
            }
            updatePosScreenOrder(order_line_data){
                if(this.env.pos.get_order_list().length > 0){
                    var collection_orders = this.env.pos.get_order_list()[0].collection.models;
                    for (let i = 0; i < collection_orders.length; i++){
                        let collectionOrder = collection_orders[i];
                        if(collectionOrder.server_id){
                            for(let line of collectionOrder.orderlines.models){
                                if(line && line.server_id && order_line_data[line.server_id]){
                                    line.set_line_state(order_line_data[line.server_id]);
                                }
                            }
                        }
                    }
                }
            }
            async _closePos(){
                const arr = ['cook', 'chef'];
                if(arr.includes(this.env.pos.user.kitchen_screen_user) ) {
                    this.state.uiState = 'CLOSING';
                    this.loading.skipButtonIsShown = false;
                    this.setLoadingMessage(this.env._t('Closing ...'));
                    window.location = '/web/session/logout';
                }
                else{
                    await super._closePos();
                }
            }
            async _clickKitchenScreen(){
                if(this.mainScreen.name === 'KitchenScreen'){
                    this.showScreen(this.start.lastScreen);
                }else{
                    this.start.lastScreen = this.mainScreen.name;
                    this.showScreen('KitchenScreen', await this.env.pos.kitchenScreenData);
                }
            }
        };

    Registries.Component.extend(Chrome, AsplKitchenChrome);

    return Chrome;
});