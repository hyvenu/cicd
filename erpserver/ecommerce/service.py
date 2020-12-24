from ecommerce.models import Cart
from inventory.models import ProductMaster, ProductCategory, ProductSubCategory
from store.models import Store


class EcomService:

    def get_product_list(self,**kwargs):

        if 'category' in kwargs.keys():
            pass
        if 'brand' in kwargs.keys():
            pass
        if 'sub_category' in kwargs.keys():
            pass

        product_list = ProductMaster.objects.all().values(
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
            'sub_category__sub_category_name',
            'sub_category__sub_category_code',
            'brand__brand_name',
            'brand__brand_image',

        )

        return list(product_list)


    def get_locations(self):
        location_list = list(Store.objects.all().values('city_name','pin_code'))
        return list(location_list)


    def get_product_category(self):
        category_list = ProductCategory.objects.all().values()
        return list(category_list)

    def get_sub_category(self):
        sub_category_list = ProductSubCategory.objects.all().values(
            "id",
            "sub_category_name",
            "sub_category_code",
            "category__id",
            "category__category_name",
            "category__category_code",
        )
        return list(sub_category_list)

    def get_cart_detail(self, user_id):
        cart_list = Cart.objects.filter(user_id=user_id).all().values(
            'product__product_name',
            'product__id',
            'product__product_code',
            'product__description',
            'qty',
            'sub_total',
            'id',
        )
        return list(cart_list)

    def add_cart(self,data, user_id):
        cart = Cart(user_id=user_id, product_id=data['product_id'],qty=data['qty'],sub_total=data['sub_total'])
        cart.save()
        return True



