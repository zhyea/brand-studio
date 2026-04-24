import {
    EDITOR_HTML,
    SESSION_CAPTURE,
    SESSION_EPOCH,
    SESSION_ERROR,
} from './sessionKeys';

chrome.action.onClicked.addListener(async () => {
    let dataUrl: string | null = null;
    let error: string | null = null;
    try {
        dataUrl = await chrome.tabs.captureVisibleTab({format: 'png', quality: 100});
    } catch (e) {
        const fallback = chrome.i18n.getMessage('err_capture_tab');
        error = e instanceof Error ? e.message : fallback || 'Capture failed';
    }

    if (!dataUrl) {
        try {
            await chrome.action.setBadgeText({text: '!'});
            await chrome.action.setBadgeBackgroundColor({color: '#C62828'});
            const tip = error || chrome.i18n.getMessage('err_capture_tab');
            if (tip) await chrome.action.setTitle({title: tip});
            setTimeout(() => {
                void chrome.action.setBadgeText({text: ''});
                void chrome.action.setTitle({title: chrome.i18n.getMessage('extActionTitle')});
            }, 5000);
        } catch {
            /* ignore */
        }
        return;
    }

    try {
        await chrome.action.setBadgeText({text: ''});
    } catch {
        /* ignore */
    }

    await chrome.storage.session.set({
        [SESSION_CAPTURE]: dataUrl,
        [SESSION_ERROR]: null,
        [SESSION_EPOCH]: Date.now(),
    });

    const editorUrl = chrome.runtime.getURL(EDITOR_HTML);
    const tabs = await chrome.tabs.query({});
    const existing = tabs.find((t) => t.url?.split('#')[0] === editorUrl);

    if (existing?.id != null) {
        await chrome.tabs.update(existing.id, {active: true});
    } else {
        await chrome.tabs.create({url: editorUrl});
    }
});
