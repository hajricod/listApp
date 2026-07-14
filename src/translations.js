export const TRANSLATIONS = {
  en: {
    'groups-title': 'Groups',
    'create-group-tooltip': 'Create New Group',
    'empty-title': 'No Groups Found',
    'empty-desc': 'Start organizing your tasks by creating your first list group.',
    'btn-create-first-group': 'Create Group',
    'modal-title-add': 'Create New Group',
    'modal-title-edit': 'Edit Group Details',
    'label-group-name': 'Group Name',
    'group-name-placeholder': 'e.g. Work, Personal, Shopping',
    'label-accent-color': 'Accent Color',
    'btn-cancel': 'Cancel',
    'btn-confirm-delete': 'Delete',
    'btn-save': 'Save Group',
    lists: 'lists',
    'tasks-completed': 'tasks completed',
    'edit-group': 'Edit Group',
    'delete-group': 'Delete Group',
    'cols-picker-label': 'Columns',
    'cols-option': '{n} column(s)',
    'confirm-delete-group':
      'Are you sure you want to delete this group and all its checklist lists? This action cannot be undone.',
    'rename-list': 'Rename List',
    'delete-list': 'Delete List',
    'collapse-list': 'Collapse List',
    'expand-list': 'Expand List',
    'confirm-delete-list': 'Delete the list "{name}"?',
    progress: 'Progress',
    'no-items': 'No items yet',
    'delete-item': 'Delete Item',
    'edit-item': 'Edit Item',
    'confirm-delete-item': 'Delete "{name}"?',
    'add-item-placeholder': 'Add an item...',
    'add-new-list': 'Add New List',
    'list-name-label': 'List Name',
    'list-name-placeholder': 'e.g. Shopping, Homework',
    'btn-create': 'Create',
  },
  ar: {
    'groups-title': 'المجموعات',
    'create-group-tooltip': 'إنشاء مجموعة جديدة',
    'empty-title': 'لم يتم العثور على مجموعات',
    'empty-desc': 'ابدأ بتنظيم مهامك عن طريق إنشاء مجموعة قوائم أولى.',
    'btn-create-first-group': 'إنشاء مجموعة',
    'modal-title-add': 'إنشاء مجموعة جديدة',
    'modal-title-edit': 'تعديل بيانات المجموعة',
    'label-group-name': 'اسم المجموعة',
    'group-name-placeholder': 'مثال: العمل، شخصي، تسوق',
    'label-accent-color': 'لون التمييز',
    'btn-cancel': 'إلغاء',
    'btn-confirm-delete': 'حذف',
    'btn-save': 'حفظ المجموعة',
    lists: 'قوائم',
    'tasks-completed': 'من المهام مكتملة',
    'edit-group': 'تعديل المجموعة',
    'delete-group': 'حذف المجموعة',
    'cols-picker-label': 'الأعمدة',
    'cols-option': '{n} عمود',
    'confirm-delete-group':
      'هل أنت متأكد أنك تريد حذف هذه المجموعة وجميع القوائم الخاصة بها؟ لا يمكن التراجع عن هذا الإجراء.',
    'rename-list': 'إعادة تسمية القائمة',
    'delete-list': 'حذف القائمة',
    'collapse-list': 'طي القائمة',
    'expand-list': 'توسيع القائمة',
    'confirm-delete-list': 'هل تريد حذف قائمة "{name}"؟',
    progress: 'التقدم',
    'no-items': 'لا توجد عناصر بعد',
    'delete-item': 'حذف العنصر',
    'edit-item': 'تعديل العنصر',
    'confirm-delete-item': 'حذف "{name}"؟',
    'add-item-placeholder': 'أضف عنصراً...',
    'add-new-list': 'إضافة قائمة جديدة',
    'list-name-label': 'اسم القائمة',
    'list-name-placeholder': 'مثال: التسوق، الواجبات',
    'btn-create': 'إنشاء',
  },
}

export function t(key, language = 'en', vars = {}) {
  const lang = TRANSLATIONS[language] ? language : 'en'
  let text = TRANSLATIONS[lang][key] ?? key
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(`{${k}}`, v)
  }
  return text
}

export const DEFAULT_GROUPS_EN = [
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
          { id: 'item-5', text: 'Write automated tests & verification plan', completed: false },
        ],
      },
      {
        id: 'list-daily-ops',
        name: 'Daily Scrum Prep',
        items: [
          { id: 'item-6', text: 'Review team backlog metrics', completed: false },
          { id: 'item-7', text: 'Submit daily updates to manager', completed: true },
        ],
      },
    ],
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
          { id: 'item-10', text: 'Organic dark chocolate 🍫', completed: false },
        ],
      },
      {
        id: 'list-reading',
        name: 'Books to Read',
        items: [
          { id: 'item-11', text: 'Atomic Habits by James Clear', completed: true },
          { id: 'item-12', text: 'The Pragmatic Programmer', completed: false },
        ],
      },
    ],
  },
]

export const DEFAULT_GROUPS_AR = [
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
          { id: 'item-5', text: 'كتابة خطة التحقق والاختبارات الآلية', completed: false },
        ],
      },
      {
        id: 'list-daily-ops',
        name: 'التحضير للاجتماع اليومي',
        items: [
          { id: 'item-6', text: 'مراجعة مقاييس العمل المتراكم للفريق', completed: false },
          { id: 'item-7', text: 'إرسال التحديثات اليومية للمدير', completed: true },
        ],
      },
    ],
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
          { id: 'item-10', text: 'شوكولاتة داكنة عضوية 🍫', completed: false },
        ],
      },
      {
        id: 'list-reading',
        name: 'كتب للقراءة',
        items: [
          { id: 'item-11', text: 'كتاب العادات الذرية لجيمس كلير', completed: true },
          { id: 'item-12', text: 'المبرمج البراغماتي', completed: false },
        ],
      },
    ],
  },
]
