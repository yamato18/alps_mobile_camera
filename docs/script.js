if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(
        (registration) => {
            console.log("ServiceWorker registration successful with scope: ", registration.scope);

            registration.addEventListener("updatefound", () => {
                const installWorker = registration.installing;
                if (installWorker != null) {
                    installWorker.onstatechange = (e) => {
                        if (e.target.state == "activated") {
                            navigator.serviceWorker.controller.postMessage({ type: "GET_VERSION" });
                            navigator.serviceWorker.addEventListener("message", (event) => {
                                if (event.data && event.data.type === "VERSION") {
                                    const newVersion = event.data.version;
                                    document.getElementById("sw-version").textContent = `Ver. ${newVersion}`;
                                    alert(`【アップデート Ver. ${newVersion}】\nWebアプリが更新されました。アプリを再起動してください。\n一部の環境では更新が正しく適用されない場合があります。Webアプリを一度削除し、キャッシュの削除を実行の上で再度インストールしてください。`);
                                }
                            });
                        }
                    };
                }
            });

            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({ type: "GET_VERSION" });
                navigator.serviceWorker.addEventListener("message", (event) => {
                    if (event.data && event.data.type === "VERSION") {
                        const currentVersion = event.data.version;
                        document.getElementById("sw-version").textContent = `Ver. ${currentVersion}`;                              
                    }
                });
            }
        },
        (error) => {
            console.error(`ServiceWorker registration failed: ${error}`);
        },
    );
} else {
    console.error("ServiceWorkers are not supported.");
}

const info = document.getElementById("info");
info.addEventListener("click", () => {
    alert("E-Mail: yamato151008<at>gmail.com\nCopyright © 2025 Shirahata Yamato All Rights Reserved.");
});