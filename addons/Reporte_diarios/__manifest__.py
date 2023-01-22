# -*- coding: utf-8 -*-
{
    'name': "Reporte Diario odoo 15",

    'summary': """
        Incorporar el registro de reportes diarios por parte de cocina (chef)
""",

    'description': """
    Odoo carece de un formulario para realizar las anotaciones diarias.

    """,

    'author': "ogum",
    'website': "http://www.yourcompany.com",
    'category': 'N/A',
    'version': '15.0',
    'depends': ['base','mrp','hr','stock'],
    'data': [
          'security/ir.model.access.csv',
          'views/report_diario.xml',
          'views/menu.xml',
          'data/secencia.xml',     
          

    ],

}
