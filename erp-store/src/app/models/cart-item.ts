export class CartItem {
    id:number;
    product__id:string;
    product__product_name:string;
    qty:number;
    // price:number;
    product__product_code:string;
    product__description:string;
    sub_total:number;

    constructor(id:number,product__id,product__product_name,product__description,qty,price,sub_total){
        this.id= id;
        this.product__id= product__id;
        this.product__product_name=product__product_name;
        this.product__description = product__description;
        //this.price = price;
        this.qty = qty;
        this.sub_total=sub_total
        
    }
}