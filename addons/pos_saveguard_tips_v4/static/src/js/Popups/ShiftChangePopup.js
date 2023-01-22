odoo.define('pos_saveguard_tips.ShiftChangePopup', function(require){
    'use strict';

    const Popup = require('point_of_sale.ConfirmPopup');
    const Registries = require('point_of_sale.Registries');
    const PosComponent = require('point_of_sale.PosComponent');
    var core = require('web.core');
    let redeem;
    let point_value = 0;
    let remove_line;
    let remove_true = false;
    let entered_code;
    var rpc = require('web.rpc');

    class ShiftChangePopup extends Popup {

        constructor() {
            super(...arguments);
        }

           async willStart() {
            ////console.log("Ingresa en willStart dentro de ShiftChangePopup")
              try {
                  this.get_data_waiters_in_orders = await this.rpc({
                      model: 'pos.session',
                      method: 'get_data_waiters_in_orders',
                      args: [[this.env.pos.pos_session.id]]
                  });
                  
              } catch (error) {
                  this.error = error;
              }
          }

        cancelar() {
            this.trigger('close-popup');
        }

   

        async cambio_turno()
        {
            let self = this;
            var table = document.getElementById('waiters');
            console.log("Esto es tablee",table)
            
            //for (let row of table.rows) {
            //  for(let cell of row.cells){
            //     console.log(cell.innerText);
            //  }
            
            //}

            //let cells = table.querySelectorAll('td');
            //cells.forEach( (cell) =>  console.log(cell.innerHTML));

            //var row;
            //for (var i = 1,  row = table.rows[i]; i < table.rows.length ;i++) {
            //    console.log('here')
            //    console.log(row)
            //    console.log(row.cells)
            //    var x = row.cells[0].childNodes[0];
            //    var z = row.cells[0].childNodes[1].value; // select option field
            //    console.log(x)
            //    console.log(z)
            //}

            //table.querySelectorAll("option").forEach(opt => {
            //console.log(opt.value)
            //});
            var row
            var col
            for ( var i = 1; row = table.rows[i]; i++ ) {
             row = table.rows[i];
             for ( var j = 0; col = row.cells[j]; j++ ) {
                
                if (j == 0){
                var id_anterior = col.firstChild.nodeValue;
                 }

                if (j == 1){
                var nombre_anterior = col.firstChild.nodeValue;
                 }

                if (j == 2){
                var id_nuevo  = col.childNodes[0].value
                }


             }
             console.log(id_nuevo)
             if (id_nuevo == '0'){
              console.log("Ingresa en validacion")
              this.showNotification('Por favor ingrese el mesero para cambio de turno del usuario ' + nombre_anterior);
              return
             }


             this.rpc({
                    model: 'pos.session',
                    method: 'shift_change_waiters',
                    args: [this.env.pos.pos_session.id, id_anterior, id_nuevo],

                }).then(function(output) {
                    if (output == true){
                        //pass

                    } else {
                        self.showPopup('ErrorPopup', {
                            'title': self.env._t('Error al registrar'),
                            'body': self.env._t('Ocurrio un error al registrar el cambio de turno'),
                        });
                    }  })

                this.showNotification('Cambio de turno realizado correctamente.');
                this.trigger('close-popup');
}

            
            
            
        }
        
    };
    
    ShiftChangePopup.template = 'ShiftChangePopupLT';
    Registries.Component.add(ShiftChangePopup);
    return ShiftChangePopup;

});