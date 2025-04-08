export async function getUserId() {
    return new Promise((resolve, reject) => {
      if (chrome?.storage?.sync) {
        chrome.storage.sync.get("userId", (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else if (result.userId) {
            resolve(result.userId);
          } else {
            const newUserId = crypto.randomUUID();
            chrome.storage.sync.set({ userId: newUserId }, () => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                resolve(newUserId);
              }
            });
          }
        });
      } else {
        // Fallback for localStorage (non-extension environment)
        let localUserId = localStorage.getItem("userId");
        if (!localUserId) {
          localUserId = crypto.randomUUID();
          localStorage.setItem("userId", localUserId);
        }
        resolve(localUserId);
      }
    });
  }
  