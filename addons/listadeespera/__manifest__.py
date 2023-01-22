{
    'name': 'POS Kitchen screen wait',
    'version': '1.0.0',
    'category': 'Point of Sale',
    'website': 'http://www.acespritech.com',
    'summary': "Lista de esperta la asignar una mesa",
    'description': """Crear una lista de espera en la que se asigna a las mesas""",
    'author': "ogum",
    'website': "",
    'depends': ['point_of_sale', 'pos_restaurant'],
    'data': [
        'security/ir.model.access.csv',
        'views/main_view_list.xml',
      ],
    'assets': {
        'point_of_sale.assets': [
            'listadeespera/static/src/js/ChromeWidgets/Orderscreenwaitlist.js',
            'listadeespera/static/src/js/WaitScreen/Wait_Screen.js',
            'listadeespera/static/src/js/ClientwaitScreen/Clientewaitscreen.js',
            'listadeespera/static/src/js/Chrome.js',
            'listadeespera/static/src/js/models.js',


        ],
        'web.assets_qweb': [
            'listadeespera/static/src/xml/ChromeWidgets/OrderscreenwaitlistButton.xml',
            'listadeespera/static/src/xml/WaitScreen/OrderScreenwaitlistview.xml',
            'listadeespera/static/src/xml/ClientwaitScreen/ClientwaitScreen.xml',
        ],
    },   
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: