export class Product {
    id:number;
    product_code:string;
    product_name:string;
    product_image:string;
    brand:string;
    category:string;
    sub_category:string;
    category__category_code:string;
    category__category_name:string;
    category__description:string;
    sub_category__sub_category_name:string;
    sub_category__sub_category_code:string;
    brand__brand_name:string;
    brand__brand_image:string;
    product_attributes:string;


    constructor( id,product_code,product_name,product_image,brand,category,sub_category,category__category_code,
        category__category_name,category__description,sub_category__sub_category_name,sub_category__sub_category_code,
        brand__brand_name,brand__brand_image,product_attributes ){
        this.id=id;
        this.product_code=product_code;
        this.product_name=product_name;
        this.product_image=product_image;
        this.brand=brand;
        this.category=category;
        this.sub_category=sub_category;
        this.category__category_code=category__category_code;
        this.category__category_name=category__category_name;
        this.category__description=category__description;
        this.sub_category__sub_category_name=sub_category__sub_category_name;
        this.sub_category__sub_category_code=sub_category__sub_category_code;
        this.brand__brand_name=brand__brand_name;
        this.brand__brand_image=brand__brand_image;
        this.product_attributes=product_attributes;
        
    }
}