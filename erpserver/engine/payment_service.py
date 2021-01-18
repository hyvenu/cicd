

import razorpay
from django.conf import settings
from django.db import transaction
from django.utils import timezone

from engine.models import Payments


class PaymentService:

    client = razorpay.Client(auth=(settings.RAZOR_PAY_KEY_ID,settings.RAZOR_PAY_KEY_SECRET))

    @transaction.atomic
    def verify_payment(self, data):
        payment = Payments.objects.get(payment_order_id=data['razorpay_order_id'])
        payment.razorpay_signature =  data['razorpay_signature']
        payment.razorpay_payment_id = data['razorpay_payment_id']
        payment.razorpay_order_id = data["razorpay_order_id"]
        payment.save()

        param = {
            'razorpay_signature' : data['razorpay_signature'],
            'razorpay_payment_id' : data['razorpay_payment_id'],
            'razorpay_order_id' : data['razorpay_order_id']
        }

        if self.client.utility.verify_payment_signature(param) is None:
            payment.payment_verified = True
            payment.save()
        return True

    @transaction.atomic
    def create_order(self, data):
        order_data = dict(
            amount=str(data['amount']) + '00',
            currency="INR",
            receipt=str(data["order_number"]),
            notes=dict(
                        customer=(str(data['customer_id']) + ' ' + str(data['order_number']))
                       ),
            payment_capture=0
        )
        response = self.client.order.create(order_data)
        payment = Payments(
                                order_data = order_data,
                                payment_date = timezone.now(),
                                order_number = data['order_number'],
                          )
        payment.save()
        if response['status'] == 'created':
            payment.payment_order_id = response['id']
            payment.payment_status = response['status']
            payment.save()
            return response['id']
        else:
            payment.payment_status = "failed"
            payment.save()
            return False

    def get_payment_data(self, order_number):
        payment_obj = Payments.objects.filter(order_number=order_number).all().values()
        if len(payment_obj) > 0:
            return list(payment_obj)
        else:
            return {}
