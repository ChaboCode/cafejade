odoo.define('listadeespera.wait_screen',function(require){
'use strict';
  
  const PosComponent = require('point_of_sale.PosComponent');
  const Registries = require('point_of_sale.Registries');
  const models = require('point_of_sale.models');
  class waitlistScreen extends PosComponent {
  	  constructor() {
        super (... arguments);
        this.list_wait=this.env.pos.list_wait;

      }
      back() {
      	 this.trigger('close-temp-screen');
      }
      spend(){
            alert("pasar")
      }
      assign(){
            alert("asignar")
      }
      cancel(){
        alert("cancelar")
      } 
      onClickCreate() {
        this.trigger('click-client-new-screen');
      } 
      


      
  }

  waitlistScreen.template = 'waitlistScreen';
  Registries.Component.add(waitlistScreen);
  return waitlistScreen;
});
