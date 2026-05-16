'use server'

import { createClient } from "@/app/lib/supabase";
import { snap } from "@/app/lib/midtrans";

const CreateOrder = async (orderDataArray) => {
    const supabase = createClient();

    // Kita petakan data agar sesuai dengan nama kolom di tabel orders_queue
    const formattedOrders = orderDataArray.map((order) => ({
        profiles_id: order.profiles_id,
        sender_id: order.sender_id,
        sender_name: order.sender_name,
        sender_phone: order.sender_phone,
        // Kolom receiver di tabel typo 'recieve', pastikan sesuaikan dengan screenshot
        reciever_name: order.receiver_name, 
        reciever_phone: order.receiver_phone,
        destination_address: order.destination_address,
        shipping_method: order.shipping_method,
        payment_method: order.payment_method,
        // Kita simpan array items sebagai JSON
        // products: order.items, 
        subtotal: order.subtotal, 
        message: order.message,
    }));

    const { data : dataOrders, error : errorOrders } = await supabase
        .from("orders")
        .insert(formattedOrders) // Supabase otomatis handle multiple insert jika inputnya array
        .select();

    if (errorOrders) {
        console.error("Error creating orders:", errorOrders);
        return { success: false, message: errorOrders.message };
    }

    const formattedOrdersItems = orderDataArray.reduce((acc, orders, ordersIndex) => {
        const items = orders.items.map((it) => ({
            orders_id: dataOrders[ordersIndex].id,
            products_id: it.products_id,
            amount: it.amount,
            price_at_purchase: it.price,
            gross_total: it.subtotal,
        }))
        acc.push(...items)
        return acc
    }, [])

    const { data, error } = await supabase
        .from("orders_items")
        .insert(formattedOrdersItems) // Supabase otomatis handle multiple insert jika inputnya array
        .select();
    
    if (error) {
        console.error("Error creating ordersItems:", error);
        return { success: false, message: error.message };
    }

    const parameter = formattedOrders.map((items, index) => ({
        midtrans : {
            "transaction_details" : {
            "order_id": `${items.profiles_id}-${dataOrders[index].id}`,
            "gross_amount": items.subtotal
            },
            "enabled_payments" : [items.payment_method],
            "customer_details" : {
                "first_name" : items.reciever_name,
                "phone" : items.reciever_phone
            }
        }, 
        supabase : {
            orders_id : dataOrders[index].id,
            status : "",
            payment_type : items.payment_method,
            subtotal: items.subtotal,
            snap_token: ""
        }
    }))

    try {
        for (const item of parameter) {
            const transaction = await snap.createTransaction(item.midtrans);

            item.supabase.snap_token = transaction.token;
            item.supabase.status = "pending";

            const { error: transError } = await supabase 
                .from('transactions')
                .insert(item.supabase);

            if (transError) {
                console.error("Error creating transaction in Supabase:", transError);
                throw new Error(transError.message);
            }

            item.snap_token = transaction.token;
        }

    } catch (err) {
        console.error("Error detail:", err);
        return { success: false, message: "Gagal memproses ke Midtrans: " + err.message };
    }


    return { success: true, message: "Order berhasil dibuat!", data: parameter  };
};

export default CreateOrder;