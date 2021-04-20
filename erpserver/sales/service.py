import datetime

from django.db import transaction
from django.db.models import Sum, Q
from django.utils import timezone
from sequences import get_next_value

from ecommerce.models import Cart
from engine.payment_service import PaymentService
from engine.pdf_service import get_pdf
from engine.promo_code_service import PromoCodeService
from inventory.models import ProductMaster, ProductPriceMaster, ProductImages, ProductStock
from sales.models import OrderRequest, OrderDetails, OrderEvents, SalesOrderRequest, SalesOrderDetails
from security.models import CustomerAddress
from store.models import StoreShipLocations, Store
import ast


ORDER_STATUS_DICT = {
    '1': 'New Order',
    '2': 'Review',
    '3': 'Confirm',
    '4': 'Packing',
    '5': 'Ready to Dispatch',
    '6': 'Dispatch Confirm',
    '7': 'Out For Delivery',
    '8': 'Delivered',
    '9': 'Cancel',
    '10': 'Cancel Request',
    '11': 'Order Cancel Review',
    '12': 'Cancel Confirm',
    '13': 'Refund Initiate',
    '14' : 'Refund Completed',
    '15' : 'Cancel Rejected'

}

PAYMENT_METHOD_DICT = {
    '1': 'COD',
    '2': 'Credit Card',
    '3': 'Debit Card',
    '4': 'Net Banking',
    '5': 'UPI',

}
DELIVERY_METHOD_DICT = {
    '1': 'Door Delivery',
    '2': 'Self Pick',
    '3': 'Logistic'
}


