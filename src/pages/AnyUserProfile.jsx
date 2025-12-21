// src/pages/AnyUserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";

// Import existing profile components
import ProfilePageDesktop from "./ProfilePageDesktop";
import HomeEmployer from "./HomeEmployer";

export default function AnyUserProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState("");
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnyUserProfile.jsx:19',message:'useEffect triggered',data:{pathname:location.pathname,userId:userId,pathnameChanged:true,userIdChanged:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        
        // ✅ Har safar URL o'zgarganda yangi fetch
        const fetchUserProfile = async () => {
            try {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnyUserProfile.jsx:22',message:'Function entry',data:{pathname:location.pathname,userId:userId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
                // #endregion
                
                // ✅ currentUserId ni useEffect ichida o'qish (har safar yangi)
                const currentUserId = localStorage.getItem("user_id");
                
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnyUserProfile.jsx:26',message:'Before comparison',data:{userId:userId,userIdType:typeof userId,userIdLength:userId?.length,currentUserId:currentUserId,currentUserIdType:typeof currentUserId,currentUserIdLength:currentUserId?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                // #endregion
                
                console.log("🔄 =========================");
                console.log("🔍 Current URL:", location.pathname);
                console.log("🔍 userId from URL:", userId);
                console.log("👤 My userId from localStorage:", currentUserId);
                console.log("🔄 =========================");

                setLoading(true);
                setError("");
                setUserRole(null);
                setProfileData(null);

                // ✅ Agar userId yo'q bo'lsa
                if (!userId) {
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnyUserProfile.jsx:40',message:'No userId branch',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                    // #endregion
                    console.log("❌ userId mavjud emas!");
                    setError("User ID topilmadi");
                    setLoading(false);
                    return;
                }

                // ✅ Agar o'z profilim bo'lsa - faqat currentUserId mavjud va teng bo'lsa
                // ✅ Ehtiyotkorlik bilan solishtirish (null, undefined, bo'sh string tekshiruvi)
                const normalizedUserId = userId ? String(userId).trim() : "";
                const normalizedCurrentUserId = currentUserId ? String(currentUserId).trim() : "";
                
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnyUserProfile.jsx:52',message:'After normalization',data:{normalizedUserId:normalizedUserId,normalizedCurrentUserId:normalizedCurrentUserId,areEqual:normalizedUserId===normalizedCurrentUserId,normalizedUserIdLength:normalizedUserId.length,normalizedCurrentUserIdLength:normalizedCurrentUserId.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                // #endregion
                
                if (normalizedCurrentUserId && normalizedUserId && normalizedUserId === normalizedCurrentUserId) {
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnyUserProfile.jsx:55',message:'Own profile branch - before redirect',data:{normalizedUserId:normalizedUserId,normalizedCurrentUserId:normalizedCurrentUserId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
                    // #endregion
                    console.log("⚠️ Bu mening profilim, redirect...");
                    console.log("⚠️ userId (normalized):", normalizedUserId);
                    console.log("⚠️ currentUserId (normalized):", normalizedCurrentUserId);

                    try {
                        const res = await api.get("/api/auth/me/");
                        const myRole = res.data.role;

                        // #region agent log
                        fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnyUserProfile.jsx:64',message:'Before navigate call',data:{myRole:myRole},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
                        // #endregion

                        if (myRole === "JOB_SEEKER") {
                            navigate("/profile", { replace: true });
                            // #region agent log
                            fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnyUserProfile.jsx:68',message:'After navigate JOB_SEEKER - should return',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
                            // #endregion
                            return; // ✅ MUHIM: return qilish kerak
                        } else if (myRole === "EMPLOYER") {
                            navigate("/home-employer", { replace: true });
                            // #region agent log
                            fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnyUserProfile.jsx:72',message:'After navigate EMPLOYER - should return',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
                            // #endregion
                            return; // ✅ MUHIM: return qilish kerak
                        }
                    } catch (redirectErr) {
                        // #region agent log
                        fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnyUserProfile.jsx:77',message:'Redirect error caught',data:{error:redirectErr.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
                        // #endregion
                        console.error("❌ Redirect xatolik:", redirectErr);
                        // Agar redirect xatolik bo'lsa, oddiy profil ko'rsatish
                        // return qilmaymiz, chunki profil ko'rsatish kerak
                    }
                } else {
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnyUserProfile.jsx:82',message:'Other user profile branch',data:{normalizedUserId:normalizedUserId,normalizedCurrentUserId:normalizedCurrentUserId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                    // #endregion
                    console.log("✅ Bu boshqa userning profili, ko'rsatamiz");
                    console.log("✅ userId:", normalizedUserId);
                    console.log("✅ currentUserId:", normalizedCurrentUserId);
                }

                // ✅ Boshqa userning ma'lumotlarini olish
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnyUserProfile.jsx:88',message:'Before API call',data:{userId:userId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                // #endregion
                console.log(`📡 Fetching profile for userId: ${userId}`);
                const response = await api.get(`/api/auth/profile/${userId}/`);

                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnyUserProfile.jsx:92',message:'After API call',data:{role:response.data?.role,hasRole:!!response.data?.role},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                // #endregion
                console.log("✅ Profile data received:", response.data);

                const role = response.data.role;

                if (!role) {
                    throw new Error("User role not found");
                }

                setUserRole(role);
                setProfileData(response.data);
                setLoading(false);

                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnyUserProfile.jsx:105',message:'Profile loaded successfully',data:{role:role},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                // #endregion
                console.log("✅ Profile loaded successfully, role:", role);

            } catch (err) {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/56b1ed58-a790-463d-8e9d-601f087de809',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AnyUserProfile.jsx:110',message:'Error caught',data:{error:err.message,status:err.response?.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                // #endregion
                console.error("❌ Error fetching profile:", err);
                console.error("❌ Error response:", err.response?.data);

                setError(err.response?.data?.detail || err.message || "Profile topilmadi");
                setLoading(false);
            }
        };

        fetchUserProfile();

        // ✅ CLEANUP: Component unmount bo'lganda state'ni tozalash
        return () => {
            console.log("🧹 Cleanup: resetting state");
            setUserRole(null);
            setProfileData(null);
            setError("");
        };

    }, [location.pathname, userId]); // ✅ MUHIM: URL yoki userId o'zgarganda ishga tushadi (navigate olib tashlandi - infinite loop oldini olish uchun)

    // ===== LOADING =====
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#3066BE] mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg font-medium">Yuklanmoqda...</p>
                    <p className="mt-2 text-gray-400 text-sm">User ID: {userId}</p>
                </div>
            </div>
        );
    }

    // ===== ERROR =====
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Xatolik</h2>
                    <p className="text-red-600 text-lg mb-2">{error}</p>
                    <p className="text-gray-500 text-sm mb-6">User ID: {userId}</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => navigate("/chat")}
                            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
                        >
                            Chat'ga qaytish
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-[#3066BE] text-white rounded-lg hover:bg-[#2452a6] transition font-semibold"
                        >
                            Qayta urinish
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ===== RENDER BASED ON ROLE =====
    if (!userRole) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="text-center">
                    <div className="text-gray-400 text-4xl mb-4">🤔</div>
                    <p className="text-gray-600">User role aniqlanmadi...</p>
                </div>
            </div>
        );
    }

    if (userRole === "JOB_SEEKER") {
        console.log("🎨 Rendering Job Seeker profile for:", userId);
        return (
            <div key={userId}>
                <ProfilePageDesktop viewOnly={true} targetUserId={userId} />
            </div>
        );
    }

    if (userRole === "EMPLOYER") {
        console.log("🏢 Rendering Employer profile for:", userId);
        return (
            <div key={userId}>
                <HomeEmployer viewOnly={true} targetUserId={userId} />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                <p className="text-gray-600 text-lg">Unknown user role: {userRole}</p>
                <p className="text-gray-400 text-sm mt-2">User ID: {userId}</p>
                <button
                    onClick={() => navigate("/chat")}
                    className="mt-4 px-6 py-3 bg-[#3066BE] text-white rounded-lg hover:bg-[#2452a6]"
                >
                    Chat'ga qaytish
                </button>
            </div>
        </div>
    );
}