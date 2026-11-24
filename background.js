const archiveOrigin = "https://archive.ls";

chrome.action.onClicked.addListener(async (tab) => {
  let page;
  try {
    page = new URL(tab.url);
  } catch {
    await showError(tab.id, "This tab has no readable address.");
    return;
  }

  if (!["http:", "https:"].includes(page.protocol) || page.username || page.password) {
    await showError(tab.id, "Open a web page with a public address to look it up.");
    return;
  }

  if (page.origin === archiveOrigin) {
    return;
  }

  page.hash = "";
  try {
    await chrome.tabs.create({ url: archiveOrigin + "/" + page.href });
    await chrome.action.setBadgeText({ tabId: tab.id, text: "" });
    await chrome.action.setTitle({ tabId: tab.id, title: "Look up this page on archive.ls" });
  } catch {
    await showError(tab.id, "Could not open archive.ls. Click to try again.");
  }
});

async function showError(tabId, message) {
  await chrome.action.setBadgeText({ tabId, text: "!" });
  await chrome.action.setTitle({ tabId, title: message });
}
