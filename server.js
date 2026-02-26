const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* =========================
   TRANG CHỦ
========================= */

app.get("/", (req, res) => {
    res.send("🔥 TikTok Photo API by Duy Bảo 🔥");
});

/* =========================
   API TẢI ẢNH TIKTOK
========================= */

app.get("/api/tiktok/photo", async (req, res) => {

    const url = req.query.url;

    if (!url) {
        return res.json({
            status: false,
            message: "Thiếu link TikTok"
        });
    }

    try {

        // Gọi API trung gian
        const response = await axios.get(`https://www.tikwm.com/api/`, {
            params: {
                url: url,
                hd: 1
            }
        });

        if (!response.data || !response.data.data) {
            return res.json({
                status: false,
                message: "Không lấy được dữ liệu"
            });
        }

        const data = response.data.data;

        // Nếu là slideshow ảnh
        if (data.images && data.images.length > 0) {
            return res.json({
                status: true,
                type: "photo",
                total_image: data.images.length,
                images: data.images
            });
        }

        // Nếu là video thường
        return res.json({
            status: true,
            type: "video",
            video: data.play
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Lỗi khi tải dữ liệu",
            error: err.message
        });
    }

});

app.listen(PORT, () => {
    console.log("Server chạy tại port", PORT);
});
