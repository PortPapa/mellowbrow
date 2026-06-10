import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// 기본 구성 — ISR/태그 캐시를 쓰지 않으므로 캐시 오버라이드 없음.
// 필요해지면 https://opennext.js.org/cloudflare/caching 참고.
export default defineCloudflareConfig();
