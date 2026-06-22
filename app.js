/* ==========================================================================
   APP STATE & TRANSLATIONS
   ========================================================================== */
let state = {
    groups: [],
    activeGroupId: null,
    theme: 'dark',
    language: 'en'
};

const TRANSLATIONS = {
    en: {
        "groups-title": "Groups",
        "create-group-tooltip": "Create New Group",
        "empty-title": "No Groups Found",
        "empty-desc": "Start organizing your tasks by creating your first list group.",
        "btn-create-first-group": "Create Group",
        "modal-title-add": "Create New Group",
        "modal-title-edit": "Edit Group Details",
        "label-group-name": "Group Name",
        "group-name-placeholder": "e.g. Work, Personal, Shopping",
        "label-accent-color": "Accent Color",
        "btn-cancel": "Cancel",
        "btn-save": "Save Group",
        
        // Inline & Dynamic Elements
        "lists": "lists",
        "tasks-completed": "tasks completed",
        "edit-group": "Edit Group",
        "delete-group": "Delete Group",
        "confirm-delete-group": "Are you sure you want to delete this group and all its checklist lists? This action cannot be undone.",
        "rename-list": "Rename List",
        "delete-list": "Delete List",
        "confirm-delete-list": 'Delete the list "{name}"?',
        "progress": "Progress",
        "no-items": "No items yet",
        "delete-item": "Delete Item",
        "add-item-placeholder": "Add an item...",
        "add-new-list": "Add New List",
        "list-name-label": "List Name",
        "list-name-placeholder": "e.g. Shopping, Homework",
        "btn-create": "Create"
    },
    ar: {
        "groups-title": "المجموعات",
        "create-group-tooltip": "إنشاء مجموعة جديدة",
        "empty-title": "لم يتم العثور على مجموعات",
        "empty-desc": "ابدأ بتنظيم مهامك عن طريق إنشاء مجموعة قوائم أولى.",
        "btn-create-first-group": "إنشاء مجموعة",
        "modal-title-add": "إنشاء مجموعة جديدة",
        "modal-title-edit": "تعديل بيانات المجموعة",
        "label-group-name": "اسم المجموعة",
        "group-name-placeholder": "مثال: العمل، شخصي، تسوق",
        "label-accent-color": "لون التمييز",
        "btn-cancel": "إلغاء",
        "btn-save": "حفظ المجموعة",
        
        // Inline & Dynamic Elements
        "lists": "قوائم",
        "tasks-completed": "من المهام مكتملة",
        "edit-group": "تعديل المجموعة",
        "delete-group": "حذف المجموعة",
        "confirm-delete-group": "هل أنت متأكد أنك تريد حذف هذه المجموعة وجميع القوائم الخاصة بها؟ لا يمكن التراجع عن هذا الإجراء.",
        "rename-list": "إعادة تسمية القائمة",
        "delete-list": "حذف القائمة",
        "confirm-delete-list": 'هل تريد حذف قائمة "{name}"؟',
        "progress": "التقدم",
        "no-items": "لا توجد عناصر بعد",
        "delete-item": "حذف العنصر",
        "add-item-placeholder": "أضف عنصراً...",
        "add-new-list": "إضافة قائمة جديدة",
        "list-name-label": "اسم القائمة",
        "list-name-placeholder": "مثال: التسوق، الواجبات",
        "btn-create": "إنشاء"
    }
};

