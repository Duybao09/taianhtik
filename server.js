const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* =========================
   CÁCH 3 - HEADER ẨN BẢN QUYỀN
========================= */

app.use((req, res, next) => {
    res.setHeader("X-Powered-By", "Developed by Duy Bảo");
    next();
});

/* =========================
   CÁCH 1 - TRANG CHỦ HTML
========================= */

app.get("/", (req, res) => {
    res.send(`
        <html>
        <head>
            <title>API by Duy Bảo</title>
            <style>
                body {
                    background: #111;
                    color: white;
                    text-align: center;
                    font-family: Arial;
                    padding-top: 100px;
                }
                h1 { color: #00ffcc; }
                p { font-size: 18px; }
            </style>
        </head>
        <body>
            <h1>🔥 TikTok Photo API 🔥</h1>
            <p>API thuộc quyền sở hữu và develop bởi <b>Duy Bảo</b></p>
            <p>Version: 1.0.0</p>
            <p>Endpoint: /api/tiktok/photo?url=LINK</p>
        </body>
        </html>
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
            message: "Thiếu link TikTok"
        });
    }

    try {

        const response = await axios.get("https://www.tikwm.com/api/", {
            params: {
                url: url,
                hd: 1
            }
        });

        if (!response.data || !response.data.data) {
            return res.json({
                status: false,
                owner: "Duy Bảo",
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
            message: "Lỗi khi tải dữ liệu",
            error: err.message
        });
    }

});

app.listen(PORT, () => {
    console.log("Server chạy tại port", PORT);
});
