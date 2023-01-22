#-*- coding: utf-8 -*-

from odoo import models, fields, api,_
from odoo.exceptions import UserError

class Fabricacion_Reporte_Diario(models.Model):

    _name = 'reporte.diario_empleados'

    _inherit=["portal.mixin","mail.thread","mail.activity.mixin"]

    _rec_name='secuencia'

    _description="Reporte Diario"   

    secuencia=fields.Char(string="Nombre",required=True,copy=False,readonly=False,index=True,default=lambda self: _('New'))

    @api.model
    def create(self,vals):
        if vals.get('secuencia', _('New')) == _('New'):
            vals['secuencia']=self.env['ir.sequence'].next_by_code('sequence.reporte.diario_empleados') or _('New')
        result=super(Fabricacion_Reporte_Diario,self).create(vals)
        return result    

    estado = fields.Selection([ 
        ('draft', 'Borrador'),
        ('confirm', 'Confirmado'),
        ('done','Hecho'),
        ('cancel','Cancel')
        ],'Estado', default='draft')

    fecha = fields.Datetime(string='Fecha')

    nombre_chef = fields.Many2one('res.users',string='Nombre del Chef')

    faltante_producto = fields.One2many('productos.faltantes',
        'producto_linea_id',
        string='Producto Faltante',
    )

    personal_completo = fields.Text(
        string='Personal completo',
    )

    empleados_retardos_ids = fields.One2many(
        'empledos.retardos',
        'empleados_linea_id',
        string='Retardos',
    )

    comentario = fields.Text(
        string='Comentario',
    )

    def action_confirm(self):
        for recod in self:
            recod.estado='confirm'
    def action_update(self):
        for recod in self:
            recod.estado='done'
    def action_cancel(self):
        for recod in self:
            recod.estado='cancel'
    def action_reverze(self):
        for recod in self:
            recod.estado='draft'

    @api.model
    def fields_view_get(self,view_id=None,view_type='Form',toolbar=None,submenu=None):
        res=super().fields_view_get(view_id=view_id,view_type=view_type,toolbar=toolbar,submenu=submenu)
        res['edit']=False
        return res






class Reporte_producto(models.Model):

    _name='productos.faltantes'

    producto_id = fields.Many2one('product.template',string='Producto')

    cantidad = fields.Integer(string='Cantidad',required=True)

    producto_linea_id = fields.Many2one('reporte.diario_empleados',string='Producto id')

class Reporte_retardos(models.Model):

    _name='empledos.retardos'

    empleados_id = fields.Many2one('hr.employee',string='Empleado')

    nota = fields.Text(string='Nota')

    empleados_linea_id = fields.Many2one('reporte.diario_empleados',string='Empleado id')








