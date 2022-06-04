from django.db.models import Sum

from engine.db_service import custom_sql
from inventory.models import StockAdjustment, ProductPriceMaster
from purchase.models import GRNProductList
from sales.models import SalesOrderDetails
import datetime
import pandas as pd


def update_available_qty_df(x):
    stockService = StockService()
    # stockService.get_current_ob_qty()
    x['available_qty'] = stockService.get_current_ob_qty(x['product_id'], x['date'])
    return x


class StockService:

    def get_current_ob_qty(cls, product_id, date):
        """
        Function take the product id and date ,
        calculates the opening balance based on date and return the ob_qty as Integer
        """
        date_v = datetime.datetime.strptime(date, '%Y-%m-%d')
        purchase_stock = GRNProductList.objects. \
            filter(grn__invoice_date__lte=date_v, product_id=str(product_id)). \
            aggregate(
            purchase_qty=Sum('accepted_qty'))
        sold_stock = SalesOrderDetails.objects. \
            filter(po_order__po_date__date__gte='2022-04-22', po_order__po_date__date__lte=date_v,
                   product_id=str(product_id)). \
            aggregate(
            sold_qty=Sum('qty'))

        stock_adjust_qty = StockAdjustment.objects. \
            filter(date__lte=date_v, product_id=product_id). \
            aggregate(
            adjusted_qty=Sum('adjusted_qty')
        )
        if sold_stock['sold_qty'] is None:
            sold_stock['sold_qty'] = 0
        if purchase_stock['purchase_qty'] is None:
            purchase_stock['purchase_qty'] = 0
        if stock_adjust_qty['adjusted_qty'] is None:
            stock_adjust_qty['adjusted_qty'] = 0

        return int(purchase_stock['purchase_qty']) - int(sold_stock['sold_qty'])

    @classmethod
    def get_product_wise_ob_qty(cls, date):
        """
        Function takes the date and return the product list with available_qty (ob_qty) as json output
        """
        product_list_qs = ProductPriceMaster.objects.all().values('product_id', 'product__product_name')
        product_list_df = pd.DataFrame(product_list_qs)
        product_list_df.rename(columns={'product__product_name': 'product_name'}, inplace=True)
        product_list_df['available_qty'] = 0
        product_list_df['adjusted_qty'] = 0
        product_list_df['ob_qty'] = 0
        product_list_df['id'] = ""
        product_list_df['date'] = date
        product_list_df.apply(str)
        # product_list_df[['product_id','date','available_qty']].apply(update_available_qty_df,axis=1)
        product_list_df = product_list_df.reset_index()  # make sure indexes pair with number of rows
        date_v = datetime.datetime.strptime(date, '%Y-%m-%d')
        opening_balance_list = custom_sql("call usp_calculate_ob ('"+date+"','"+date+"')")
        ob_df = pd.DataFrame(opening_balance_list)
        for index, row in product_list_df.iterrows():
            # product_list_df.iloc[index]['available_qty'] =

            stock_v = StockAdjustment.objects.filter(product_id=row['product_id'], date=date_v)
            temp_variable = 0
            if stock_v.exists():
                product_list_df.at[index, 'ob_qty'] = str(stock_v[0].ob_qty)
                product_list_df.at[index, 'adjusted_qty'] = str(stock_v[0].adjusted_qty)
                product_list_df.at[index,'id'] = str(stock_v[0].id)
                # product_list_df.at[index, 'available_qty'] = stock_v.available_qty
                temp_variable = + int(stock_v[0].adjusted_qty)
            else:
                product_list_df.at[index, 'ob_qty'] = str(0)
                temp_variable = 0
                # product_list_df.at[index, 'available_qty'] = cls.get_current_ob_qty(cls, row['product_id'], row['date'])
            product_list_df.at[index, 'available_qty'] = int(ob_df.loc[ob_df['p_id'] == str(row['product_id']).replace("-","")].iloc[0]['closing']) + temp_variable
        product_list_df.apply(str)
        return product_list_df.to_dict('records')
