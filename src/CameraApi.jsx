/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import api from "./api";

export const CameraContext = createContext();

export default function CameraApi({ children }) {
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    api
      .get("/")
      .then((res) => {
        const storedRatingsMap = JSON.parse(
          localStorage.getItem("camera_ratings_map") || "{}"
        );
        const dataWithRatings = (res.data || []).map((cam) => {
          const localRatings = storedRatingsMap[cam.id];
          const apiRatings = Array.isArray(cam.ratings) ? cam.ratings : [];
          // Ưu tiên dữ liệu đánh giá thực tế đã lưu
          const combined =
            localRatings && localRatings.length > 0 ? localRatings : apiRatings;
          return {
            ...cam,
            ratings: combined,
          };
        });
        setCameras(dataWithRatings);
      })
      .catch((err) => console.error("Error fetching cameras:", err));
  }, []);

  const handleDelete = (id) => {
    // Action Guard: Kiểm tra quyền Admin trước khi gọi API
    const currentRole = localStorage.getItem("role");
    if (currentRole !== "admin") {
      alert(
        "Hành động bị từ chối! Tài khoản đã đăng xuất hoặc không có quyền Quản trị viên (Admin).",
      );
      return;
    }

    api.delete(`/${id}`).then(() => {
      setCameras((prev) => prev.filter((item) => item.id !== id));
    });
  };

  const handleUpdate = async (id, updatedData) => {
    // Action Guard: Kiểm tra quyền Admin trước khi gọi API
    const currentRole = localStorage.getItem("role");
    if (currentRole !== "admin") {
      alert(
        "Hành động bị từ chối! Tài khoản đã đăng xuất hoặc không có quyền Quản trị viên (Admin).",
      );
      return;
    }

    try {
      const res = await api.put(`/${id}`, updatedData);
      setCameras((prev) =>
        prev.map((item) => (item.id === id ? res.data : item))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async (createdData) => {
    // Action Guard: Kiểm tra quyền Admin trước khi gọi API
    const currentRole = localStorage.getItem("role");
    if (currentRole !== "admin") {
      alert(
        "Hành động bị từ chối! Tài khoản đã đăng xuất hoặc không có quyền Quản trị viên (Admin).",
      );
      return;
    }

    try {
      const res = await api.post("/", createdData);
      setCameras((prev) => [...prev, res.data]);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  // Đánh giá máy ảnh theo số sao thực tế (1 - 5 sao)
  const handleRateCamera = async (id, ratingValue) => {
    const star = Number(ratingValue);
    if (!star || star < 1 || star > 5) return;

    const storedRatingsMap = JSON.parse(
      localStorage.getItem("camera_ratings_map") || "{}"
    );

    let updatedRatings = [];
    setCameras((prev) =>
      prev.map((item) => {
        if (String(item.id) === String(id)) {
          const currentRatings = Array.isArray(item.ratings) ? item.ratings : [];
          updatedRatings = [...currentRatings, star];
          return {
            ...item,
            ratings: updatedRatings,
          };
        }
        return item;
      })
    );

    // Lưu vào localStorage
    storedRatingsMap[id] = updatedRatings;
    localStorage.setItem("camera_ratings_map", JSON.stringify(storedRatingsMap));

    // Đồng bộ lên MockAPI nếu có kết nối
    try {
      const targetCam = cameras.find((c) => String(c.id) === String(id));
      if (targetCam) {
        await api.put(`/${id}`, {
          ...targetCam,
          ratings: updatedRatings,
        });
      }
    } catch (err) {
      console.warn("Could not sync rating to remote API:", err);
    }

    return updatedRatings;
  };

  return (
    <CameraContext.Provider
      value={{
        cameras,
        handleDelete,
        handleUpdate,
        handleCreate,
        handleRateCamera,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
}
