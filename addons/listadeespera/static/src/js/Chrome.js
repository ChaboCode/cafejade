odoo.define('listadeespera.Chrome',function(require){
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

    const listaesperaChrome=(Chrome)=>
         class extends Chrome{
         	constructor(){
         		super(...arguments);
         		useListener('click-wait-screen',this._clickWaitlistScreen);
                useListener('click-client-new-screen',this._clickWaitclienteScreen);
               
         	}
         	_clickWaitlistScreen(){
         		if(this.mainScreen.name === 'waitlistScreen'){                
                   this.showScreen(this.start.lastScreen);
                }else{
                   this.start.lastScreen = this.mainScreen.name;
                   this.showScreen('waitlistScreen');
                }                
            }
            _clickWaitclienteScreen(){
             if(this.mainScreen.name === 'ClientwaitControlButton'){                
                   this.showScreen(this.start.lastScreen);
                }else{
                   this.start.lastScreen = this.mainScreen.name;
                   this.showScreen('ClientwaitControlButton');
                }   
            }
         };
    Registries.Component.extend(Chrome, listaesperaChrome);
    return Chrome



});