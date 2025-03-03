let ros = null;

// ROS接続
const connectROS = (protocol, ip, port, ros_domain_id) => {

    if (ros) return;

    // roslib.js
    ros = new ROSLIB.Ros({
        url: `${protocol}://${ip}:${port}`,
        options: {
            ros_domain_id: ros_domain_id
        }
    })

    ros.on("connection", () => {
        const status = document.getElementById("status");
        status.textContent = `🟢【ROS接続状況】接続済（${protocol}://${ip}:${port} ID=${ros_domain_id}）`;
        console.log("【INFO】Connected");
    });

    // エラー発生時
    ros.on("error", (error) => {
        const status = document.getElementById("status");
        status.textContent = `🔴【ROS接続状況】エラー（${protocol}://${ip}:${port} ID=${ros_domain_id}）`;
        console.log("【ERROR】", error);
    });

    // 接続修了時
    ros.on("close", () => {
        const status = document.getElementById("status");
        status.textContent = `🟡【ROS接続状況】未接続（${protocol}://${ip}:${port} ID=${ros_domain_id}）`;
        console.log("【INFO】Connection closed");
        ros = null;
    });

    // CompressedImage型
    const image = new ROSLIB.Topic({
        ros: ros,
        name: "/mobile/camera/image_raw/compressed",
        messageType: "sensor_msgs/msg/CompressedImage"
    });

    let stream = null;
    let isSending = false;
    let intervalID = null;

    const startCamera = async () => {
        document.getElementById("send-btn").textContent = "終了";

        try {
            if (stream) return;

            // カメラ映像を取得
            const video = document.getElementById("camera");
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    // リアカメラ
                    facingMode: "environment"
                }
            });

            isSending = true;

            video.srcObject = stream;
            
            intervalID = setInterval(() => {
                const canvas = document.getElementById("canvas");
                const ctx = canvas.getContext("2d");
                
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // JPEGエンコード
                canvas.toBlob(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64data = reader.result.split(",")[1];
                        const image_msg = new ROSLIB.Message({
                            format: "jpeg",
                            data: base64data
                        })
                        image.publish(image_msg);
                    };
                    reader.readAsDataURL(blob);
                }, "image/jpeg");

            }, 1000);
            // 1000[ms]

        } catch (error) {
            console.error("【ERROR】", error)
        }
    }

    const stopCamera = () => {
        if (intervalID) {
            clearInterval(intervalID);
            intervalID = null;
        }
    
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            document.getElementById("camera").srcObject = null;
            stream = null;
        }
    
        isSending = false;
        document.getElementById("send-btn").textContent = "開始";
    }

    document.getElementById("send-btn").addEventListener("click", () => {
        if (isSending) {
            stopCamera();
        } else {
            startCamera();
        }
    });
}

// ページ読み込み時
window.addEventListener("load", () => {
    const protocol = document.getElementById("protocol").value;
    const ip = document.getElementById("ip").value;
    const port = document.getElementById("port").value;
    const ros_domain_id = document.getElementById("ros_domain_id").value;
    connectROS(protocol, ip, port, ros_domain_id);
});

// 「接続」押下時
document.getElementById("connect").addEventListener("click", () => {
    const protocol = document.getElementById("protocol").value;
    const ip = document.getElementById("ip").value;
    const port = document.getElementById("port").value;
    const ros_domain_id = document.getElementById("ros_domain_id").value;
    connectROS(protocol, ip, port, ros_domain_id);
});

// 「R1」押下時
document.getElementById("connect_R1").addEventListener("click", () => {
    const protocol = "wss";
    document.getElementById("protocol").value = protocol;
    const ip = "192.168.2.10";
    document.getElementById("ip").value = ip;
    const port = "9090";
    document.getElementById("port").value = port;
    const ros_domain_id = "10";
    document.getElementById("ros_domain_id").value = ros_domain_id;
    connectROS(protocol, ip, port, ros_domain_id);
});

// 「R2」押下時
document.getElementById("connect_R2").addEventListener("click", () => {
    const protocol = "wss";
    document.getElementById("protocol").value = protocol;
    const ip = "192.168.2.20";
    document.getElementById("ip").value = ip;
    const port = "9090";
    document.getElementById("port").value = port;
    const ros_domain_id = "20";
    document.getElementById("ros_domain_id").value = ros_domain_id;
    connectROS(protocol, ip, port, ros_domain_id);
});

// 「試験」押下時
document.getElementById("connect_Test").addEventListener("click", () => {
    const protocol = "wss";
    document.getElementById("protocol").value = protocol;
    const ip = "dell-pc.local";
    document.getElementById("ip").value = ip;
    const port = "9090";
    document.getElementById("port").value = port;
    const ros_domain_id = "10";
    document.getElementById("ros_domain_id").value = ros_domain_id;
    connectROS(protocol, ip, port, ros_domain_id);
});