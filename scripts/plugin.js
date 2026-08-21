import { PluginStorage } from './scroll-core/m_storage.js';
import { EditorController } from './scroll-core/m_editor.js';
import { PluginUIController } from './m_ui.js';

const plugStore = new PluginStorage(window);
const editorCtrl = new EditorController(window);
const uiCtrl = new PluginUIController(window, plugStore, editorCtrl);

window.Asc.plugin.init = function () {
    console.log("🔄 AutoScroll Panel init");
    uiCtrl.initUI();
};

// 2. Глобальный перехват смены темы от редактора ONLYOFFICE
window.Asc.plugin.onThemeChanged = function (theme) {
    if (!theme) return;

    // Вызываем базовое обновление SDK ONLYOFFICE (оно обновляет переменные plugins.css)
    if (typeof window.Asc.plugin.onThemeChangedBase === "function") {
        window.Asc.plugin.onThemeChangedBase(theme);
    }

    const isDark = theme.type === "dark" || theme.type === "contrast-dark";

    if (isDark) {
        document.documentElement.setAttribute("data-theme", "dark");
        document.body.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
        document.body.removeAttribute("data-theme");
    }
};