const DEFAULT_GROUPS_EN = [
    {
        id: 'group-default-work',
        name: '🚀 Work Tasks',
        color: '#3b82f6',
        lists: [
            {
                id: 'list-project-launch',
                name: 'Project Launch Checklist',
                items: [
                    { id: 'item-1', text: 'Design interface mockup', completed: true },
                    { id: 'item-2', text: 'Create responsive HTML structure', completed: true },
                    { id: 'item-3', text: 'Implement localStorage persistence', completed: true },
                    { id: 'item-4', text: 'Integrate dynamic themes & accent colors', completed: false },
                    { id: 'item-5', text: 'Write automated tests & verification plan', completed: false }
                ]
            },
            {
                id: 'list-daily-ops',
                name: 'Daily Scrum Prep',
                items: [
                    { id: 'item-6', text: 'Review team backlog metrics', completed: false },
                    { id: 'item-7', text: 'Submit daily updates to manager', completed: true }
                ]
            }
        ]
    },
    {
        id: 'group-default-personal',
        name: '🏡 Personal Life',
        color: '#8b5cf6',
        lists: [
            {
                id: 'list-groceries',
                name: 'Grocery List 🍉',
                items: [
                    { id: 'item-8', text: 'Oat milk (unsweetened)', completed: true },
                    { id: 'item-9', text: 'Avocados & Blueberries', completed: false },
                    { id: 'item-10', text: 'Organic dark chocolate 🍫', completed: false }
                ]
            },
            {
                id: 'list-reading',
                name: 'Books to Read',
                items: [
                    { id: 'item-11', text: 'Atomic Habits by James Clear', completed: true },
                    { id: 'item-12', text: 'The Pragmatic Programmer', completed: false }
                ]
            }
        ]
    }
];

const DEFAULT_GROUPS_AR = [
    {
        id: 'group-default-work',
        name: '🚀 مهام العمل',
        color: '#3b82f6',
        lists: [
            {
                id: 'list-project-launch',
                name: 'قائمة إطلاق المشروع',
                items: [
                    { id: 'item-1', text: 'تصميم نموذج الواجهة', completed: true },
                    { id: 'item-2', text: 'إنشاء هيكل HTML متجاوب', completed: true },
                    { id: 'item-3', text: 'تنفيذ حفظ البيانات محلياً', completed: true },
                    { id: 'item-4', text: 'دمج السمات وألوان التمييز الديناميكية', completed: false },
                    { id: 'item-5', text: 'كتابة خطة التحقق والاختبارات الآلية', completed: false }
                ]
            },
            {
                id: 'list-daily-ops',
                name: 'التحضير للاجتماع اليومي',
                items: [
                    { id: 'item-6', text: 'مراجعة مقاييس العمل المتراكم للفريق', completed: false },
                    { id: 'item-7', text: 'إرسال التحديثات اليومية للمدير', completed: true }
                ]
            }
        ]
    },
    {
        id: 'group-default-personal',
        name: '🏡 الحياة الشخصية',
        color: '#8b5cf6',
        lists: [
            {
                id: 'list-groceries',
                name: 'قائمة البقالة 🍉',
                items: [
                    { id: 'item-8', text: 'حليب الشوفان (غير محلى)', completed: true },
                    { id: 'item-9', text: 'أفوكادو وتوت بري', completed: false },
                    { id: 'item-10', text: 'شوكولاتة داكنة عضوية 🍫', completed: false }
                ]
            },
            {
                id: 'list-reading',
                name: 'كتب للقراءة',
                items: [
                    { id: 'item-11', text: 'كتاب العادات الذرية لجيمس كلير', completed: true },
                    { id: 'item-12', text: 'المبرمج البراغماتي', completed: false }
                ]
            }
        ]
    }
];

/* ==========================================================================
   TRANSLATION TRANSLATOR ENGINE
   ========================================================================== */
function t(key, vars = {}) {
    const lang = state.language || 'en';
    let text = (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) ? TRANSLATIONS[lang][key] : key;
    for (const [k, v] of Object.entries(vars)) {
        text = text.replace(`{${k}}`, v);
    }
    return text;
}

function translateUi() {
    const lang = state.language || 'en';
    
    // Update HTML attribute hooks
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Switch language button text indicators
    const langToggleBtn = document.getElementById('lang-toggle');
    if (langToggleBtn) {
        langToggleBtn.textContent = lang === 'en' ? 'AR' : 'EN';
    }
    
    // Translate all static nodes with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.setAttribute('placeholder', t(key));
    });

    // Translate tooltip titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.setAttribute('title', t(key));
    });
}

