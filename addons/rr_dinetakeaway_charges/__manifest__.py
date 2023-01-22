# -*- coding: utf-8 -*-
##############################################################################
#
#    Copyright © 2022 RSqaure Solutions.
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as published
#    by the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################

{
    'name': "Pos Restaurant - DineIn/Take Away(Delivery Charges)",

    'summary': """
         Pos Restaurant Dine In/Take Away with Delivery Charges.""",

    'description': """
        This Module add dine in /takeaway facility in point of sale.
        with delivery charges for takeaway.
    """,

    'author': "RSquare It Solutions",
    'website': "https://rsaquare.github.io",
    'license':'OPL-1',	
    'category': 'Pos',
    'version': '15.0',
    'images': [],
    'depends': ['pos_restaurant'],
    'images': ['static/description/icon.png'], 
    'live_test_url' : 'https://youtu.be/_18-HMviIy8',
    'data': [
        "data/point_of_sale_data.xml",
        "views/pos_order_view.xml",
    ],
    'assets': {
        'point_of_sale.assets': [
          '/rr_dinetakeaway_charges/static/src/js/models.js',
          '/rr_dinetakeaway_charges/static/src/js/dine_takeaway.js',
          '/rr_dinetakeaway_charges/static/src/js/dine_in_button.js',
          '/rr_dinetakeaway_charges/static/src/js/takeaway_button.js',
        ],
        'web.assets_qweb': [
            '/rr_dinetakeaway_charges/static/src/xml/*.xml',
        ],
    },
     "price"                :  13,
     "currency"             :  "USD",
    
    
}
