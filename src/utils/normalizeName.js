export function normalizeName(input) {
    if (!input) return "—";
    // bo'sh joylarni tartiblaymiz
    const s = String(input).trim().replace(/\s+/g, " ");
    // har bir so'z bo'yicha: 1-harf katta, qolganlari kichik
    return s
        .split(" ")
        .map((word) => {
            if (!word) return "";
            const lower = word.toLowerCase();
            // faqat so'zning 1-harfini katta qilamiz
            return lower.replace(/^\p{L}/u, (ch) => ch.toUpperCase());
        })
        .join(" ");
}