/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useRef } from "react";

export const AuthContext = createContext();

// Khởi tạo kênh giao tiếp realtime giữa các tab của trình duyệt
const authChannel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("camera_shop_auth_channel")
    : null;

// Sinh định danh ngẫu nhiên duy nhất cho mỗi instance tab trong bộ nhớ RAM
const generateTabInstanceId = () => {
  return (
    "tab_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now()
  );
};

export function AuthProvider({ children }) {
  // Mã tab độc lập trong bộ nhớ RAM
  const tabInstanceIdRef = useRef(generateTabInstanceId());
  const myTabId = tabInstanceIdRef.current;

  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // State thông báo phiên làm việc đa tab
  const [sessionInfo, setSessionInfo] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  // 1. Kiểm tra xác thực khi Tab khởi động (Chặn tab mới nếu tab cũ đang active)
  useEffect(() => {
    const activeTabId = localStorage.getItem("active_tab_id");
    const storedRole = localStorage.getItem("role");
    let storedUser = null;
    try {
      storedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      storedUser = null;
    }

    // Không có tài khoản nào đăng nhập
    if (!storedRole) {
      setRole(null);
      setUser(null);
      setIsInitializing(false);
      return;
    }

    // Nếu chính tab này là tab chủ sở hữu (vừa login xong hoặc F5 lại trang này)
    const sessionOwner = sessionStorage.getItem("current_tab_owner");
    if (sessionOwner === activeTabId) {
      setRole(storedRole);
      setUser(storedUser);
      setIsInitializing(false);
      return;
    }

    // Nếu là tab mới mở ra (paste URL hoặc duplicate tab) mà activeTabId thuộc về tab khác
    if (activeTabId && activeTabId !== myTabId) {
      let isAliveReceived = false;

      // Lắng nghe tín hiệu phản hồi từ tab chủ
      const handlePong = (e) => {
        if (
          e.data?.type === "ACTIVE_TAB_ALIVE" &&
          e.data?.toInstance === myTabId
        ) {
          isAliveReceived = true;
          // TAB CŨ ĐANG HOẠT ĐỘNG ➔ CHẶN TAB MỚI NÀY!
          setRole(null);
          setUser(null);
          setSessionInfo({
            isOpen: true,
            title: "Tài khoản đang hoạt động ở tab khác",
            message:
              "Tài khoản này hiện đang hoạt động tại một tab khác. Hệ thống không cho phép mở đồng thời nhiều tab cùng một tài khoản để bảo mật dữ liệu.",
          });
          setIsInitializing(false);
        }
      };

      if (authChannel) {
        authChannel.addEventListener("message", handlePong);
        // Bắn tín hiệu hỏi: "Tab chủ có đang online không?"
        authChannel.postMessage({
          type: "CHECK_ACTIVE_TAB",
          targetTabId: activeTabId,
          fromInstance: myTabId,
        });
      }

      // Đợi 180ms xem tab chủ có phản hồi không
      const timer = setTimeout(() => {
        if (authChannel) {
          authChannel.removeEventListener("message", handlePong);
        }

        // Nếu tab cũ đã bị đóng (không phản hồi), tab mới được quyền kế thừa phiên
        if (!isAliveReceived) {
          localStorage.setItem("active_tab_id", myTabId);
          sessionStorage.setItem("current_tab_owner", myTabId);
          setRole(storedRole);
          setUser(storedUser);
          setIsInitializing(false);
        }
      }, 180);

      return () => {
        clearTimeout(timer);
        if (authChannel) {
          authChannel.removeEventListener("message", handlePong);
        }
      };
    } else {
      localStorage.setItem("active_tab_id", myTabId);
      sessionStorage.setItem("current_tab_owner", myTabId);
      setRole(storedRole);
      setUser(storedUser);
      setIsInitializing(false);
    }
  }, [myTabId]);

  // 2. Kênh thường trực lắng nghe & phản hồi tín hiệu giữa các Tab
  useEffect(() => {
    if (authChannel) {
      const handleChannelMessage = (event) => {
        const { type, targetTabId, fromInstance, fromTabId } = event.data || {};

        // A. Tab khác hỏi tab này có online không ➔ Phản hồi ngay "Tôi đang sống!"
        if (type === "CHECK_ACTIVE_TAB") {
          const currentRole = localStorage.getItem("role");
          const sessionOwner = sessionStorage.getItem("current_tab_owner");
          if (
            currentRole &&
            sessionOwner === myTabId &&
            targetTabId === myTabId
          ) {
            authChannel.postMessage({
              type: "ACTIVE_TAB_ALIVE",
              aliveTabId: myTabId,
              toInstance: fromInstance,
            });
          }
        }
        // B. Sự kiện đăng xuất ở một tab bất kỳ
        else if (type === "CROSS_TAB_LOGOUT") {
          if (fromTabId !== myTabId) {
            setRole(null);
            setUser(null);
            sessionStorage.removeItem("current_tab_owner");
            setSessionInfo({
              isOpen: true,
              title: "Phiên làm việc đã kết thúc",
              message:
                "Hệ thống phát hiện tài khoản đã được đăng xuất ở một tab khác. Toàn bộ quyền thao tác đã được thu hồi.",
            });
          }
        }
      };

      authChannel.addEventListener("message", handleChannelMessage);
      return () => {
        authChannel.removeEventListener("message", handleChannelMessage);
      };
    }
  }, [myTabId]);

  // 3. Hàm Login chủ động (Chỉ xảy ra khi người dùng nhập form đăng nhập)
  const login = (roleOrUser, optionalUser) => {
    let resolvedRole = null;
    let resolvedUser = null;

    if (typeof roleOrUser === "object" && roleOrUser !== null) {
      resolvedUser = roleOrUser;
      resolvedRole = roleOrUser.role || "customer";
    } else {
      resolvedRole = roleOrUser;
      resolvedUser = optionalUser || { role: roleOrUser };
    }

    // Gán chủ quyền phiên cho tab này
    localStorage.setItem("active_tab_id", myTabId);
    sessionStorage.setItem("current_tab_owner", myTabId);

    localStorage.setItem("role", resolvedRole);
    if (resolvedUser) {
      localStorage.setItem("currentUser", JSON.stringify(resolvedUser));
    }

    setRole(resolvedRole);
    setUser(resolvedUser);
    setSessionInfo({ isOpen: false, title: "", message: "" });
  };

  // 4. Hàm Logout
  const logout = (broadcast = true) => {
    localStorage.removeItem("role");
    localStorage.removeItem("admin");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("active_tab_id");
    sessionStorage.removeItem("current_tab_owner");

    setRole(null);
    setUser(null);

    if (broadcast && authChannel) {
      authChannel.postMessage({
        type: "CROSS_TAB_LOGOUT",
        fromTabId: myTabId,
        timestamp: Date.now(),
      });
    }
  };

  const dismissSessionInfo = () => {
    setSessionInfo({ isOpen: false, title: "", message: "" });
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        isAdmin: role === "admin",
        isInitializing,
        sessionExpired: sessionInfo.isOpen,
        sessionInfo,
        dismissSessionInfo,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
