export default function MultiStepForm() {
    const [formData, setFormData] = useState({
        title: "",
        skills: [],
        duration: "",
        size: "",
        level: "",
        permanent: "",
        budget_min: "",
        budget_max: "",
        is_fixed_price: true,
        location: "",
        description: ""
    });

    const handleSubmit = async () => {
        console.log("Tugma bosildi ✅");
        try {
            const token = localStorage.getItem("access_token");
            const response = await axios.post("http://localhost:8000/api/jobposts/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("✅ Success:", response.data);
            alert("Vakansiya yaratildi!");
        } catch (error) {
            console.error("❌ Xatolik:", error.response?.data || error.message);
            alert("Xatolik: vakansiya yaratilmadi");
        }
    };

    return (
        <div>
            <StepOne formData={formData} setFormData={setFormData} />
            <button onClick={handleSubmit} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                Yuborish
            </button>
        </div>
    );
}
