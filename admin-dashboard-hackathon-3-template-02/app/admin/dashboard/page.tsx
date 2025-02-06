// "use client";
// import ProtectedRoute from "@/app/components/protected/page";
// import { client } from "@/sanity/lib/client";
// // import { urlFor } from "@/sanity/lib/image";

// // import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";

// interface Order {
//   _id: string;
//   fullName: string;
//   phone: number;
//   email: string;
//   address: string;
//   zipCode: string;
//   city: string;
//   grandTotal: number;
//   promoCode: string;
//   orderDate: string;
//   status: string | null;
//   products: {
//      name: string; image:string;}[];
// }

// export default function AdminDashboard() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
//   const [filter, setFilter] = useState("All");

//   // ✅ Fetch orders from Sanity
//   useEffect(() => {
//     client
//       .fetch(
//         `*[_type == "order"]{
//           _id, fullName, phone, email, address, zipCode, city, grandTotal, promoCode, orderDate, status,
//           products[] -> {name, image}
//         }`
//       )
//       .then((data) => setOrders(data))
//       .catch((error) => console.log("Error fetching orders:", error));
//   }, []);

//   // ✅ Filter Orders
//   const filteredOrders =
//     filter === "All"
//       ? orders
//       : orders.filter((order) => order.status === filter);

//   // ✅ Toggle order details
//   const toggleOrderDetails = (orderId: string) => {
//     setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
//   };

//   // ✅ Delete Order
//   const handleDelete = async (orderId: string) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     });

//     if (!result.isConfirmed) return;

//     try {
//       await client.delete(orderId);
//       setOrders((prevOrders) =>
//         prevOrders.filter((order) => order._id !== orderId)
//       );
//       Swal.fire("Deleted!", "The order has been deleted.", "success");
//     } catch (error) {
//       Swal.fire("Error", "Failed to delete order", "error");
//     }
//   };

//   // ✅ Update Order Status
//   const handleStatusChange = async (orderId: string, newStatus: string) => {
//     try {
//       await client.patch(orderId).set({ status: newStatus }).commit();

//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order._id === orderId ? { ...order, status: newStatus } : order
//         )
//       );

//       Swal.fire(
//         "Status Updated",
//         `Order has been marked as ${newStatus}.`,
//         "success"
//       );
//     } catch (error) {
//       Swal.fire("Error", "Failed to update status", "error");
//     }
//   };

//   return (
//     <ProtectedRoute>
//       <div className="flex flex-col h-screen bg-gray-100">
//         {/* ✅ Navbar */}
//         <nav className="bg-red-600 text-white p-4 shadow-lg flex justify-between">
//           <h2 className="text-2xl font-bold">Admin Dashboard</h2>
//           <div className="flex space-x-4">
//             {["All", "pending", "success", "dispatch"].map((status) => (
//               <button
//                 key={status}
//                 className={`px-4 py-2 rounded-lg transition-all ${
//                   filter === status
//                     ? "bg-white text-red-600 font-bold"
//                     : "text-white"
//                 }`}
//                 onClick={() => setFilter(status)}
//               >
//                 {status.charAt(0).toUpperCase() + status.slice(1)}
//               </button>
//             ))}
//           </div>
//         </nav>

//         {/* ✅ Orders Table */}
//         <div className="p-4 overflow-y-auto">
//           <h2 className="text-2xl font-bold text-center">Orders</h2>
//           <div className="overflow-y-auto rounded-lg shadow-sm bg-white">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="p-2">ID</th>
//                   <th className="p-2">Customer</th>
//                   <th className="p-2">Address</th>
//                   <th className="p-2">Date</th>
//                   <th className="p-2">Total</th>
//                   <th className="p-2">Status</th>
//                   <th className="p-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredOrders.map((order) => (
//                   <React.Fragment key={order._id}>
//                     <tr
//                       className="cursor-pointer hover:bg-red-100 transition-all"
//                       onClick={() => toggleOrderDetails(order._id)}
//                     >
//                       <td className="p-2">{order._id}</td>
//                       <td className="p-2">{order.fullName}</td>
//                       <td className="p-2">{order.address}</td>
//                       <td className="p-2">
//                         {new Date(order.orderDate).toLocaleString()}
//                       </td>
//                       <td className="p-2">${order.grandTotal}</td>
//                       <td className="p-2">
//                         <select
//                           value={order.status || ""}
//                           onChange={(e) =>
//                             handleStatusChange(order._id, e.target.value)
//                           }
//                           className="bg-gray-100 p-1 rounded"
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="success">Success</option>
//                           <option value="dispatch">Dispatched</option>
//                         </select>
//                       </td>
//                       <td className="p-2">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleDelete(order._id);
//                           }}
//                           className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>

