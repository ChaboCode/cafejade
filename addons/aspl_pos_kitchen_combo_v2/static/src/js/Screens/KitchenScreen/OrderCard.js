odoo.define('aspl_pos_kitchen_combo.OrderCard', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');
    const { useListener } = require('web.custom_hooks');

    class OrderCard extends PosComponent {
        constructor() {
            super(...arguments);
            useListener('click-line-state',this._clickLineState);
        }
        get headerClass(){
            return '#8bc34a';
        }
        get imageUrl() {
            return `/aspl_pos_kitchen_combo/static/src/img/table.png`;
        }
        get orderStateColor(){
            if(this.props.order.order_state == 'Start'){
                return '#4CAF50';
            }else if(this.props.order.order_state == 'Done'){
                return '#03a9f4';
            }else if(this.props.order.order_state == 'Deliver'){
                return '#795548';
            }
        }
        async clickOrderState(){
            var lineState = '';
            if(this.props.order.order_state == 'Start'){
                this.props.order.order_state = 'Done';
                lineState = 'Preparing';
            }else if(this.props.order.order_state == 'Done'){
                this.props.order.order_state = 'Deliver';
                lineState = 'Delivering';
            }else if(this.props.order.order_state == 'Deliver'){
                this.props.order.order_state = 'Complete';
                lineState = 'Done';
            }
            await this.rpc({
                model: 'pos.order.line',
                method: 'update_all_orderline_state',
                args: [{'order_state': this.props.order.order_state,
                        'line_state': lineState,
                        'order_id': this.props.order.order_id}],
            });
            _.each(this.props.order.order_lines,function(line){
                line.state = lineState;
            });
            this.render();
        }
        _clickLineState(){
            var stateList = []
            var order_state = '';
            _.each(this.props.order.order_lines,function(line){
                stateList.push(line.state)
            });
            if(_.contains(stateList, 'Waiting')){
                order_state = 'Start'
            }else if(_.contains(stateList, 'Preparing')){
                order_state = 'Done'
            }else{
                order_state = 'Deliver'
            }
            if(this.props.order.order_state != order_state){
                this.props.order.order_state = order_state
            }
            this.render();
        }
        async printOrder(){
//                //console.log("this.env.pos.config::::::", this.env.pos.config.other_devices)
            if (this.env.pos.proxy.printer || (this.env.pos.config.other_devices && this.env.pos.config.epson_printer_ip)) {
                const report = this.env.qweb.renderToString('OrderPrint',
                                    Object.assign({
                                        order: this.props.order
                                    })
                                );
                const printResult = await this.env.pos.proxy.printer.print_receipt(report);
                //console.log("this.env.pos.config::::::", printResult)
                if (printResult.successful) {
                    return true;
                } else {
                    const { confirmed } = await this.showPopup('ConfirmPopup', {
                        title: printResult.message.title,
                        body: 'Do you want to print using the web printer?',
                    });
                    if (confirmed) {
                        // We want to call the _printWeb when the popup is fully gone
                        // from the screen which happens after the next animation frame.
                        await nextFrame();
                    }
                    return false;
                }
            }
        }
    }
    OrderCard.template = 'OrderCard';

    Registries.Component.add(OrderCard);

    return OrderCard;
});
