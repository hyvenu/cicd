from ecommerce.models import Cart, WishList
from inventory.models import ProductMaster, ProductCategory, ProductSubCategory, ProductImages, ProductPriceMaster
from store.models import Store
import math
from django.db.models import Q


class EcomService:

    def get_product_list(self, kwargs):
        final_list = []
        if 'category_name' in kwargs:
            category_name = kwargs['category_name']
            product_object = ProductMaster.objects.filter(category__category_name=category_name).all()
        elif 'brand_name' in kwargs.keys():
            brand_name = kwargs['brand_name']
            product_object = ProductMaster.objects.filter(brand__brand_name=brand_name).all()
        elif 'sub_category_name' in kwargs:
            sub_category_name = kwargs['sub_category_name']
            product_object = ProductMaster.objects.filter(sub_category__sub_category_name=sub_category_name).all()
        elif 'product_code' in kwargs:
            product_code = kwargs['product_code']
            product_object = ProductMaster.objects.filter(product_code=product_code).all()
        elif 'search_key' in kwargs:
            search_key = kwargs['search_key']
            query = Q(product_name__icontains=search_key)
            query.add(Q(category__category_name__icontains=search_key), Q.OR)
            query.add(Q(sub_category__sub_category_name__icontains=search_key), Q.OR)
            query.add(Q(brand__brand_name__icontains=search_key), Q.OR)
            product_object = ProductMaster.objects.filter(query).all()
        else:

            product_object = ProductMaster.objects.all()

        product_list = product_object.values(
            'id',
            'product_code',
            'product_name',
            'product_image',
            'category',
            'sub_category',
            'brand',
            'category__category_code',
            'category__category_name',
            'category__description',
            'description',
            'sub_category__sub_category_name',
            'sub_category__sub_category_code',
            'brand__brand_name',
            'brand__brand_image',
            'product_attributes',

        )

        for prod in product_list:
            prod['images'] = list(ProductImages.objects.filter(product_id=prod['id']).all().values(
                'product_id',
                'image'
            ))
            if len(prod['images']) > 0:
                prod['product_image'] = prod['images'][0]['image']

            prod['price'] = list(ProductPriceMaster.objects.filter(product_id=prod['id']).all().values(
                'sell_price',
                'unit__PrimaryUnit',
                'id',
                'qty',

            ))
            # prod['wish_list_flag'] = 0
            if WishList.objects.filter(product_id=prod["id"]).exists():
                prod['wish_list_flag'] = 1
            else:
                prod['wish_list_flag'] = 0
            final_list.append(prod)
        return list(final_list)

    def get_locations(self):
        location_list = list(Store.objects.all().values('city_name', 'pin_code'))
        return list(location_list)

    def get_product_category(self):
        category_list = ProductCategory.objects.all().values()
        return list(category_list)

    def get_sub_category(self):
        sub_category_list = ProductSubCategory.objects.all().values(
            "id",
            "sub_category_name",
            "sub_category_code",
            "sub_category_image",
            "category__id",
            "category__category_name",
            "category__category_code",
            "description",
        )
        return list(sub_category_list)

    def get_cart_detail(self, user_id):
        final_list = []
        cart_list = Cart.objects.filter(user_id=user_id).all().values(
            'product__product_name',
            'product__id',
            'product__product_code',
            'product__description',
            'pack_unit__id',
            'pack_unit__qty',
            'pack_unit__unit__PrimaryUnit',
            'pack_unit__sell_price',
            'qty',
            'sub_total',
            'tax',
            'tax_amount',
            'id',
        )

        for cart in cart_list:
            cart_obj = ProductImages.objects.filter(product_id=cart['product__id']).all().values(
                'image'
            )
            if len(cart_obj) > 0:
                cart['image'] = cart_obj[0]['image']
            final_list.append(cart)
        return list(final_list)

    def add_cart(self, data, user_id):
        if "id" in data:
            Cart.objects.get(id=data["id"]).delete()
        tax = ProductPriceMaster.objects.filter(id=data['pack_unit_id']).all().values('tax')[0]['tax']
        sub_total = int(data['qty']) * float(data["unit_price"])
        tax_amount = float((sub_total * float(tax)) / 100.00)
        sub_total = sub_total + math.ceil(tax_amount)
        cart = Cart(user_id=user_id, product_id=data['product_id'], tax=tax, tax_amount=tax_amount,
                    pack_unit_id=data["pack_unit_id"], unit_price=data["unit_price"], qty=data['qty'],
                    sub_total=sub_total)
        cart.save()
        return True

    def delete_cart(self, data, user_id):
        if "id" in data:
            Cart.objects.get(id=data["id"]).delete()
            return True
        else:
            return False

    def clear_cart(self, user_id):
        Cart.objects.filter(user_id=user_id).delete()
        return True

    def get_wish_list(self, user_id):
        final_list = []
        wish_list = WishList.objects.filter(user_id=user_id).all().values(
            'product__product_name',
            'product__id',
            'product__product_code',
            'product__description',
            'id',
        )

        for wish in wish_list:
            wish_obj = ProductImages.objects.filter(product_id=wish['product__id']).all().values(
                'image'
            )
            if len(wish_obj) > 0:
                wish['image'] = wish_obj[0]['image']
            final_list.append(wish)
        return list(final_list)

    def add_wish_list(self, data, user_id):
        if "id" in data:
            WishList.objects.filter(id=data["id"]).delete()
        wish_obj = WishList(user_id=user_id, product_id=data["product_id"])
        wish_obj.save()
        return True

    def delete_wish_list(self, data, user_id):
        if "product_id" in data:
            WishList.objects.filter(product_id=data["product_id"], user_id=user_id).delete()
            return True
        else:
            return False


