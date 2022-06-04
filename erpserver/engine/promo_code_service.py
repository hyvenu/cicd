from django.db.models import Sum
from django.utils import timezone

from ecommerce.models import Cart
from store.models import ProductCampaigns


class PromoCodeService:

    def apply_promo_code(self, user_id, promo_code, order_amount):
        order_total = order_amount
        disc_amount, order_amount = self.verify_promo_code(promo_code, user_id, order_total)
        return disc_amount, order_amount

    def apply_counter_promo_code(self, user_id, promo_code, order_amount):
        order_total = order_amount
        disc_amount, order_amount = self.verify_counter_promo_code(promo_code, user_id, order_total)
        return disc_amount, order_amount

    def verify_promo_code(self, promo_code, user_id, total_amount):
        disc_amount = 0
        promo_obj = ProductCampaigns.objects.filter(code=promo_code).all()
        if promo_obj.exists():
            promo_obj = promo_obj.all().values()[0]
            if promo_obj['offer_type'] == "Counter Sale" or promo_obj['offer_type'] == "Both":
                if promo_obj['start_time'] <= timezone.now() <= promo_obj['end_time'] and promo_obj['use_count'] < \
                        promo_obj['max_use']:
                    if promo_obj['type'] == 'PERCENTAGE':
                        disc_amount = (float(total_amount) * float(promo_obj['value']) / 100)
                        if total_amount > float(promo_obj['min_order_amount']):
                            total_amount = total_amount - disc_amount
                            return disc_amount, total_amount
                        else:
                            return 0, total_amount
                    if promo_obj['type'] == 'AMOUNT':
                        disc_amount = float(promo_obj['value'])
                        if float(total_amount) > float(promo_obj['min_order_amount']):
                            total_amount = total_amount - disc_amount
                            return disc_amount, total_amount
                        else:
                            return None
                else:
                    return None
            else:
                return None
        else:
            return None

    def verify_counter_promo_code(self, promo_code, user_id, total_amount):
        disc_amount = 0
        promo_obj = ProductCampaigns.objects.filter(code=promo_code).all()
        if promo_obj.exists():
            promo_obj = promo_obj.all().values()[0]
            if promo_obj['offer_type'] == "Counter Sale" or promo_obj['offer_type'] == "Both":
                if promo_obj['start_time'] <= timezone.now() <= promo_obj['end_time'] and promo_obj['counter_sale'] < \
                        promo_obj['max_use']:
                    if promo_obj['type'] == 'PERCENTAGE':
                        disc_amount = (float(total_amount) * float(promo_obj['value']) / 100)
                        if total_amount > float(promo_obj['min_order_amount']):
                            total_amount = total_amount - disc_amount
                            self.update_promo_counter_sale_count(promo_code)
                            return disc_amount, total_amount
                        else:
                            return 0, total_amount
                    if promo_obj['type'] == 'AMOUNT':
                        disc_amount = float(promo_obj['value'])
                        if float(total_amount) > float(promo_obj['min_order_amount']):
                            total_amount = total_amount - disc_amount
                            self.update_promo_counter_sale_count(promo_code)
                            return disc_amount, total_amount
                        else:
                            return None
                else:
                    return None

            else:
                return None

        else:
            return None

    def update_promo_use_count(self, promo_code):
        promo_obj = ProductCampaigns.objects.get(code=promo_code)
        promo_obj.use_count = promo_obj.use_count + 1
        promo_obj.save()

    def update_promo_counter_sale_count(self, promo_code):
        promo_obj = ProductCampaigns.objects.get(code=promo_code)
        promo_obj.counter_sale = promo_obj.counter_sale + 1
        promo_obj.save()