class OrderService:

    def check_stock(self, product, pack_type,qty):
        pass

    def get_order_location_map(self, ship_address):
        store_id = StoreShipLocations.objects.filter(pin_code=ship_address['pin_code']).all().values('store_id')
        if store_id.exists():
            return store_id[0]['store_id']
        return None

    def check_order_flow(self, current_status):
        flow = []

        if current_status == 1:
            flow.append({'order_status': '2', 'text': ORDER_STATUS_DICT['2']})
            flow.append({'order_status': '9', 'text': ORDER_STATUS_DICT['9']})
        elif current_status == 2:
            flow.append({'order_status': '3', 'text': ORDER_STATUS_DICT['3']})
            flow.append({'order_status': '9', 'text': ORDER_STATUS_DICT['9']})
        elif current_status == 3:
            flow.append({'order_status': '4', 'text': ORDER_STATUS_DICT['4']})
            flow.append({'order_status': '9', 'text': ORDER_STATUS_DICT['9']})
        elif current_status == 4:
            flow.append({'order_status': '5', 'text': ORDER_STATUS_DICT['5']})
            flow.append({'order_status': '9', 'text': ORDER_STATUS_DICT['9']})
        elif current_status == 5:
            flow.append({'order_status': '6', 'text': ORDER_STATUS_DICT['6']})
            flow.append({'order_status': '9', 'text': ORDER_STATUS_DICT['9']})
        elif current_status == 6:
            flow.append({'order_status': '7', 'text': ORDER_STATUS_DICT['8']})
            flow.append({'order_status': '9', 'text': ORDER_STATUS_DICT['9']})
        elif current_status == 7:
            flow.append({'order_status': '8', 'text': ORDER_STATUS_DICT['8']})
            flow.append({'order_status': '9', 'text': ORDER_STATUS_DICT['9']})
        elif current_status == 8:
            flow.append({'order_status': '9', 'text': ORDER_STATUS_DICT['9']})
        elif current_status == 10:
            flow.append({'order_status': '11', 'text': ORDER_STATUS_DICT['11']})
            flow.append({'order_status': '15', 'text': ORDER_STATUS_DICT['15']})
        elif current_status == 11:
            flow.append({'order_status': '12', 'text': ORDER_STATUS_DICT['12']})
            flow.append({'order_status': '15', 'text': ORDER_STATUS_DICT['15']})
        elif current_status == 12:
            flow.append({'order_status': '13', 'text': ORDER_STATUS_DICT['13']})
            flow.append({'order_status': '15', 'text': ORDER_STATUS_DICT['15']})
        elif current_status == 13:
            flow.append({'order_status': '14', 'text': ORDER_STATUS_DICT['14']})
            flow.append({'order_status': '15', 'text': ORDER_STATUS_DICT['15']})
        elif current_status == 14:
            flow.append({'order_status': '14', 'text': ORDER_STATUS_DICT['14']})

        return flow

    def calculate_order_total(self, user_id, promo_code=None):
        promo_service = PromoCodeService()
        total_dict = Cart.objects.filter(user_id=user_id).aggregate(Sum('tax_amount'), Sum('sub_total'))
        if promo_code is not None and len(promo_code) > 0:
            order_amount = total_dict['sub_total__sum']
            discount_amount, order_amount = promo_service.apply_promo_code(user_id, promo_code, order_amount)
            total_dict['sub_total__sum'] = order_amount
            total_dict['discount_amount'] = discount_amount
        return total_dict

    def get_orders(self, kwargs):
        final_list = []
        payment_service = PaymentService()
        if 'order_status' in kwargs and len(kwargs['order_status']) > 0:
            query = Q(order_status=kwargs['order_status'])
        if 'customer_id' in kwargs and len(kwargs['customer_id']) > 0:
            query = Q(customer__id=kwargs['customer_id'])
        if 'store_id' in kwargs and len(kwargs['store_id']) > 0:
            query = Q(store_id=kwargs['store_id'])
            store = Store.objects.filter(id=kwargs['store_id']).all().values()
            if store.exists() and store[0]['is_head_office']:
                query = query.add(Q(order_status=1),Q.OR)


        order_list = OrderRequest.objects.filter(query) \
            .all().values(
            'id',
            'order_raised_date',
            'customer__id',
            'customer__first_name',
            'customer__email',
            'order_status',
            'shipping_address',
            'billing_address',
            'payment_method',
            'delivery_method',
            'order_amount',
            'tax_amount',
            'order_number',
            'store',
            'promo_code',
        )
        for order in order_list:
            order['order_status_text'] = ORDER_STATUS_DICT[str(order['order_status'])]
            order['shipping_address'] = CustomerAddress.objects.filter(id=order['shipping_address']).all().values()[0]
            order['billing_address'] = CustomerAddress.objects.filter(id=order['billing_address']).all().values()[0]
            order['payment_data'] = payment_service.get_payment_data(order['order_number'])
            final_list.append(order)
        return final_list

    def get_order_details(self, order_id):
        detail_list = []
        order_list = []
        payment_service = PaymentService()
        order_data = OrderRequest.objects.filter(id=order_id) \
            .all().values(
            'id',
            'order_raised_date',
            'customer__id',
            'customer__first_name',
            'customer__email',
            'order_status',
            'shipping_address',
            'billing_address',
            'payment_method',
            'delivery_method',
            'order_amount',
            'tax_amount',
            'order_number',
            'store',
            'store__store_name',
        )[0]
        order_data['shipping_address'] = \
        CustomerAddress.objects.filter(id=order_data['shipping_address']).all().values()[0]
        order_data['billing_address'] = CustomerAddress.objects.filter(id=order_data['billing_address']).all().values()[
            0]
        order_data['order_status_text'] = ORDER_STATUS_DICT[str(order_data['order_status'])]
        order_data['order_flow'] = self.check_order_flow(order_data['order_status'])
        order_data['payment_data'] = payment_service.get_payment_data(order_data['order_number'])
        order_det_list = OrderDetails.objects.filter(order_id=order_id) \
            .all().values(
            'id',
            'product',
            'pack_unit',
            'unit_price',
            'quantity',
            'tax',
            'sub_total',
        )
        for order in order_det_list:
            order['product_images'] = list(ProductImages.objects.filter(product_id=order['product']).all().values(
                'product_id',
                'image'
            ))

            order['product'] = ProductMaster.objects.filter(id=order['product']).all().values()[0]
            order['pack_unit'] = ProductPriceMaster.objects.filter(id=order['pack_unit']).all().values(
                'sell_price',
                'tax',
                'qty',
                'unit__id',
                'unit__PrimaryUnit',
            )[0]

            detail_list.append(order)

        order_data['order_details'] = detail_list

        order_list.append(order_data)
        return order_list

    @transaction.atomic
    def process_order(self, order_data, user_id):
        order_request = OrderRequest()
        order_request.order_raised_date = datetime.datetime.now()
        order_request.shipping_address_id = order_data['shipping_address']
        order_request.billing_address_id = order_data['billing_address']
        order_request.customer_id = user_id
        order_request.order_number = get_next_value('order_number', 100000000)
        order_request.order_status = 1
        order_request.payment_method = order_data['payment_method']
        order_request.delivery_method = order_data['delivery_method']

        if order_data['promo_code'] is not None and len(order_data['promo_code']) > 0:
            order_request.promo_code = order_data['promo_code']
            promo_service = PromoCodeService()
            promo_service.update_promo_use_count(order_request.promo_code)
            order_total = self.calculate_order_total(user_id,order_request.promo_code)
            order_request.tax_amount = order_total['tax_amount__sum']
            order_request.order_amount = round(order_total['sub_total__sum'])
        else:
            order_total = self.calculate_order_total(user_id,None)
            order_request.tax_amount = order_total['tax_amount__sum']
            order_request.order_amount = round(order_total['sub_total__sum'])
        # order_request.store_id = get_order_mapping()
        order_request.save()


        cart_items = Cart.objects.filter(user_id=user_id).all()
        for items in cart_items:
            order_detail = OrderDetails()
            order_detail.order = order_request
            order_detail.product = items.product
            order_detail.pack_unit = items.pack_unit
            order_detail.unit_price = items.unit_price
            order_detail.quantity = items.qty
            order_detail.tax = items.tax
            order_detail.sub_total = items.sub_total
            order_detail.save()

        self.track_events(order_request.id, 1)
        payment_service = PaymentService()
        payment_data = {
            "amount": order_request.order_amount,
            "order_number": order_request.order_number,
            "customer_id": order_request.customer_id
        }
        res = payment_service.create_order(payment_data)
        payment_data['payment_order_id'] = res

        # map order location
        ship_address = CustomerAddress.objects.filter(id=order_data['shipping_address']).all().values()
        if ship_address.exists():
            order_request.store_id = self.get_order_location_map(ship_address[0])
            order_request.save()
        return payment_data

    @transaction.atomic
    def update_order(self, order_id, order_status):
        order = OrderRequest.objects.get(id=order_id)
        order.order_status = order_status
        if int(order.order_status) == 5:
            if self.update_stock(order_id):
                order.save()
                self.track_events(order_id, order_status, desc='updated status')
            else:
                self.track_events(order_id, order_status, desc='Stock Not Available')
                raise Exception('Stock not available')
        else:
            order.save()
            self.track_events(order_id, order_status, desc='updated status')
        return self.get_order_details(order_id)

    def track_events(self, order_id, order_status, desc=''):
        events = OrderEvents(order_id=order_id, order_status=order_status, event_date=timezone.now(), description=desc)
        events.save()

    def get_order_amount(self, order_id):
        data = OrderRequest.objects.filter(id=order_id).all().values('order_number', 'order_amount')
        return data

    def get_order_tracking(self, order_id):
        data = OrderEvents.objects.filter(id=order_id).all().values_list()
        return data

    def get_pdf_invoice(self, order_number):
        param = '?OrderNumber=' + order_number
        report_name = 'RptSalesInvoice.pdf'
        file_name = order_number + '.pdf'
        out_files = get_pdf(report_name, file_name, param)
        return out_files

    def update_stock(self,order_id):
        order_details = OrderDetails.objects.filter(order_id=order_id).all().values(
            'id',
            'product_id',
            'pack_unit__unit_id',
            'unit_price',
            'quantity',
            'tax',
            'sub_total',
        )
        item_available = True
        for item in order_details:
            required_qty = item['quantity']
            stock = ProductStock.objects.filter(product_id=item['product_id'],unit=item['pack_unit__unit_id']).order_by('batch_expiry').all().values()
            for stock_item in stock:
                available_qty = int(stock_item['quantity'])
                if required_qty <= 0:
                    break
                if available_qty > required_qty > 0:
                    available_qty = available_qty - required_qty

                    stock_obj = ProductStock.objects.get(id=stock_item['id'])
                    stock_obj.quantity=available_qty
                    stock_obj.save()

                    order_Det_obj = OrderDetails.objects.get(id=item['id'])
                    order_Det_obj.batch_expiry=stock_item['batch_expiry']
                    order_Det_obj.batch_number=stock_item['batch_number']
                    order_Det_obj.save()
                    required_qty = 0
                else:
                    required_qty = required_qty - available_qty

                    stock_obj = ProductStock.objects.get(id=stock_item['id'])
                    stock_obj.quantity = available_qty
                    stock_obj.save()

                    order_Det_obj = OrderDetails.objects.get(id=item['id'])
                    order_Det_obj.batch_expiry = stock_item['batch_expiry']
                    order_Det_obj.batch_number = stock_item['batch_number']
                    order_Det_obj.save()

            if required_qty <=0:
                item_available = True
            else:
                item_available = False

        if not item_available:
            return False
        else:
            return True

    @classmethod
    @transaction.atomic()
    def save_sales_order(cls, sales_data):
        if 'id' in sales_data:
            sales_order_req = SalesOrderRequest.objects.get(id=sales_data['id'])
        else:
            sales_order_req = SalesOrderRequest()
            sales_order_req.po_number = cls.generate_po_number()

        sales_order_req.po_type = sales_data['po_type']
        sales_order_req.shipping_address = sales_data['shipping_address']
        sales_order_req.transport_type = sales_data['transport_type']
        sales_order_req.po_date = sales_data['po_date']
        sales_order_req.po_raised_by = sales_data['po_raised_by']
        sales_order_req.pr_number = sales_data['pr_number']
        sales_order_req.vendor_id = sales_data['vendor_id']
        sales_order_req.payment_terms = sales_data['payment_terms']
        sales_order_req.other_reference = sales_data['other_reference']
        # sales_order_req.terms_of_delivery = sales_data['terms_of_delivery']
        sales_order_req.note = sales_data['note']
        sales_order_req.sub_total = sales_data['sub_total']
        sales_order_req.packing_perct = sales_data['packing_perct']
        sales_order_req.packing_amount = sales_data['packing_amount']
        sales_order_req.total_amount = sales_data['total_amount']
        sales_order_req.sgst = sales_data['sgst']
        sales_order_req.cgst = sales_data['cgst']
        sales_order_req.igst = sales_data['igst']
        sales_order_req.invoice_amount = sales_data['invoice_amount']
        sales_order_req.terms_conditions = sales_data['terms_conditions']
        sales_order_req.store_id = sales_data['store_id']
        sales_order_req.save()

        product_list = ast.literal_eval(sales_data['po_products'])
        for item in product_list:
            if 'id' in item and len(item['id']) > 0:
                po_product = SalesOrderDetails.objects.get(id=item['id'])
            else:
                po_product = SalesOrderDetails()
            po_product.po_order = sales_order_req
            po_product.product_id = item['product_id']
            po_product.product_code = item['product_code']
            po_product.product_name = item['product_name']
            po_product.unit_id = item['unit_id']
            po_product.qty = item['qty']
            po_product.delivery_date = str(item['delivery_date'])[0:10]
            po_product.unit_price = item['unit_price']
            po_product.gst = item['gst']
            po_product.amount = item['amount']
            po_product.disc_percent = item['disc_percent']
            po_product.disc_amount = item['disc_amount']
            po_product.gst_amount = item['gst_amount']
            po_product.total_amount = item['total_amount']
            po_product.save()
        return sales_order_req.po_number

    @classmethod
    def get_po_details(cls, po_id):
        final_list = []
        po_data_list = SalesOrderRequest.objects.filter(id=po_id).all().values(
            'id',
            'po_type',
            'po_number',
            'pr_number',
            'po_raised_by',
            'po_date',
            'shipping_address',
            'transport_type',
            'vendor_id',
            'vendor__vendor_name',
            'vendor__vendor_code',
            'payment_terms',
            'other_reference',
            'terms_of_delivery',
            'note',
            'sub_total',
            'packing_perct',
            'packing_amount',
            'total_amount',
            'sgst',
            'cgst',
            'igst',
            'invoice_amount',
            'terms_conditions',
            'store_id',
        )[0]

        po_data_list['order_details'] = list(SalesOrderDetails.objects.filter(po_order_id=po_id).all().values(
            "id",
            "product_id",
            "product_name",
            "product_code",
            "unit_id",
            "qty",
            "delivery_date",
            "unit_price",
            "gst",
            "amount",
            "disc_percent",
            "disc_amount",
            "gst_amount",
            "total_amount",
        ))
        return po_data_list

    @classmethod
    def get_po_list(cls):
        po_data_list = SalesOrderRequest.objects.all().values(
            'id',
            'po_type',
            'po_date',
            'po_number',
            'pr_number',
            'shipping_address',
            'transport_type',
            'vendor_id',
            'vendor__vendor_code',
            'vendor__vendor_name',
            'payment_terms',
            'other_reference',
            'terms_of_delivery',
            'note',
            'sub_total',
            'packing_perct',
            'packing_amount',
            'total_amount',
            'sgst',
            'cgst',
            'igst',
            'invoice_amount',
            'terms_conditions',
            'store_id',
        )
        return list(po_data_list)

    @classmethod
    @transaction.atomic
    def delete_po_product(cls, po_prd_id):
        po_prd_object = SalesOrderDetails.objects.get(id=po_prd_id)
        po_prd_object.delete()
        return True