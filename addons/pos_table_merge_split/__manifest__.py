# -*- coding: utf-8 -*-

{
    'name': 'Pos Table Merge and Split',
    'version': '1.0',
    'category': 'Point of Sale',
    'sequence': 6,
    'author': 'Webveer',
    'summary': 'Allows you to merge and split table in restaurant.',
    'description': """

=======================
Allows you to merge and split table in restaurant.

""",
    'depends': ['pos_restaurant'],
    'data': [
        'views/views.xml',
        'views/templates.xml'
    ],
    'qweb': [
        'static/src/xml/pos.xml',
    ],
    'images': [
        'static/description/merge.jpg',
    ],
    'installable': True,
    'website': '',
    'auto_install': False,
    'price': 49,
    'currency': 'USD',
}
