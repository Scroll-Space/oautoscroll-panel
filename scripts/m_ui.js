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
    #el_viewCard;
    #el_viewCardText;
    #el_clearScrollBtn
    #el_saveBtn;
    #el_moveOnOpenCb;
    #el_saveOnCloseCb;
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
        this.#el_viewCard = this.#win.document.getElementById('viewCard');
        this.#el_viewCardText = this.#win.document.getElementById('viewCardText');
        this.#el_clearScrollBtn = this.#win.document.getElementById('clearScrollBtn');
        this.#el_saveBtn = this.#win.document.getElementById('saveScrollBtn');
        this.#el_moveOnOpenCb = this.#win.document.getElementById('moveOnOpenCheckbox');
        this.#el_saveOnCloseCb = this.#win.document.getElementById('saveOnCloseCheckbox');
        this.#el_clearAllBtn = this.#win.document.getElementById("clearAllBtn");
    }

    #bindEvents() {

        this.#el_clearScrollBtn?.addEventListener('click', () => {
            this.#plugStore.removeView()
            this.update();

        });

        this.#el_viewCard?.addEventListener('click', () => {
            let savedView = this.#plugStore.getView();
            this.#editorCtrl.setView(savedView);
        });

        // Используем стрелочные функции, чтобы не терять `this` класса
        this.#el_saveBtn?.addEventListener('click', async () => {
            let view = this.#editorCtrl.getView();
            this.#plugStore.saveView(view);
            this.update();
        });

        this.#el_moveOnOpenCb?.addEventListener('change', (e) => {
            this.#plugStore.setMoveByOpenFlag(e.target.checked);
            this.update();
        });

        this.#el_saveOnCloseCb?.addEventListener('change', (e) => {
            this.#plugStore.setSaveByCloseFlag(e.target.checked);
            this.update();
        });

        // Используем стрелочные функции, чтобы не терять `this` класса
        this.#el_clearAllBtn?.addEventListener('click', () => {
            this.#plugStore.clearAll();
            this.update();
        });
    }

    update() {
        this.updViewInfo();
        this.updMoveOnOpenCheckbox();
        this.updSaveOnCloseCheckbox();
    }

    updViewInfo() {
    if (!this.#el_viewCard || !this.#el_viewCardText) return;

    const savedView = this.#plugStore.getView();

    if (!savedView) {
        this.#el_viewCardText.textContent = 'Документ открыт впервые, сохраненная позиция не найдена';
        this.#el_viewCard.classList.add('disabled');

        // Делаем кнопку невидимой, но оставляем место под нее
        if (this.#el_clearScrollBtn) {
            this.#el_clearScrollBtn.disabled = true;
        }
    } else {
        this.#el_viewCard.classList.remove('disabled');
        this.#el_viewCardText.innerHTML = `
            <div>x: <span class="val">${Number(savedView.x).toFixed(2)}</span></div>
            <div>y: <span class="val">${Number(savedView.y).toFixed(2)}</span></div>
            <div>zoom: <span class="val">${savedView.zoom}%</span></div>
        `;

        // Показываем кнопку
        if (this.#el_clearScrollBtn) {
            this.#el_clearScrollBtn.disabled = false;
        }
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
