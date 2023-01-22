# -*- coding: utf-8 -*-
from odoo import models, fields, api, exceptions, _
from datetime import date, datetime, time, timedelta
from odoo.fields import Date, Datetime
from odoo.tools import float_compare
import odoo.addons.decimal_precision as dp
from lxml import etree
from odoo.tools.safe_eval import safe_eval
from lxml import etree

class BaseModel(models.AbstractModel):
    _inherit = 'base'

    @api.model
    def fields_view_get(self, view_id=None, view_type='form', toolbar=False, submenu=False):
        res = super(BaseModel,self).fields_view_get(view_id, view_type, toolbar, submenu)
        permission = self.env['model.perm'].search([('model', '=', self._name)
        ], limit=1)
        if permission:
            doc = etree.XML(res['arch'])
            if self.env.user.id in permission.groups_id.mapped('users').ids or not permission.groups_id:
                if view_type == 'tree':
                    nodes_tree = doc.xpath("//tree")
                    for node in nodes_tree:
                        if permission.perm_create:
                            node.set('create', '0')
                        if permission.perm_edit:
                            node.set('edit', '0')
                        if permission.perm_delete:
                            node.set('delete', '0')
                elif view_type == 'form':
                    nodes_tree = doc.xpath("//form")
                    for node in nodes_tree:
                            if permission.perm_create:
                                node.set('create', '0')
                            if permission.perm_edit:
                                node.set('edit', '0')
                            if permission.perm_delete:
                                node.set('delete', '0')
                elif view_type == 'kanban':
                    nodes_tree = doc.xpath("//kanban")
                    for node in nodes_tree:
                        if permission.perm_create:
                            node.set('create', '0')
                        if permission.perm_edit:
                            node.set('edit', '0')
                        if permission.perm_delete:
                            node.set('delete', '0')
                res['arch'] = etree.tostring(doc)

        return res