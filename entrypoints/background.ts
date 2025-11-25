import { fetchTranscript } from "youtube-transcript-plus";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
});
