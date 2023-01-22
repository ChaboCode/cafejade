odoo.define('pos_saveguard_tips.CashInOutStatementPopup', function(require){
	'use strict';

	const Popup = require('point_of_sale.ConfirmPopup');
	const Registries = require('point_of_sale.Registries');
	const PosComponent = require('point_of_sale.PosComponent');


	class CashInOutStatementPopup extends Popup {

		constructor() {
            super(...arguments);            
        }


    async willStart() {
      ////console.log("Ingresa en willStart dentro de CashInOutStatementPopup")
              try {
                  this.get_data_waiters = await this.rpc({
                      model: 'pos.session',
                      method: 'get_data_waiters',
                      args: [[this.env.pos.pos_session.id]]
                  });
                  
              } catch (error) {
                  this.error = error;
              }
          }

		cancel() {
			this.trigger('close-popup');
		}

		mounted(){
			$('#statement_error').hide();
		}

		print_cash_in_out_statement(){
			let self = this;

			let selected_cashier = $('#cashier').val();
			let session_id = self.env.pos.pos_session.id;
			let date = new Date();
			var dateString = date.toISOString(); 

				this.rpc({
					model: 'pos.entrada.salida',
					method: 'get_statement_data',
					args: [1,selected_cashier,session_id],
				}).then(function(output){
					self.showTempScreen('StatementReportScreen',{
						statement_data:output,
						date:dateString,
					});
					self.trigger('close-popup')
				});
			}

		}
	
	CashInOutStatementPopup.template = 'CashInOutStatementPopup';

	Registries.Component.add(CashInOutStatementPopup);

	return CashInOutStatementPopup;

});