import { useEffect, useState } from "react";
import axios from "axios";

interface VehicleAdData {
  ad_id: number;
  user_id: number;
  admin_id: number | null;
  approval_status: "Approved" | "Rejected" | "Pending" | null;
  title: string;
  description: string;
  price: number;
  province: string;
  city: string;
  phone_number: string;
  selling_status: string;
  item_id: number;
  item_type: string;
  item_condition: string;
  brand: string;
  color: string;
  made_year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  images: string[];
}

// Helper to decode JWT and get admin_id (assuming payload has admin_id)
const getAdminIdFromToken = (): number | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.admin_id ?? null;
  } catch {
    return null;
  }
};

const VehicleAdListContent = () => {
  const [data, setData] = useState<VehicleAdData[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<VehicleAdData[]>(
          "http://localhost:5000/api/vehicle/all"
        );
        setData(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const filtered = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleApproval = async (
    adId: number,
    status: "Approved" | "Rejected"
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${status.toLowerCase()} this ad?`
    );
    if (!confirmed) return;

    try {
      await axios.put(
        `http://localhost:5000/api/advertisements/${adId}`,
        { approval_status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // We don't get admin_id from response, so decode from JWT
      const adminId = getAdminIdFromToken();

      setData((prev) =>
        prev.map((ad) =>
          ad.ad_id === adId
            ? { ...ad, approval_status: status, admin_id: adminId }
            : ad
        )
      );
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to update approval status. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-black">
        Vehicle Advertisements
      </h2>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-4 pr-10 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-max border table-auto">
          <thead>
            <tr className="border-b text-left text-black">
              <th className="py-2 px-4">Ad ID</th>
              <th className="py-2 px-4">User ID</th>
              <th className="py-2 px-4">Admin ID</th>
              <th className="py-2 px-4">Approval</th>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Images</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Province</th>
              <th className="py-2 px-4">City</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Item Type</th>
              <th className="py-2 px-4">Condition</th>
              <th className="py-2 px-4">Brand</th>
              <th className="py-2 px-4">Color</th>
              <th className="py-2 px-4">Year</th>
              <th className="py-2 px-4">Mileage</th>
              <th className="py-2 px-4">Fuel</th>
              <th className="py-2 px-4">Transmission</th>
              <th className="py-2 px-4">Approve</th>
              <th className="py-2 px-4">Reject</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.ad_id}
                className="border-b hover:bg-gray-50 text-black"
              >
                <td className="py-2 px-4">{item.ad_id}</td>
                <td className="py-2 px-4">{item.user_id}</td>
                <td className="py-2 px-4">{item.admin_id ?? "N/A"}</td>
                <td className="py-2 px-4">
                  {item.approval_status ?? "Pending"}
                </td>
                <td className="py-2 px-4">{item.title}</td>
                <td className="py-2 px-4">
                  <div className="flex space-x-2">
                    {item.images.map((imgUrl, index) => (
                      <img
                        key={index}
                        src={imgUrl}
                        alt={`vehicle-${item.ad_id}-${index}`}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/64";
                        }}
                      />
                    ))}
                  </div>
                </td>
                <td className="py-2 px-4">{item.description}</td>
                <td className="py-2 px-4">{item.price}</td>
                <td className="py-2 px-4">{item.province}</td>
                <td className="py-2 px-4">{item.city}</td>
                <td className="py-2 px-4">{item.phone_number}</td>
                <td className="py-2 px-4">{item.selling_status}</td>
                <td className="py-2 px-4">{item.item_type}</td>
                <td className="py-2 px-4">{item.item_condition}</td>
                <td className="py-2 px-4">{item.brand}</td>
                <td className="py-2 px-4">{item.color}</td>
                <td className="py-2 px-4">{item.made_year}</td>
                <td className="py-2 px-4">{item.mileage}</td>
                <td className="py-2 px-4">{item.fuel_type}</td>
                <td className="py-2 px-4">{item.transmission}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleApproval(item.ad_id, "Approved")}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    disabled={item.approval_status === "Approved"}
                  >
                    Approve
                  </button>
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleApproval(item.ad_id, "Rejected")}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    disabled={item.approval_status === "Rejected"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleAdListContent;