//                     {/* ✅ Order Details */}
//                     {selectedOrderId === order._id && (
//                       <tr>
//                         <td
//                           colSpan={7}
//                           className="bg-gray-50 p-4 transition-all"
//                         >
//                           <h3 className="font-bold">Order Details</h3>
//                           <p>
//                             Phone: <strong>{order.phone}</strong>
//                           </p>
//                           <p>
//                             Email: <strong>{order.email}</strong>
//                           </p>
//                           <p>
//                             City: <strong>{order.city}</strong>
//                           </p>
//                           <h4 className="font-bold mt-2">Products:</h4>
//                           {/* <ul className="mt-2">
//                             {order.products.map((item, index) => (
//                               <li
//                                 key={`${order._id}-${index}`}
//                                 className="flex items-center gap-2"
//                               >
//                                 {item.name}
//                                 {item.image && (
//                                   <Image
//                                     src={urlFor(item.image).url()}
//                                     alt="product image"
//                                     width={100}
//                                     height={100}
//                                   />
//                                 )}
//                               </li>
//                             ))}
//                           </ul> */}

//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }

"use client";
import ProtectedRoute from "@/app/components/protected/page";
import { client } from "@/sanity/lib/client";
// import { urlFor } from "@/sanity/lib/image";

// import Image from "next/image";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Order {
  _id: string;
  fullName: string;
  phone: number;
  email: string;
  address: string;
  zipCode: string;
  city: string;
  grandTotal: number;
  promoCode: string;
  orderDate: string;
  status: string | null;
  products: {
    name: string; image: string;
  }[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  // ✅ Fetch orders from Sanity
  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
          _id, fullName, phone, email, address, zipCode, city, grandTotal, promoCode, orderDate, status,
          products[] -> {name, image}
        }`
      )
      .then((data) => setOrders(data))
      .catch(() => console.log("Error fetching orders"));
  }, []);

  // ✅ Filter Orders
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  // ✅ Toggle order details
  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // ✅ Delete Order
  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      Swal.fire("Deleted!", "The order has been deleted.", "success");
    } catch {
      Swal.fire("Error", "Failed to delete order", "error");
    }
  };

  // ✅ Update Order Status
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      Swal.fire(
        "Status Updated",
        `Order has been marked as ${newStatus}.`,
        "success"
      );
    } catch {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-100">
        {/* ✅ Navbar */}
        <nav className="bg-red-600 text-white p-4 shadow-lg flex justify-between">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="flex space-x-4">
            {["All", "pending", "success", "dispatch"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === status
                    ? "bg-white text-red-600 font-bold"
                    : "text-white"
                }`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </nav>

        {/* ✅ Orders Table */}
        <div className="p-4 overflow-y-auto">
          <h2 className="text-2xl font-bold text-center">Orders</h2>
          <div className="overflow-y-auto rounded-lg shadow-sm bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">ID</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Address</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr
                      className="cursor-pointer hover:bg-red-100 transition-all"
                      onClick={() => toggleOrderDetails(order._id)}
                    >
                      <td className="p-2">{order._id}</td>
                      <td className="p-2">{order.fullName}</td>
                      <td className="p-2">{order.address}</td>
                      <td className="p-2">
                        {new Date(order.orderDate).toLocaleString()}
                      </td>
                      <td className="p-2">${order.grandTotal}</td>
                      <td className="p-2">
                        <select
                          value={order.status || ""}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="bg-gray-100 p-1 rounded"
                        >
                          <option value="pending">Pending</option>
                          <option value="success">Success</option>
                          <option value="dispatch">Dispatched</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(order._id);
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>

                    {/* ✅ Order Details */}
                    {selectedOrderId === order._id && (
                      <tr>
                        <td
                          colSpan={7}
                          className="bg-gray-50 p-4 transition-all"
                        >
                          <h3 className="font-bold">Order Details</h3>
                          <p>
                            Phone: <strong>{order.phone}</strong>
                          </p>
                          <p>
                            Email: <strong>{order.email}</strong>
                          </p>
                          <p>
                            City: <strong>{order.city}</strong>
                          </p>
                          <h4 className="font-bold mt-2">Products:</h4>
                          {/* <ul className="mt-2">
                            {order.products.map((item, index) => (
                              <li
                                key={`${order._id}-${index}`}
                                className="flex items-center gap-2"
                              >
                                {item.name}
                                {item.image && (
                                  <Image
                                    src={urlFor(item.image).url()}
                                    alt="product image"
                                    width={100}
                                    height={100}
                                  />
                                )}
                              </li>
                            ))}
                          </ul> */}

                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
