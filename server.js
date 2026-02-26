const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 ĐỔI KEY Ở ĐÂY
const API_KEY = "htrang245";

app.use(cors());

/* =========================
   TRANG CHỦ
========================= */
app.get("/", (req, res) => {
    res.send("🔥 TikTok Full Info API - API by Duy Bảo 🔥");
});

/* =========================
   API TIKTOK FULL INFO + KEY
========================= */
app.get("/api/tiktok/photo", async (req, res) => {

    const { url, apikey } = req.query;

    // ❌ Kiểm tra API KEY
    if (!apikey) {
        return res.status(401).json({
            api: "API by Duy Bảo",
            status: false,
            message: "Thiếu API Key"
        });
    }

    if (apikey !== API_KEY) {
        return res.status(403).json({
            api: "API by Duy Bảo",
            status: false,
            message: "API Key không hợp lệ"
        });
    }

    // ❌ Kiểm tra link
    if (!url) {
        return res.json({
            api: "API by Duy Bảo",
            status: false,
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
                api: "API by Duy Bảo",
                status: false,
                message: "Không lấy được dữ liệu"
            });
        }

        const data = response.data.data;

        return res.json({
            api: "API by Duy Bảo",
            status: true,

            title: data.title,
            create_time: data.create_time,
            region: data.region,
            duration: data.duration,

            author: {
                id: data.author?.id,
                unique_id: data.author?.unique_id,
                nickname: data.author?.nickname,
                avatar: data.author?.avatar
            },

            statistics: {
                views: data.play_count,
                likes: data.digg_count,
                comments: data.comment_count,
                shares: data.share_count,
                downloads: data.download_count
            },

            type: data.images ? "photo" : "video",
            total_image: data.images ? data.images.length : 0,
            images: data.images || null,
            video: data.play || null,
            thumbnail: data.cover,
            music: data.music
        });

    } catch (err) {
        return res.status(500).json({
            api: "API by Duy Bảo",
            status: false,
            message: "Lỗi server",
            error: err.message
        });
    }

});

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server chạy tại port " + PORT);
});
