const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* =========================
   CÁCH 3 - HEADER ẨN
========================= */
app.use((req, res, next) => {
    res.setHeader("X-Owner", "API thuộc quyền sở hữu và develop bởi Duy Bảo");
    next();
});

/* =========================
   CÁCH 1 - TRANG CHỦ HTML
========================= */
app.get("/", (req, res) => {
    res.status(200).send(`
        <html>
        <head>
            <title>API by Duy Bảo</title>
            <style>
                body {
                    background: #0f172a;
                    color: white;
                    text-align: center;
                    font-family: Arial;
                    padding-top: 100px;
                }
                h1 { color: #00ffcc; }
                p { font-size: 18px; }
                .box {
                    background: #1e293b;
                    display: inline-block;
                    padding: 30px;
                    border-radius: 15px;
                }
            </style>
        </head>
        <body>
            <div class="box">
                <h1>🔥 TikTok Photo API 🔥</h1>
                <p>API thuộc quyền sở hữu và develop bởi <b>Duy Bảo</b></p>
                <p>Version: 1.0.0</p>
                <p>Endpoint: /api/tiktok/photo?url=LINK</p>
            </div>
        </body>
        </html>
    `);
});

/* =========================
   CÁCH 2 - JSON CÓ OWNER
========================= */
app.get("/api/tiktok/photo", async (req, res) => {
    try {
        const url = req.query.url;

        if (!url) {
            return res.status(400).json({
                status: false,
                owner: "Duy Bảo",
                message: "Thiếu link TikTok"
            });
        }

        const response = await axios.get("https://www.tikwm.com/api/", {
            params: { url: url }
        });

        if (!response.data || !response.data.data) {
            return res.status(404).json({
                status: false,
                owner: "Duy Bảo",
                message: "Không lấy được dữ liệu"
            });
        }

        const data = response.data.data;

        return res.json({
            status: true,
            owner: "Duy Bảo",
            developer: "Duy Bảo",
            type: data.images ? "photo" : "video",
            total_image: data.images ? data.images.length : 0,
            images: data.images || null,
            video: data.play || null
        });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            status: false,
            owner: "Duy Bảo",
            message: "Lỗi server",
            error: err.message
        });
    }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, "0.0.0.0", () => {
    console.log("Server chạy tại port " + PORT);
});
