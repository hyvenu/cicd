import datetime

from django.db import transaction
from django.db.models import Sum, Q
from django.utils import timezone
from sequences import get_next_value

from ecommerce.models import Cart
from engine.payment_service import PaymentService
from inventory.models import ProductMaster, ProductPriceMaster, ProductImages
from sales.models import OrderRequest, OrderDetails, OrderEvents
from security.models import CustomerAddress

ORDER_STATUS_DICT = {
    '1': 'New Order',
    '2': 'Review',
    '3': 'Confirm',
    '4': 'Packing',
    '5': 'Ready to Dispatch',
    '6': 'Dispatched',
    '7': 'Out For Delivery',
    '8': 'Delivered',
    '9': 'Cancel',
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

    def check_stock(self, product, pack_type):
        pass

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
            flow.append({'order_status': '9', 'text': ORDER_STATUS_DICT['9']})
        elif current_status == 6:
            flow.append({'order_status': '7', 'text': ORDER_STATUS_DICT['8']})
            flow.append({'order_status': '9', 'text': ORDER_STATUS_DICT['9']})
        elif current_status == 7:
            flow.append({'order_status': '8', 'text': ORDER_STATUS_DICT['8']})
            flow.append({'order_status': '9', 'text': ORDER_STATUS_DICT['9']})
        elif current_status == 8:
            flow.append({'order_status': '9', 'text': ORDER_STATUS_DICT['9']})

        return flow

    def calculate_order_total(self, user_id):
        total_dict = Cart.objects.filter(user_id=user_id).aggregate(Sum('tax_amount'), Sum('sub_total'))
        return total_dict

    def get_orders(self, kwargs):
        final_list = []
        payment_service = PaymentService()
        if 'order_status' in kwargs and len(kwargs['order_status']) > 0:
            query = Q(order_status=kwargs['order_status'])
        if 'customer_id' in kwargs and len(kwargs['customer_id']) > 0:
            query = Q(customer__id=kwargs['customer_id'])

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
        )[0]
        order_data['shipping_address'] = CustomerAddress.objects.filter(id=order_data['shipping_address']).all().values()[0]
        order_data['billing_address'] = CustomerAddress.objects.filter(id=order_data['billing_address']).all().values()[0]
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
        order_total = self.calculate_order_total(user_id)
        order_request.tax_amount = order_total['tax_amount__sum']
        order_request.order_amount = order_total['sub_total__sum']
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
        return payment_data

    @transaction.atomic
    def update_order(self,order_id, order_status):
        order = OrderRequest.objects.get(id=order_id)
        order.order_status = order_status
        order.save()
        self.track_events(order_id, order_status, desc='updated status')
        return self.get_order_details(order_id)

    def track_events(self,order_id,order_status, desc=''):
        events = OrderEvents(order_id=order_id, order_status=order_status,event_date=timezone.now() ,description=desc)
        events.save()

    def get_order_amount(self, order_id):
        data = OrderRequest.objects.filter(id=order_id).all().values('order_number', 'order_amount')
        return data

    def get_order_tracking(self,order_id):
        data = OrderEvents.objects.filter(id=order_id).all().values_list()
        return data


