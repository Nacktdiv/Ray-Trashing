import { createClient } from "@/app/lib/supabase";

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
        products: order.items, 
        subtotal: order.subtotal, 
        message: order.message,
    }));

    const { data, error } = await supabase
        .from("orders_queue")
        .insert(formattedOrders) // Supabase otomatis handle multiple insert jika inputnya array
        .select();

    if (error) {
        console.error("Error creating order:", error);
        return { success: false, message: error.message };
    }

    return { success: true, message: "Order berhasil dibuat!", data };
};

export default CreateOrder;