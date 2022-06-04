import json
import re

import razorpay
from django.conf import settings
from django.db import transaction
from django.utils import timezone
#from ..notification.notificationservice import NotificationService
from .notifi import NotificationService
from engine.models import Payments



class PaymentService:

    client = razorpay.Client(auth=(settings.RAZOR_PAY_KEY_ID,settings.RAZOR_PAY_KEY_SECRET))

    @transaction.atomic
    def verify_payment(self, data,):
        payment = Payments.objects.get(payment_order_id=data['response']['razorpay_order_id'])
        payment.razorpay_signature =  data['response']['razorpay_signature']
        payment.razorpay_payment_id = data['response']['razorpay_payment_id']
        payment.razorpay_order_id = data['response']["razorpay_order_id"]
        payment.save()

        param = {
            'razorpay_signature' : data['response']['razorpay_signature'],
            'razorpay_payment_id' : data['response']['razorpay_payment_id'],
            'razorpay_order_id' : data['response']['razorpay_order_id']
        }

        if self.client.utility.verify_payment_signature(param) is None:
            payment.payment_verified = True
            payment.save()
            # notification = NotificationService()
            # notification.send_email(data['prefill']['email'],data['prefill']['name'])
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
        if str(data['payment_method']) == '1':
            payment = Payments(
                order_data=order_data,
                payment_date=timezone.now(),
                order_number=data['order_number'],
            )
            payment.save()
            return data['order_number']

        else:
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

    def refund_order(self,order_number):
        payment = Payments.objects.get(order_number=order_number)
        payment_id = payment.razorpay_payment_id
        p = re.compile('(?<!\\\\)\'')
        json_str = payment.order_data
        json_str = p.sub('\"', json_str)
        order_data = json.loads(json_str)
        payment_amount = int(order_data['amount'])
        resp = self.client.payment.refund(payment_id, payment_amount,payment_capture=0)
        return resp

    def get_payment_data(self, order_number):
        payment_obj = Payments.objects.filter(order_number=order_number).all().values()
        if len(payment_obj) > 0:
            return list(payment_obj)
        else:
            return {}

    def update_payment(self,order_number,order_amount):
        payment = Payments.objects.filter(order_number=order_number,payment_verified=False)

        if payment.exists():
            payment.update(payment_verified=True,payment_date=timezone.now())
            return True
        else:
            raise Exception("Payment Information Not Found");


