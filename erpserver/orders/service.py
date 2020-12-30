from django.db import transaction


class OrderService:

    def check_stock(self, product,pack_type):
        pass

    def check_status(self, order):
        pass

    @transaction.atomic
    def process_order(self, order_data):
        pass