function toggleLanguage() {
    const newLang = state.language === 'en' ? 'ar' : 'en';
    
    // If the active state groups represent the default unedited groups, we can swap them for localized defaults
    const isCurrentlyDefaultEn = JSON.stringify(state.groups.map(g => g.name)) === JSON.stringify(DEFAULT_GROUPS_EN.map(g => g.name));
    const isCurrentlyDefaultAr = JSON.stringify(state.groups.map(g => g.name)) === JSON.stringify(DEFAULT_GROUPS_AR.map(g => g.name));
    
    state.language = newLang;
    
    if (isCurrentlyDefaultEn && newLang === 'ar') {
        state.groups = JSON.parse(JSON.stringify(DEFAULT_GROUPS_AR));
        state.activeGroupId = state.groups[0].id;
    } else if (isCurrentlyDefaultAr && newLang === 'en') {
        state.groups = JSON.parse(JSON.stringify(DEFAULT_GROUPS_EN));
        state.activeGroupId = state.groups[0].id;
    }

    saveState();
    renderAll();
}

/* ==========================================================================
   LOCAL STORAGE STORAGE SYNC
   ========================================================================== */
function saveState() {
    localStorage.setItem('tasksphere_state', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('tasksphere_state');
    if (saved) {
        try {
            state = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse saved state, resetting.', e);
            resetToDefault();
        }
    } else {
        resetToDefault();
    }
    
    // Set active group if not exists or invalid
    if (!state.activeGroupId && state.groups.length > 0) {
        state.activeGroupId = state.groups[0].id;
    }
}

function resetToDefault() {
    const lang = state.language || 'en';
    state.groups = JSON.parse(JSON.stringify(lang === 'ar' ? DEFAULT_GROUPS_AR : DEFAULT_GROUPS_EN));
    state.activeGroupId = state.groups[0].id;
    state.theme = 'dark';
    saveState();
}

/* ==========================================================================
   THEME TOGGLER ENGINE
   ========================================================================== */
function initTheme() {
    const theme = state.theme || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    state.theme = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
    saveState();
}

/* ==========================================================================
   UTILITY HELPER FUNCTIONS
   ========================================================================== */
function uuid() {
    return 'id-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
}

function hexToRgb(hex) {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 59, g: 130, b: 246 }; // fallback blue
}

