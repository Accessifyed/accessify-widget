
(function () {
    const API_KEY = "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";
    const MODEL = "microsoft/mai-ds-r1:free";
    const REFERER = "https://65420252-0d36-4519-9005-ec5d275c2bf2-00-1t2kiwc03ckq8.spock.replit.dev";

    const style = document.createElement('style');
    style.innerHTML = `
        #accessify-widget-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background-color: #f77f00;
            color: white;
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            font-size: 24px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    const button = document.createElement('button');
    button.id = "accessify-widget-btn";
    button.innerText = "🧠";
    button.title = "Texte vereinfachen";
    document.body.appendChild(button);

    button.onclick = async function () {
        const elements = document.querySelectorAll("p, h1, h2, h3, li, span, div");
        for (const el of elements) {
            if (!el.innerText || el.innerText.length < 20) continue;

            const original = el.innerText.trim();
            el.setAttribute("data-original", original);

            const prompt = "Vereinfache folgenden deutschen Text in klarer, verständlicher Sprache:

" + original;

            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + API_KEY,
                        "HTTP-Referer": REFERER,
                        "X-Title": "Accessify Simplifier"
                    },
                    body: JSON.stringify({
                        model: MODEL,
                        messages: [{ role: "user", content: prompt }],
                        max_tokens: 250,
                        temperature: 0.7
                    })
                });

                const resultText = await response.text();
                const data = JSON.parse(resultText);
                const simplified =
                    data.choices?.[0]?.message?.content ||
                    data.choices?.[0]?.text ||
                    data.text ||
                    null;

                if (simplified) {
                    el.innerText = simplified.trim();
                } else {
                    el.innerText = "[Vereinfachung nicht möglich]";
                }

            } catch (err) {
                console.error("Vereinfachung fehlgeschlagen:", err);
                el.innerText = "[Fehler beim Vereinfachen]";
            }
        }
    };
})();
