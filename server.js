const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// ✅ HEADER ẨN BẢN QUYỀN
app.use((req, res, next) => {
    res.setHeader("X-Owner", "Thuộc bản quyền bởi Duy Bảo");
    res.setHeader("X-Developer", "Develop bởi Duy Bảo");
    next();
});

/* =========================
   TRANG CHỦ
========================= */

app.get("/", (req, res) => {
    res.send(`
        <h1>🔥 TikTok Photo API 🔥</h1>
        <p><b>Thuộc bản quyền bởi Duy Bảo</b></p>
        <p>Develop bởi Duy Bảo</p>
    `);
});

/* =========================
   API TẢI ẢNH TIKTOK
========================= */

app.get("/api/tiktok/photo", async (req, res) => {

    const url = req.query.url;

    if (!url) {
        return res.json({
            status: false,
            owner: "Duy Bảo",
            developer: "Duy Bảo",
            message: "Thiếu link TikTok"
        });
    }

    try {

        const response = await axios.get(`https://www.tikwm.com/api/`, {
            params: {
                url: url,
                hd: 1
            }
        });

        if (!response.data || !response.data.data) {
            return res.json({
                status: false,
                owner: "Duy Bảo",
                developer: "Duy Bảo",
                message: "Không lấy được dữ liệu"
            });
        }

        const data = response.data.data;

        if (data.images && data.images.length > 0) {
            return res.json({
                status: true,
                owner: "Duy Bảo",
                developer: "Duy Bảo",
                type: "photo",
                total_image: data.images.length,
                images: data.images
            });
        }

        return res.json({
            status: true,
            owner: "Duy Bảo",
            developer: "Duy Bảo",
            type: "video",
            video: data.play
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            owner: "Duy Bảo",
            developer: "Duy Bảo",
            message: "Lỗi khi tải dữ liệu",
            error: err.message
        });
    }

});

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server chạy tại port", PORT);
});
