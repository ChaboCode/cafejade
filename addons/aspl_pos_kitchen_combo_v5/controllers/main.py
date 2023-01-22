# -*- coding: utf-8 -*-
#################################################################################
# Author      : Acespritech Solutions Pvt. Ltd. (<www.acespritech.com>)
# Copyright(c): 2012-Present Acespritech Solutions Pvt. Ltd.
# All Rights Reserved.
#
# This program is copyright property of the author mentioned above.
# You can`t redistribute it and/or modify it.
#
#################################################################################
from odoo.http import request
from odoo.addons.web.controllers.main import Home
from odoo.addons.bus.controllers.main import BusController


class Home(Home):

    def _login_redirect(self, uid, redirect=None):
        user_id = request.env['res.users'].sudo().browse(uid)
        if user_id.kitchen_screen_user in ('cook','chef','hostess') and user_id.default_pos:
            pos_session = request.env['pos.session'].sudo().search(
                [('config_id', '=', user_id.default_pos.id), ('state', '=', 'opening_control')])
            if not pos_session:
                session_id = user_id.default_pos.open_session_cb()
                if user_id.default_pos.cash_control:
                    pos_session.write({'opening_balance': True})
                pos_session.action_pos_session_open()
            redirect = '/pos/ui?config_id=' + str(user_id.default_pos.id)
        return super(Home, self)._login_redirect(uid, redirect=redirect)


class KitchenScreenController(BusController):
    def _poll(self, dbname, channels, last, options):
        """Add the relevant channels to the BusController polling."""
        channels = list(channels)
        if options.get('pos.order.line'):
            ticket_channel = (
                request.db,
                'pos.order.line',
                options.get('pos.order.line')
            )
            channels.append(ticket_channel)
        return super(KitchenScreenController, self)._poll(dbname, channels, last, options)
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: