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

from odoo import models, fields, api, _



class ProductTemplate(models.Model):
    _inherit = "product.template"

    is_combo = fields.Boolean("Is Combo")
    only_in_combo = fields.Boolean(string="Bloquear en vista PDV", default=False)
    product_combo_ids = fields.One2many('product.combo', 'product_tmpl_id')


class ProductCombo(models.Model):
    _name = 'product.combo'
    _description = 'Product Combo'

    #Mod by Luigi Tolayo
    #def _add_domain(self):
    #    pos_product_ids = self.env['product.product'].search([('available_in_pos', '=', True)])
    #    if pos_product_ids:
    #        domain = [('id', 'in', pos_product_ids.ids)]
    #    else:
    #        domain = [('id', '=', -1)]
    #    return domain

    sequence = fields.Integer(string="Sequencia")
    display_name = fields.Char('Display Name', require=True)
    product_tmpl_id = fields.Many2one('product.template')
    require = fields.Boolean("Required", Help="Don't select it if you want to make it optional")
    product_ids = fields.One2many('pos.combo.line.line', 'product_combo_ids')
    no_of_items = fields.Integer("No. of Items", default=1)
    replaceable = fields.Boolean("Replaceable", Help="Select it if you want to make it replaceable")
    base_price = fields.Integer("Base Price", default=0)
    
    def get_combolines_by_sequence(self,combo_line_ids):
        print("Esto es combo_line_ids",combo_line_ids)
        registros = self.env['product.combo'].search([('id','in',combo_line_ids)],order='sequence asc')
        print("Esto es registros",registros.ids)
        bandera = False
        for line in registros:
            if line.sequence == False:
                bandera = True
                print("Esto es line",line)
        if bandera == True:
            registros_nuevos = self.env['product.combo'].search([('id','in',combo_line_ids)],order='id asc')
            print("Esto es registros_nuevos",registros_nuevos.ids)
            return registros_nuevos.ids
        
        return registros.ids


class PosComboLine(models.Model):
    _name = "pos.combo.line"
    _description = "Point of Sale Combo Lines"
    _rec_name = "product_id"

    product_id = fields.Many2one('product.product', string='Product', required=True, change_default=True)
    price = fields.Float(string='Unit Price', digits=0)
    extraPriceProduct = fields.Float(string='Precio extra', digits=0)
    quantityNewProduct = fields.Integer(string='Cantidad')
    qty = fields.Float('Quantity', digits='Product Unit of Measure', default=1)
    order_line_id = fields.Many2one('pos.order.line', string='Order Line Ref', ondelete='cascade', required=True)
    product_uom_id = fields.Many2one('uom.uom', string='Product UoM', related='product_id.uom_id')
    full_product_name = fields.Char('Full Product Name')
    bom_id = fields.Integer(string='Bom Id')
    categoryName = fields.Char('Category Name')
    categoryId = fields.Integer(string='Category Id')
    replaceable = fields.Boolean(string='Is replaceable')
    replacePrice = fields.Float(string='Replace Price', digits=0)
    customisePrice = fields.Float(string='Customise Price', digits=0)
    require = fields.Boolean(string='Is Require')
    max = fields.Float('Max Quantity', digits='Product Unit of Measure')
    is_replaced = fields.Boolean(string='Is Replaced')
    replaced_product_id = fields.Many2one('product.product', string='Replaced Product')
    mo_id = fields.Integer(string='Manufacture Order Id', default=False)

class ProductComboLineLine(models.Model):
    _name = 'pos.combo.line.line'
    _description = 'Product Combo line of line'

    product_id = fields.Many2one('product.product',string="Producto")
    quantity = fields.Integer(string="Cantidad")
    quantity_uom = fields.Many2one(string="Unidad de medida",related="product_id.uom_id")
    price_extra = fields.Float(string="Precio extra $")
    product_combo_ids = fields.Many2one('product.combo', string="Products")

    @api.onchange('product_id')
    def _onchange_product_id(self):
        if self.product_id:
            self.product_id.sale_ok = True
            self.product_id.available_in_pos = True
            self.product_id.only_in_combo = True

    def get_price_product(self, product_related,registry_related):
        print("Esto es product_related",product_related)
        print("Esto es registry_related",registry_related)
        registro = self.env['pos.combo.line.line'].search([('product_combo_ids','=',registry_related),('product_id','=',product_related)])
        print("Esto es registro",registro)
        return registro.price_extra

    def get_quantity_new_product(self, product_related,registry_related):
        print("Esto es product_related",product_related)
        print("Esto es registry_related",registry_related)
        registro = self.env['pos.combo.line.line'].search([('product_combo_ids','=',registry_related),('product_id','=',product_related)])
        print("Esto es registro",registro)
        return registro.quantity
    