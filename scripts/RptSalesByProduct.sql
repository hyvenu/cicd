SELECT  
store.store_name as branch_name,
Date(orq.po_date) as transaction_date,
prd.product_name,
SUM(ord_details.qty) as sold_qty,
MIN(ord_details.unit_price) as sell_price,
SUM(ord_details.discount_price) as discount_price,
MIN(ord_details.gst) as gst,
SUM(ord_details.gst_amount) as gst_amount,
SUM(ord_details.subtotal_amount) as  total_amount

FROM sales_salesorderrequest orq
JOIN sales_salesorderdetails ord_details on ord_details.po_order_id=orq.id
JOIN inventory_productmaster prd on prd.id = ord_details.product_id
JOIN store_store store on store.id = orq.store_id
where date(orq.po_date) between {from_date} and {to_date}
GROUP BY store.store_name,orq.po_date,prd.product_name
ORDER BY store.store_name,orq.po_date,prd.product_name
