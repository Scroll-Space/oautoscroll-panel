import { PluginStorage } from './scroll-core/m_storage.js';
import { EditorController } from './scroll-core/m_editor.js';

export class PluginUIController {
    /** @type {Window} */
    #win;
    /** @type {PluginStorage} */
    #plugStore;
    /** @type {EditorController} */
    #editorCtrl;

    // Кэш DOM-элементов
    #el_message;
    #el_saveBtn;
    #el_moveBtn;
    #el_moveOnOpenCb;
    #el_saveOnCloseCb;
    #el_keysCount;
    #el_clearAllBtn;

    /**
     * @param {Window} win 
     * @param {PluginStorage} plugStore - Обязательное хранилище
     * @param {EditorController} editorCtrl - Контроллер редактора
     */
    constructor(win, plugStore, editorCtrl) {
        this.#win = win;
        this.#plugStore = plugStore;
        this.#editorCtrl = editorCtrl;
    }

    // Инициализация UI: ищем элементы и привязываем события
    initUI() {
        this.#cacheElements();
        this.#bindEvents();
        this.update();
    }

    #cacheElements() {
        this.#el_message = this.#win.document.getElementById('scrollInfoMessage');
        this.#el_saveBtn = this.#win.document.getElementById('saveScrollBtn');
        this.#el_moveBtn = this.#win.document.getElementById('moveScrollBtn');
        this.#el_moveOnOpenCb = this.#win.document.getElementById('moveOnOpenCheckbox');
        this.#el_saveOnCloseCb = this.#win.document.getElementById('saveOnCloseCheckbox');
        this.#el_keysCount = this.#win.document.getElementById('keysCount');
        this.#el_clearAllBtn = this.#win.document.getElementById('clearAllBtn');
    }

    #bindEvents() {
        // Используем стрелочные функции, чтобы не терять `this` класса
        this.#el_saveBtn?.addEventListener('click', () => {
            let view = this.#editorCtrl.getView();
            this.#plugStore.saveView(view);
            this.update();
        });

        this.#el_moveBtn?.addEventListener('click', () => {

            let savedView = this.#plugStore.getView();
            this.#editorCtrl.setView(savedView);

        });

        this.#el_moveOnOpenCb?.addEventListener('change', (e) => {
            this.#plugStore.setMoveByOpenFlag(e.target.checked);
            this.update();
        });

        this.#el_saveOnCloseCb?.addEventListener('change', (e) => {
            this.#plugStore.setSaveByCloseFlag(e.target.checked);
            this.update();
        });

        this.#el_clearAllBtn?.addEventListener('click', () => {
            this.#plugStore.clearAll();
            this.update();
        });
    }

    update() {
        this.updViewInfo();
        this.updPlugStoreStats();
        this.updMoveOnOpenCheckbox();
        this.updSaveOnCloseCheckbox();
    }

    updViewInfo() {
        if (!this.#el_message) return;

        let savedView = this.#plugStore.getView();

        if (savedView === null) {
            this.#el_message.textContent = 'ℹ️ Документ открыт впервые. Сохраненная позиция не найдена.';
            this.#el_message.className = 'message info';
        } else {
            let viewText = `x: ${savedView.x}\ny: ${savedView.y}\nzoom: ${savedView.zoom}%`;            
            this.#el_message.textContent = viewText;
            this.#el_message.className = 'message success';
        }
    }

    updPlugStoreStats() {
        if (this.#el_keysCount) {
            this.#el_keysCount.textContent = this.#plugStore.count();
        }
    }

    updMoveOnOpenCheckbox() {
        if (this.#el_moveOnOpenCb) {
            this.#el_moveOnOpenCb.checked = this.#plugStore.getMoveByOpenFlag();
        }
    }

    updSaveOnCloseCheckbox() {
        if (this.#el_saveOnCloseCb) {
            this.#el_saveOnCloseCb.checked = this.#plugStore.getSaveByCloseFlag();
        }
    }
}
