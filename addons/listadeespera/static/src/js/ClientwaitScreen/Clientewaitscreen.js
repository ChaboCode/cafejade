odoo.define('listadeespera.clientwaitscreenButton',function(require){
'use strict';

  const { useState } = owl;
  const PosComponent = require('point_of_sale.PosComponent');
  const Registries = require('point_of_sale.Registries');

  const { useListener } = require('web.custom_hooks');    
  const { useAsyncLockedMethod } = require('point_of_sale.custom_hooks');
  const models = require('point_of_sale.models');
  //models.load_fields('restaurant.floor', ['name', 'id']);
  
 
  class ClientwaitControlButton extends PosComponent {     

        constructor() {
            super(...arguments);
            this.changes={}
             this.lockedSaveChanges=useAsyncLockedMethod(this.saveChanges)
             useListener('save-changes', this.lockedSaveChanges);
        }
        back() {
         this.trigger('close-temp-screen');
        }
        onsave(){
          let processedChanges={}
          for (let [key,value] of Object.entries(this.changes)){
            processedChanges[key]=value
          }

          this.rpc({
                    model: 'list.wait',
                    method:'create_from_ui',
                    args: [processedChanges]
                })
         // models.load_fields('list.wait', ['cliente_id','telefono','no_clientes','tiempo_espera','piso_id','mesa_sugerida_id','mesa_asignada_ids','status']);
         // console.log("termino")
          //this.trigger('click-wait-screen');
          location.reload()


          //this.trigger('save-changes',{processedChanges})

         // console.log(processedChanges)
        }
        captureclient(event){
            event.target.value=event.target.value.toUpperCase()
            this.changes[event.target.name]=event.target.value            
        }
        capturephone(event){        
          this.changes[event.target.name]=event.target.value 
        }
        captureNoclient(event){
            //var client=event.target.value    
            // this.rpc({
            //     model:'list.wait',
            //     method:'get_tables_free',
            //     args:[client]
            // }).then(function(data){
            //     //console.log(data)

            // });
            this.changes[event.target.name]=event.target.value
            //console.log(event)

        }
        capturetime(event){
            this.changes[event.target.name]=event.target.value          

        }
        // async saveChanges(event){
        //     try{
        //         let partnerid =await this.rpc({
        //             model: 'list.wait',
        //             method:'create_from_ui',
        //             args: []
        //         })

        //     }catch(error){

        //     }

        // }



  }
  ClientwaitControlButton.template = 'ClientwaitControlButton';

  Registries.Component.add(ClientwaitControlButton);

  return ClientwaitControlButton;
});