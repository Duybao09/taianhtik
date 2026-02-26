const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// HEADER bản quyền
app.use((req, res, next) => {
    res.setHeader("X-Owner", "API thuộc quyền sở hữu và develop bởi Duy Bảo");
    next();
});

// Trang chủ
app.get("/", (req, res) => {
    res.send(`
        <h1>🔥 TikTok Photo API 🔥</h1>
        <p>API thuộc quyền sở hữu và develop bởi <b>Duy Bảo</b></p>
        <p>/api/tiktok/photo?url=LINK</p>
    `);
});

// API
app.get("/api/tiktok/photo", async (req, res) => {
    try {
        const url = req.query.url;

        if (!url) {
            return res.json({
                status: false,
                owner: "Duy Bảo",
                message: "Thiếu link"
            });
        }

        const response = await axios.get("https://www.tikwm.com/api/", {
            params: { url }
        });

        const data = response.data.data;

        return res.json({
            status: true,
            owner: "Duy Bảo",
            type: data.images ? "photo" : "video",
            images: data.images || null,
            video: data.play || null
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            owner: "Duy Bảo",
            message: "Lỗi server"
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server chạy tại port " + PORT);
});