function updateActiveAccentColor() {
    const activeGroup = state.groups.find(g => g.id === state.activeGroupId);
    if (activeGroup) {
        const rgb = hexToRgb(activeGroup.color);
        document.documentElement.style.setProperty('--group-accent', activeGroup.color);
        document.documentElement.style.setProperty('--group-accent-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
}

/* ==========================================================================
   CANVAS CONFETTI PARTICLE SYSTEM
   ========================================================================== */
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrameId = null;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4;
        this.color = color;
        this.speedX = Math.random() * 10 - 5;
        this.speedY = Math.random() * -15 - 5; // Launch upward
        this.gravity = 0.35;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        this.opacity = 1;
        this.fadeSpeed = Math.random() * 0.015 + 0.005;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.rotation += this.rotationSpeed;
        this.opacity -= this.fadeSpeed;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function triggerConfetti() {
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];
    const activeGroup = state.groups.find(g => g.id === state.activeGroupId);
    if (activeGroup) {
        colors.push(activeGroup.color);
    }

    // Spawn point: center bottom half of screen
    const spawnX = window.innerWidth / 2;
    const spawnY = window.innerHeight * 0.7;

    for (let i = 0; i < 80; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const p1 = new ConfettiParticle(spawnX - 100 + Math.random() * 200, spawnY, color);
        particles.push(p1);
    }

    if (!animationFrameId) {
        animateConfetti();
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles = particles.filter(p => p.opacity > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animateConfetti);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationFrameId = null;
    }
}

/* ==========================================================================
   DOM ELEMENTS SELECTORS
   ========================================================================== */
const groupsListContainer = document.getElementById('groups-list');
const groupWorkspace = document.getElementById('group-workspace');
const emptyStateView = document.getElementById('empty-state-view');
const groupHeader = document.getElementById('group-header');
const listsGrid = document.getElementById('lists-grid');

// Modals & Forms
const groupModal = document.getElementById('group-modal');
const groupForm = document.getElementById('group-form');
const groupModalTitle = document.getElementById('group-modal-title');
const groupEditIdInput = document.getElementById('group-edit-id');
const groupNameInput = document.getElementById('group-name');

// Buttons
const btnAddGroupModal = document.getElementById('btn-add-group-modal');
const btnCloseGroupModal = document.getElementById('btn-close-group-modal');
const btnCancelGroupModal = document.getElementById('btn-cancel-group-modal');
const btnCreateFirstGroup = document.getElementById('btn-create-first-group');
const sidebarToggleBtn = document.getElementById('sidebar-toggle');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const sidebar = document.getElementById('sidebar');
const themeToggleBtn = document.getElementById('theme-toggle');
const langToggleBtn = document.getElementById('lang-toggle');

/* ==========================================================================
   MODAL EVENT ACTIONS
   ========================================================================== */
function openGroupModal(editGroupId = null) {
    groupForm.reset();
    
    if (editGroupId) {
        const group = state.groups.find(g => g.id === editGroupId);
        if (group) {
            groupModalTitle.textContent = t('modal-title-edit');
            groupEditIdInput.value = group.id;
            groupNameInput.value = group.name;
            
            const radio = document.querySelector(`input[name="group-color"][value="${group.color}"]`);
            if (radio) radio.checked = true;
        }
    } else {
        groupModalTitle.textContent = t('modal-title-add');
        groupEditIdInput.value = '';
        
        const radio = document.querySelector('input[name="group-color"]');
        if (radio) radio.checked = true;
    }

    groupModal.style.display = 'flex';
    setTimeout(() => {
        groupModal.classList.add('open');
        groupNameInput.focus();
    }, 10);
}

function closeGroupModal() {
    groupModal.classList.remove('open');
    setTimeout(() => {
        groupModal.style.display = 'none';
        groupEditIdInput.value = '';
        groupForm.reset();
    }, 250);
}

/* ==========================================================================
   CORE RENDERING ENGINE
   ========================================================================== */
function renderAll() {
    translateUi();
    updateActiveAccentColor();
    renderGroupsList();
    renderWorkspace();
}

function renderGroupsList() {
    groupsListContainer.innerHTML = '';
    
    state.groups.forEach(group => {
        let totalItems = 0;
        let completedItems = 0;
        group.lists.forEach(list => {
            list.items.forEach(item => {
                totalItems++;
                if (item.completed) completedItems++;
            });
        });

        const activeClass = (group.id === state.activeGroupId) ? 'active' : '';
        
        const groupLink = document.createElement('div');
        groupLink.className = `group-item-link ${activeClass}`;
        groupLink.style.setProperty('--group-accent', group.color);
        groupLink.style.setProperty('--group-accent-rgb', hexToRgb(group.color).r + ',' + hexToRgb(group.color).g + ',' + hexToRgb(group.color).b);
        groupLink.setAttribute('draggable', 'true');
        
        groupLink.innerHTML = `
            <div class="group-item-left">
                <span class="group-color-dot" style="background-color: ${group.color}; --dot-color: ${group.color}"></span>
                <span class="group-item-name" title="${escapeHtml(group.name)}">${escapeHtml(group.name)}</span>
            </div>
            <div class="group-item-right">
                <span class="group-item-count">${completedItems}/${totalItems}</span>
                <button class="group-actions-btn" data-id="${group.id}" title="${t('modal-title-edit')}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </button>
            </div>
        `;

        // Drag and drop listeners
        groupLink.addEventListener('dragstart', (e) => {
            groupLink.classList.add('dragging');
            e.dataTransfer.setData('text/plain', group.id);
            e.dataTransfer.effectAllowed = 'move';
        });

        groupLink.addEventListener('dragend', () => {
            groupLink.classList.remove('dragging');
            document.querySelectorAll('.group-item-link').forEach(el => el.classList.remove('drag-over'));
        });

        groupLink.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            groupLink.classList.add('drag-over');
        });

        groupLink.addEventListener('dragleave', () => {
            groupLink.classList.remove('drag-over');
        });

        groupLink.addEventListener('drop', (e) => {
            e.preventDefault();
            groupLink.classList.remove('drag-over');
            const draggedId = e.dataTransfer.getData('text/plain');
            if (draggedId && draggedId !== group.id) {
                reorderGroups(draggedId, group.id);
            }
        });

        groupLink.addEventListener('click', (e) => {
            if (e.target.closest('.group-actions-btn')) {
                const id = e.target.closest('.group-actions-btn').dataset.id;
                openGroupModal(id);
                return;
            }
            state.activeGroupId = group.id;
            saveState();
            renderAll();
            sidebar.classList.remove('open');
        });

        groupsListContainer.appendChild(groupLink);
    });
}

function renderWorkspace() {
    if (state.groups.length === 0) {
        groupWorkspace.style.display = 'none';
        emptyStateView.style.display = 'flex';
        return;
    }

    groupWorkspace.style.display = 'flex';
    emptyStateView.style.display = 'none';

    const activeGroup = state.groups.find(g => g.id === state.activeGroupId);
    if (!activeGroup) {
        state.activeGroupId = state.groups[0].id;
        renderWorkspace();
        return;
    }

    let totalItems = 0;
    let completedItems = 0;
    activeGroup.lists.forEach(list => {
        list.items.forEach(item => {
            totalItems++;
            if (item.completed) completedItems++;
        });
    });

    const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    groupHeader.innerHTML = `
        <div class="group-header-info">
            <div class="group-title-row">
                <span class="group-accent-bar" style="background-color: ${activeGroup.color}"></span>
                <h2>${escapeHtml(activeGroup.name)}</h2>
            </div>
            <span class="group-stats-subtext">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                ${activeGroup.lists.length} ${t('lists')} &bull; ${completionRate}% ${t('tasks-completed')} (${completedItems}/${totalItems})
            </span>
        </div>
        <div class="group-actions-container">
            <button class="btn btn-secondary" id="btn-edit-group" title="${t('edit-group')}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                ${t('edit-group')}
            </button>
            <button class="btn btn-danger" id="btn-delete-group" title="${t('delete-group')}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                ${t('delete-group')}
            </button>
        </div>
    `;

    document.getElementById('btn-edit-group').addEventListener('click', () => openGroupModal(activeGroup.id));
    document.getElementById('btn-delete-group').addEventListener('click', () => deleteGroup(activeGroup.id));

    listsGrid.innerHTML = '';

    activeGroup.lists.forEach(list => {
        const listTotal = list.items.length;
        const listCompleted = list.items.filter(item => item.completed).length;
        const listPercent = listTotal > 0 ? Math.round((listCompleted / listTotal) * 100) : 0;

        const listCard = document.createElement('div');
        listCard.className = 'list-card';
        listCard.dataset.listId = list.id;
        listCard.setAttribute('draggable', 'true');

        // Drag and drop listeners
        listCard.addEventListener('dragstart', (e) => {
            listCard.classList.add('dragging');
            e.dataTransfer.setData('text/plain', list.id);
            e.dataTransfer.effectAllowed = 'move';
        });

        listCard.addEventListener('dragend', () => {
            listCard.classList.remove('dragging');
            document.querySelectorAll('.list-card').forEach(el => el.classList.remove('drag-over'));
        });

        listCard.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            listCard.classList.add('drag-over');
        });

        listCard.addEventListener('dragleave', () => {
            listCard.classList.remove('drag-over');
        });

        listCard.addEventListener('drop', (e) => {
            e.preventDefault();
            listCard.classList.remove('drag-over');
            const draggedListId = e.dataTransfer.getData('text/plain');
            if (draggedListId && draggedListId !== list.id) {
                reorderLists(activeGroup.id, draggedListId, list.id);
            }
        });

        listCard.innerHTML = `
            <div class="list-card-header">
                <div class="list-title-area">
                    <h3 class="list-title-text" title="${t('rename-list')}">${escapeHtml(list.name)}</h3>
                </div>
                <div class="list-card-header-actions">
                    <button class="list-action-btn btn-rename-list" title="${t('rename-list')}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                    <button class="list-action-btn btn-delete-list" title="${t('delete-list')}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>

            <div class="list-progress-container">
                <div class="list-progress-stats">
                    <span>${t('progress')}</span>
                    <span>${listPercent}% (${listCompleted}/${listTotal})</span>
                </div>
                <div class="list-progress-bar-track">
                    <div class="list-progress-bar-fill" style="width: ${listPercent}%; background: linear-gradient(${state.language === 'ar' ? '270deg' : '90deg'}, ${activeGroup.color}d0, ${activeGroup.color});"></div>
                </div>
            </div>

            <div class="checklist-items"></div>

            <form class="add-item-form">
                <input type="text" placeholder="${t('add-item-placeholder')}" class="add-item-input" required maxlength="100" autocomplete="off">
                <button type="submit" class="btn-add-item-submit" title="${t('add-item-placeholder')}" aria-label="${t('add-item-placeholder')}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </form>
        `;

        const itemsContainer = listCard.querySelector('.checklist-items');
        if (list.items.length === 0) {
            itemsContainer.innerHTML = `<span style="font-size: 0.8rem; color: var(--text-sub); display: block; text-align: center; padding: 12px 0;">${t('no-items')}</span>`;
        } else {
            list.items.forEach(item => {
                const itemRow = document.createElement('div');
                itemRow.className = 'checklist-item';
                itemRow.innerHTML = `
                    <label class="item-left-label">
                        <input type="checkbox" class="checkbox-native" data-item-id="${item.id}" ${item.completed ? 'checked' : ''}>
                        <span class="checkbox-custom">
                            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </span>
                        <span class="item-text">${escapeHtml(item.text)}</span>
                    </label>
                    <button class="btn-delete-item" data-item-id="${item.id}" title="${t('delete-item')}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                `;

                itemRow.querySelector('.checkbox-native').addEventListener('change', (e) => {
                    const completed = e.target.checked;
                    toggleItemCompletion(activeGroup.id, list.id, item.id, completed);
                });

                itemRow.querySelector('.btn-delete-item').addEventListener('click', () => {
                    deleteItem(activeGroup.id, list.id, item.id);
                });

                itemsContainer.appendChild(itemRow);
            });
        }

        const addItemForm = listCard.querySelector('.add-item-form');
        addItemForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = addItemForm.querySelector('.add-item-input');
            const text = input.value.trim();
            if (text) {
                addItem(activeGroup.id, list.id, text);
                input.value = '';
            }
        });

        listCard.querySelector('.btn-delete-list').addEventListener('click', () => {
            deleteList(activeGroup.id, list.id);
        });

        const renameBtn = listCard.querySelector('.btn-rename-list');
        const listTitleEl = listCard.querySelector('.list-title-text');
        
        const triggerRename = () => {
            const currentName = list.name;
            const parent = listTitleEl.parentElement;
            
            const renameInput = document.createElement('input');
            renameInput.type = 'text';
            renameInput.className = 'inline-edit-input';
            renameInput.value = currentName;
            renameInput.maxLength = 40;
            
            parent.replaceChild(renameInput, listTitleEl);
            renameInput.focus();
            renameInput.select();

            const finishRename = () => {
                const newName = renameInput.value.trim();
                if (newName && newName !== currentName) {
                    renameList(activeGroup.id, list.id, newName);
                } else {
                    parent.replaceChild(listTitleEl, renameInput);
                }
            };

            renameInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    finishRename();
                } else if (event.key === 'Escape') {
                    parent.replaceChild(listTitleEl, renameInput);
                }
            });
            renameInput.addEventListener('blur', finishRename);
        };

        renameBtn.addEventListener('click', triggerRename);
        listTitleEl.addEventListener('dblclick', triggerRename);

        listsGrid.appendChild(listCard);
    });

    // Add List Card Trigger
    const addListTrigger = document.createElement('div');
    addListTrigger.className = 'add-list-card-trigger';
    addListTrigger.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        <span>${t('add-new-list')}</span>
    `;
    
    addListTrigger.addEventListener('click', () => {
        const parent = addListTrigger.parentElement;
        const tempCard = document.createElement('div');
        tempCard.className = 'list-card';
        tempCard.innerHTML = `
            <div class="list-card-header" style="margin-bottom: 0px">
                <form id="temp-add-list-form" style="width: 100%; display: flex; flex-direction: column; gap: 12px;">
                    <div style="font-family: var(--font-heading); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">${t('list-name-label')}</div>
                    <input type="text" id="temp-list-name" class="add-item-input" placeholder="${t('list-name-placeholder')}" required maxlength="40" style="padding: 10px 12px; font-size: 0.95rem;">
                    <div style="display: flex; gap: 8px; justify-content: flex-end;">
                        <button type="button" class="btn btn-secondary" id="btn-cancel-temp-list" style="padding: 6px 12px; font-size: 0.8rem;">${t('btn-cancel')}</button>
                        <button type="submit" class="btn btn-primary" style="padding: 6px 12px; font-size: 0.8rem;">${t('btn-create')}</button>
                    </div>
                </form>
            </div>
        `;

        parent.replaceChild(tempCard, addListTrigger);
        const nameInput = tempCard.querySelector('#temp-list-name');
        nameInput.focus();

        const cancelHandler = () => {
            parent.replaceChild(addListTrigger, tempCard);
        };

        tempCard.querySelector('#btn-cancel-temp-list').addEventListener('click', cancelHandler);
        
        tempCard.querySelector('#temp-add-list-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const listName = nameInput.value.trim();
            if (listName) {
                addList(activeGroup.id, listName);
            }
        });
    });

    listsGrid.appendChild(addListTrigger);
}

/* ==========================================================================
   DRAG & DROP REORDERING ACTIONS
   ========================================================================== */
function reorderGroups(sourceId, targetId) {
    const sourceIndex = state.groups.findIndex(g => g.id === sourceId);
    const targetIndex = state.groups.findIndex(g => g.id === targetId);
    
    if (sourceIndex !== -1 && targetIndex !== -1) {
        const [draggedGroup] = state.groups.splice(sourceIndex, 1);
        state.groups.splice(targetIndex, 0, draggedGroup);
        
        saveState();
        renderAll();
    }
}

function reorderLists(groupId, sourceListId, targetListId) {
    const group = state.groups.find(g => g.id === groupId);
    if (group) {
        const sourceIndex = group.lists.findIndex(l => l.id === sourceListId);
        const targetIndex = group.lists.findIndex(l => l.id === targetListId);
        
        if (sourceIndex !== -1 && targetIndex !== -1) {
            const [draggedList] = group.lists.splice(sourceIndex, 1);
            group.lists.splice(targetIndex, 0, draggedList);
            
            saveState();
            renderAll();
        }
    }
}

/* ==========================================================================
   CRUD CONTROLLER ACTION HANDLERS
   ========================================================================== */

// --- Groups ---
function createOrUpdateGroup(name, color, id = null) {
    if (id) {
        const group = state.groups.find(g => g.id === id);
        if (group) {
            group.name = name;
            group.color = color;
        }
    } else {
        const newGroup = {
            id: uuid(),
            name: name,
            color: color,
            lists: []
        };
        state.groups.push(newGroup);
        state.activeGroupId = newGroup.id;
    }
    saveState();
    renderAll();
}

function deleteGroup(id) {
    if (confirm(t('confirm-delete-group'))) {
        state.groups = state.groups.filter(g => g.id !== id);
        if (state.activeGroupId === id) {
            state.activeGroupId = state.groups.length > 0 ? state.groups[0].id : null;
        }
        saveState();
        renderAll();
    }
}

// --- Lists ---
function addList(groupId, name) {
    const group = state.groups.find(g => g.id === groupId);
    if (group) {
        group.lists.push({
            id: uuid(),
            name: name,
            items: []
        });
        saveState();
        renderAll();
    }
}

function renameList(groupId, listId, newName) {
    const group = state.groups.find(g => g.id === groupId);
    if (group) {
        const list = group.lists.find(l => l.id === listId);
        if (list) {
            list.name = newName;
            saveState();
            renderAll();
        }
    }
}

function deleteList(groupId, listId) {
    const group = state.groups.find(g => g.id === groupId);
    if (group) {
        const list = group.lists.find(l => l.id === listId);
        if (confirm(t('confirm-delete-list', { name: list.name }))) {
            group.lists = group.lists.filter(l => l.id !== listId);
            saveState();
            renderAll();
        }
    }
}

// --- Items ---
function addItem(groupId, listId, text) {
    const group = state.groups.find(g => g.id === groupId);
    if (group) {
        const list = group.lists.find(l => l.id === listId);
        if (list) {
            list.items.push({
                id: uuid(),
                text: text,
                completed: false
            });
            saveState();
            renderAll();
        }
    }
}

function toggleItemCompletion(groupId, listId, itemId, completed) {
    const group = state.groups.find(g => g.id === groupId);
    if (group) {
        const list = group.lists.find(l => l.id === listId);
        if (list) {
            const item = list.items.find(i => i.id === itemId);
            if (item) {
                item.completed = completed;
                
                const listTotal = list.items.length;
                const listCompleted = list.items.filter(i => i.completed).length;
                
                saveState();
                
                if (completed && listCompleted === listTotal) {
                    triggerConfetti();
                }

                renderAll();
            }
        }
    }
}

function deleteItem(groupId, listId, itemId) {
    const group = state.groups.find(g => g.id === groupId);
    if (group) {
        const list = group.lists.find(l => l.id === listId);
        if (list) {
            list.items = list.items.filter(i => i.id !== itemId);
            saveState();
            renderAll();
        }
    }
}

/* ==========================================================================
   DOM UTILS (XSS PREVENTION)
   ========================================================================== */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, function(m) { return map[m]; });
}

/* ==========================================================================
   INITIALIZATION & EVENT REGISTRATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize State
    loadState();
    initTheme();
    renderAll();

    // 2. Open Group Modal bindings
    btnAddGroupModal.addEventListener('click', () => openGroupModal());
    btnCreateFirstGroup.addEventListener('click', () => openGroupModal());

    // 3. Close Modal triggers
    btnCloseGroupModal.addEventListener('click', closeGroupModal);
    btnCancelGroupModal.addEventListener('click', closeGroupModal);
    
    groupModal.addEventListener('click', (e) => {
        if (e.target === groupModal) {
            closeGroupModal();
        }
    });

    // 4. Form Submit for Groups
    groupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = groupEditIdInput.value;
        const name = groupNameInput.value.trim();
        const colorChecked = document.querySelector('input[name="group-color"]:checked');
        const color = colorChecked ? colorChecked.value : '#3b82f6';

        if (name) {
            createOrUpdateGroup(name, color, editId);
            closeGroupModal();
        }
    });

    // 5. Sidebar Toggle for Mobile View
    sidebarToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    // 6. Theme Toggler Button Action
    themeToggleBtn.addEventListener('click', toggleTheme);

    // 7. Language Switcher Button Action
    langToggleBtn.addEventListener('click', toggleLanguage);
});
