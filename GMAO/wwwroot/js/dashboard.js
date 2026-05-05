const viewSections = document.querySelectorAll(".gmao-view");
const navLinks = document.querySelectorAll(".gmao-nav-link");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarBackdrop = document.getElementById("sidebar-backdrop");
let treeNodes = [];
const kpiValues = document.querySelectorAll(".kpi-value");
const crudFormModalElement = document.getElementById("crud-form-modal");
const crudDetailModalElement = document.getElementById("crud-detail-modal");
const crudDeleteModalElement = document.getElementById("crud-delete-modal");
const crudFormTitle = document.getElementById("crud-form-title");
const crudFormBody = document.getElementById("crud-form-body");
const crudFormError = document.getElementById("crud-form-error");
const crudFormSubmit = document.getElementById("crud-form-submit");
const crudDetailTitle = document.getElementById("crud-detail-title");
const crudDetailBody = document.getElementById("crud-detail-body");
const crudDeleteBody = document.getElementById("crud-delete-body");
const crudDeleteConfirm = document.getElementById("crud-delete-confirm");

const bootstrapAvailable = typeof bootstrap !== "undefined";
const crudFormModal = crudFormModalElement && bootstrapAvailable ? new bootstrap.Modal(crudFormModalElement) : null;
const crudDetailModal = crudDetailModalElement && bootstrapAvailable ? new bootstrap.Modal(crudDetailModalElement) : null;
const crudDeleteModal = crudDeleteModalElement && bootstrapAvailable ? new bootstrap.Modal(crudDeleteModalElement) : null;
const orgFormModals = {};
const orgDetailModals = {};
const orgDeleteModals = {};
let chartsInitialized = false;
let countersStarted = false;
let selectedTreeNode = null;
let activeFormContext = null;
let pendingDelete = null;
let orgFormContext = null;
let pendingOrgDelete = null;

const createId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

let unitesPrincipales = [];
let divisions = [];
let departements = [];
let services = [];
let groupesEquipements = [];
let famillesEquipements = [];
let sousFamillesEquipements = [];
let equipements = [];
let groupesOrganes = [];
let famillesOrganes = [];
let sousFamillesOrganes = [];
let organes = [];
let groupesArticles = [];
let famillesArticles = [];
let sousFamillesArticles = [];
let articles = [];

const company = {
    id: "company-1",
    name: "Entreprise Nationale Sonatrach",
    code: "4@gml",
    wilaya: "Alger",
    daira: "Bab El Oued",
    commune: "Bab El Oued",
    createdAt: "1998-01-12",
    phone: "+213 21 00 00 00"
};

const articleConfigs = {
    groupes: {
        key: "groupes",
        label: "Groupe Articles",
        plural: "Groupes Articles",
        prefix: "GRA-",
        viewId: "view-groupes-articles",
        tableId: "table-groupes-articles",
        formId: "form-groupes-articles",
        modalId: "modal-groupes-articles-form",
        titleId: "modal-groupes-articles-title",
        deleteModalId: "modal-groupes-articles-delete",
        deleteBodyId: "delete-groupes-articles-body",
        parentKey: null
    },
    familles: {
        key: "familles",
        label: "Famille Articles",
        plural: "Familles Articles",
        prefix: "FAA-",
        viewId: "view-familles-articles",
        tableId: "table-familles-articles",
        formId: "form-familles-articles",
        modalId: "modal-familles-articles-form",
        titleId: "modal-familles-articles-title",
        deleteModalId: "modal-familles-articles-delete",
        deleteBodyId: "delete-familles-articles-body",
        parentKey: "groupeId"
    },
    sousfamilles: {
        key: "sousfamilles",
        label: "Sous-famille Articles",
        plural: "Sous-familles Articles",
        prefix: "SFA-",
        viewId: "view-sousfamilles-articles",
        tableId: "table-sousfamilles-articles",
        formId: "form-sousfamilles-articles",
        modalId: "modal-sousfamilles-articles-form",
        titleId: "modal-sousfamilles-articles-title",
        deleteModalId: "modal-sousfamilles-articles-delete",
        deleteBodyId: "delete-sousfamilles-articles-body",
        parentKey: "familleId",
        groupKey: "groupeId"
    },
    articles: {
        key: "articles",
        label: "Article",
        plural: "Articles",
        prefix: "ART-",
        viewId: "view-articles",
        tableId: "table-articles",
        formId: "form-articles",
        modalId: "modal-articles-form",
        titleId: "modal-articles-title",
        detailModalId: "modal-articles-detail",
        detailBodyId: "detail-articles-body",
        deleteModalId: "modal-articles-delete",
        deleteBodyId: "delete-articles-body",
        parentKey: "sousFamilleId",
        familleKey: "familleId",
        groupeKey: "groupeId"
    }
};

const organConfigs = {
    groupes: {
        key: "groupes",
        label: "Groupe Organes",
        plural: "Groupes Organes",
        prefix: "GRO-",
        viewId: "view-groupes-organes",
        tableId: "table-groupes-organes",
        formId: "form-groupes-organes",
        modalId: "modal-groupes-organes-form",
        titleId: "modal-groupes-organes-title",
        detailModalId: "modal-groupes-organes-detail",
        detailBodyId: "detail-groupes-organes-body",
        deleteModalId: "modal-groupes-organes-delete",
        deleteBodyId: "delete-groupes-organes-body",
        parentKey: null
    },
    familles: {
        key: "familles",
        label: "Famille Organes",
        plural: "Familles Organes",
        prefix: "FAO-",
        viewId: "view-familles-organes",
        tableId: "table-familles-organes",
        formId: "form-familles-organes",
        modalId: "modal-familles-organes-form",
        titleId: "modal-familles-organes-title",
        detailModalId: "modal-familles-organes-detail",
        detailBodyId: "detail-familles-organes-body",
        deleteModalId: "modal-familles-organes-delete",
        deleteBodyId: "delete-familles-organes-body",
        parentKey: "groupeId"
    },
    sousfamilles: {
        key: "sousfamilles",
        label: "Sous-famille Organes",
        plural: "Sous-familles Organes",
        prefix: "SFO-",
        viewId: "view-sousfamilles-organes",
        tableId: "table-sousfamilles-organes",
        formId: "form-sousfamilles-organes",
        modalId: "modal-sousfamilles-organes-form",
        titleId: "modal-sousfamilles-organes-title",
        detailModalId: "modal-sousfamilles-organes-detail",
        detailBodyId: "detail-sousfamilles-organes-body",
        deleteModalId: "modal-sousfamilles-organes-delete",
        deleteBodyId: "delete-sousfamilles-organes-body",
        parentKey: "familleId",
        groupKey: "groupeId"
    },
    organes: {
        key: "organes",
        label: "Organe",
        plural: "Organes",
        prefix: "ORG-",
        viewId: "view-organes",
        tableId: "table-organes",
        formId: "form-organes",
        modalId: "modal-organes-form",
        titleId: "modal-organes-title",
        detailModalId: "modal-organes-detail",
        detailBodyId: "detail-organes-body",
        deleteModalId: "modal-organes-delete",
        deleteBodyId: "delete-organes-body",
        parentKey: "sousFamilleId",
        familleKey: "familleId",
        groupeKey: "groupeId",
        equipementKey: "equipementId"
    }
};

const equipConfigs = {
    groupes: {
        key: "groupes",
        label: "Groupe Équipements",
        plural: "Groupes Équipements",
        prefix: "GRP-",
        viewId: "view-groupes-equip",
        tableId: "table-groupes-equip",
        formId: "form-groupes-equip",
        modalId: "modal-groupes-equip-form",
        titleId: "modal-groupes-equip-title",
        deleteModalId: "modal-groupes-equip-delete",
        deleteBodyId: "delete-groupes-equip-body",
        parentKey: null
    },
    familles: {
        key: "familles",
        label: "Famille Équipements",
        plural: "Familles Équipements",
        prefix: "FAM-",
        viewId: "view-familles-equip",
        tableId: "table-familles-equip",
        formId: "form-familles-equip",
        modalId: "modal-familles-equip-form",
        titleId: "modal-familles-equip-title",
        deleteModalId: "modal-familles-equip-delete",
        deleteBodyId: "delete-familles-equip-body",
        parentKey: "groupeId"
    },
    sousfamilles: {
        key: "sousfamilles",
        label: "Sous-famille Équipements",
        plural: "Sous-familles Équipements",
        prefix: "SFA-",
        viewId: "view-sousfamilles-equip",
        tableId: "table-sousfamilles-equip",
        formId: "form-sousfamilles-equip",
        modalId: "modal-sousfamilles-equip-form",
        titleId: "modal-sousfamilles-equip-title",
        deleteModalId: "modal-sousfamilles-equip-delete",
        deleteBodyId: "delete-sousfamilles-equip-body",
        parentKey: "familleId",
        groupKey: "groupeId"
    },
    equipements: {
        key: "equipements",
        label: "Équipement",
        plural: "Équipements",
        prefix: "EQP-",
        viewId: "view-equipements",
        tableId: "table-equipements",
        formId: "form-equipements",
        modalId: "modal-equipements-form",
        titleId: "modal-equipements-title",
        detailModalId: "modal-equipements-detail",
        detailBodyId: "detail-equipements-body",
        deleteModalId: "modal-equipements-delete",
        deleteBodyId: "delete-equipements-body",
        parentKey: "sousFamilleId",
        familleKey: "familleId",
        groupeKey: "groupeId"
    }
};

let sites = [
    {
        id: "site-1",
        code: "SKD-01",
        name: "Site Skikda",
        wilaya: "Skikda",
        daira: "Skikda",
        commune: "Skikda",
        address: "Zone Industrielle",
        manager: "A. Ferhat",
        email: "a.ferhat@gmao.dz",
        phone: "021000001",
        description: "Site principal"
    }
];

const treeData = [
    {
        type: "entreprise",
        name: "SNVI - Soci\u00e9t\u00e9 Nationale des V\u00e9hicules Industriels",
        children: [
            {
                type: "unite",
                name: "Complexe de Rou\u00efba",
                code: "CPX-01",
                children: [
                    {
                        type: "division",
                        name: "Division M\u00e9canique",
                        code: "DIV-MEC",
                        children: [
                            {
                                type: "departement",
                                name: "Dept. Fabrication",
                                code: "DEP-FAB",
                                children: [
                                    {
                                        type: "service",
                                        name: "Atelier Usinage",
                                        code: "SRV-USN",
                                        children: [
                                            {
                                                type: "groupeEquip",
                                                name: "Machines Tournantes",
                                                children: [
                                                    {
                                                        type: "familleEquip",
                                                        name: "Pompes",
                                                        children: [
                                                            {
                                                                type: "sousFamilleEquip",
                                                                name: "Pompes centrifuges",
                                                                children: [
                                                                    {
                                                                        type: "equipement",
                                                                        name: "Pompe P-01",
                                                                        code: "P-01",
                                                                        criticite: "A",
                                                                        localisation: "B\u00e2timent A, Salle 12",
                                                                        children: [
                                                                            {
                                                                                type: "groupeOrgane",
                                                                                name: "Transmission",
                                                                                children: [
                                                                                    {
                                                                                        type: "familleOrgane",
                                                                                        name: "Roulements",
                                                                                        children: [
                                                                                            {
                                                                                                type: "sousFamilleOrgane",
                                                                                                name: "Roulements \u00e0 billes",
                                                                                                children: [
                                                                                                    {
                                                                                                        type: "organe",
                                                                                                        name: "Roulement avant",
                                                                                                        code: "ORG-001",
                                                                                                        children: [
                                                                                                            {
                                                                                                                type: "groupeArticle",
                                                                                                                name: "Pi\u00e8ces m\u00e9caniques",
                                                                                                                children: [
                                                                                                                    {
                                                                                                                        type: "familleArticle",
                                                                                                                        name: "Roulements",
                                                                                                                        children: [
                                                                                                                            {
                                                                                                                                type: "sousFamilleArticle",
                                                                                                                                name: "Roulements \u00e0 billes",
                                                                                                                                children: [
                                                                                                                                    {
                                                                                                                                        type: "article",
                                                                                                                                        name: "Roulement SKF 6205",
                                                                                                                                        ref: "SKF-6205",
                                                                                                                                        stockActuel: 5,
                                                                                                                                        stockMinimum: 3
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    }
                                                                                                                ]
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

const treeTypeMap = {
    entreprise: { level: "Entreprise", icon: "fa-building-columns", iconClass: "tree-icon-org-enterprise" },
    unite: { level: "Unit\u00e9 principale", icon: "fa-industry", iconClass: "tree-icon-org-unit" },
    division: { level: "Division", icon: "fa-sitemap", iconClass: "tree-icon-org-division" },
    departement: { level: "D\u00e9partement", icon: "fa-th-large", iconClass: "tree-icon-org-department" },
    service: { level: "Service", icon: "fa-warehouse", iconClass: "tree-icon-org-service" },
    groupeEquip: { level: "Groupe \u00e9quipements", icon: "fa-layer-group", iconClass: "tree-icon-equip-group" },
    familleEquip: { level: "Famille \u00e9quipements", icon: "fa-folder", iconClass: "tree-icon-equip-family" },
    sousFamilleEquip: { level: "Sous-famille \u00e9quipements", icon: "fa-folder-open", iconClass: "tree-icon-equip-subfamily" },
    equipement: { level: "\u00c9quipement", icon: "fa-cog", iconClass: "tree-icon-equipment" },
    groupeOrgane: { level: "Groupe organes", icon: "fa-layer-group", iconClass: "tree-icon-organ-group" },
    familleOrgane: { level: "Famille organes", icon: "fa-folder", iconClass: "tree-icon-organ-family" },
    sousFamilleOrgane: { level: "Sous-famille organes", icon: "fa-folder-open", iconClass: "tree-icon-organ-subfamily" },
    organe: { level: "Organe", icon: "fa-puzzle-piece", iconClass: "tree-icon-organ" },
    groupeArticle: { level: "Groupe articles", icon: "fa-layer-group", iconClass: "tree-icon-article-group" },
    familleArticle: { level: "Famille articles", icon: "fa-folder", iconClass: "tree-icon-article-family" },
    sousFamilleArticle: { level: "Sous-famille articles", icon: "fa-folder-open", iconClass: "tree-icon-article-subfamily" },
    article: { level: "Article", icon: "fa-box-open", iconClass: "tree-icon-article" }
};

let departments = [
    {
        id: "dept-1",
        siteId: "site-1",
        code: "DEP-UT",
        name: "D\u00e9partement Utilit\u00e9s",
        manager: "K. Benali",
        email: "k.benali@gmao.dz",
        phone: "021000010",
        description: "Services utilit\u00e9s"
    }
];

let workshops = [
    {
        id: "workshop-1",
        departmentId: "dept-1",
        code: "ATL-02",
        name: "Atelier Maintenance",
        surface: 450,
        manager: "S. Kaci",
        email: "s.kaci@gmao.dz",
        phone: "021000020",
        description: "Atelier principal"
    }
];

let lines = [
    {
        id: "line-1",
        workshopId: "workshop-1",
        code: "SYS-AC",
        name: "Ligne Air Comprim\u00e9",
        functionMain: "Production air comprim\u00e9",
        criticality: "A",
        description: "Circuit principal"
    }
];

let equipment = [
    {
        id: "equip-1",
        lineId: "line-1",
        tag: "CMP-501",
        name: "Compresseur principal",
        description: "Compresseur Atlas",
        family: "Compression",
        subFamily: "Air",
        category: "Process",
        criticality: "A",
        manufacturer: "Atlas Copco",
        model: "AC-400",
        serialNumber: "AC-2021-7788",
        purchaseDate: "2021-01-05",
        commissioningDate: "2021-03-12",
        acquisitionValue: 1200000,
        currentValue: 950000,
        lifetimeValue: 12,
        lifetimeUnit: "années",
        warrantyDate: "2026-03-12",
        counterHours: 15200,
        counterCycles: 4300,
        counterDistance: 0,
        counterUnit: "",
        counterAlert: 18000,
        photos: [],
        documents: [],
        notes: "Inspection trimestrielle."
    }
];

let subassemblies = [
    {
        id: "sub-1",
        equipmentId: "equip-1",
        code: "SUB-110",
        name: "Module filtre",
        functionMain: "Filtration",
        replaceable: true,
        description: "Module filtration principal"
    }
];

let organs = [
    {
        id: "org-1",
        subassemblyId: "sub-1",
        code: "ORG-77",
        name: "Organe lubrification",
        nominalParameters: "Débit: 150 L/min, Pression: 200 bar",
        alarmThresholds: "T° max: 85°C",
        description: "Bloc lubrification"
    }
];

let components = [
    {
        id: "comp-1",
        organId: "org-1",
        code: "CMP-88",
        name: "Composant pompe",
        material: "Acier inoxydable 316L",
        dimensions: "Ø25mm",
        description: "Pompe interne"
    }
];

let spareParts = [
    {
        id: "spare-1",
        componentId: "comp-1",
        name: "Joint NBR 80x60",
        supplierRef: "PR-887",
        internalRef: "INT-554",
        supplier: "SKF",
        price: 8500,
        leadTimeValue: 7,
        leadTimeUnit: "jours",
        stockMin: 4,
        stockCurrent: 6,
        location: "Rack A3",
        description: "Joint d'\u00e9tanch\u00e9it\u00e9"
    }
];

const entityConfigs = {
    company: {
        key: "company",
        name: "Entreprise",
        viewId: "view-company",
        fields: [
            { name: "name", label: "Nom de l'entreprise", icon: "fa-building", type: "text", required: true },
            { name: "code", label: "Code entreprise", icon: "fa-hashtag", type: "text", required: true, uppercase: true },
            { name: "wilaya", label: "Wilaya", icon: "fa-map-marker-alt", type: "geo-wilaya", required: true },
            { name: "daira", label: "Daïra", icon: "fa-map-marker-alt", type: "geo-daira", required: true },
            { name: "commune", label: "Commune", icon: "fa-map-marker-alt", type: "geo-commune", required: true },
            { name: "createdAt", label: "Date de cr\u00e9ation", icon: "fa-calendar", type: "date", required: true },
            { name: "phone", label: "Numéro de téléphone", icon: "fa-phone", type: "text", required: true }
        ]
    },
    sites: {
        key: "sites",
        name: "Site",
        viewId: "view-unites",
        codeField: "code",
        fields: [
            { name: "code", label: "Code site unique", icon: "fa-hashtag", type: "text", required: true, uppercase: true, unique: true },
            { name: "name", label: "Nom du site", icon: "fa-industry", type: "text", required: true },
            { name: "wilaya", label: "Wilaya", icon: "fa-map-marker-alt", type: "geo-wilaya", required: true },
            { name: "daira", label: "Daïra", icon: "fa-map-marker-alt", type: "geo-daira", required: true },
            { name: "commune", label: "Commune", icon: "fa-map-marker-alt", type: "geo-commune", required: true },
            { name: "address", label: "Adresse complète", icon: "fa-map-pin", type: "textarea", required: false },
            { name: "manager", label: "Responsable de site", icon: "fa-user-tie", type: "text", required: true },
            { name: "email", label: "Email responsable", icon: "fa-envelope", type: "email", required: false },
            { name: "phone", label: "T\u00e9l\u00e9phone site", icon: "fa-phone", type: "text", required: false },
            { name: "description", label: "Description", icon: "fa-align-left", type: "textarea", required: false }
        ]
    },
    departments: {
        key: "departments",
        name: "D\u00e9partement",
        viewId: "view-divisions",
        codeField: "code",
        parentKey: "siteId",
        parentEntity: "sites",
        fields: [
            { name: "siteId", label: "Site parent", icon: "fa-industry", type: "parent", required: true },
            { name: "code", label: "Code d\u00e9partement", icon: "fa-hashtag", type: "text", required: true, uppercase: true, unique: true },
            { name: "name", label: "Nom du d\u00e9partement", icon: "fa-th-large", type: "text", required: true },
            { name: "manager", label: "Chef de d\u00e9partement", icon: "fa-user-tie", type: "text", required: true },
            { name: "email", label: "Email chef", icon: "fa-envelope", type: "email", required: false },
            { name: "phone", label: "T\u00e9l\u00e9phone", icon: "fa-phone", type: "text", required: false },
            { name: "description", label: "Description", icon: "fa-align-left", type: "textarea", required: false }
        ]
    },
    workshops: {
        key: "workshops",
        name: "Atelier",
        viewId: "view-departements",
        codeField: "code",
        parentKey: "departmentId",
        parentEntity: "departments",
        fields: [
            { name: "departmentId", label: "D\u00e9partement parent", icon: "fa-th-large", type: "parent", required: true },
            { name: "code", label: "Code atelier", icon: "fa-hashtag", type: "text", required: true, uppercase: true, unique: true },
            { name: "name", label: "Nom de l'atelier", icon: "fa-warehouse", type: "text", required: true },
            { name: "surface", label: "Surface (m²)", icon: "fa-ruler-combined", type: "number", required: true, min: 0 },
            { name: "manager", label: "Responsable atelier", icon: "fa-user-tie", type: "text", required: true },
            { name: "email", label: "Email responsable", icon: "fa-envelope", type: "email", required: false },
            { name: "phone", label: "T\u00e9l\u00e9phone", icon: "fa-phone", type: "text", required: false },
            { name: "description", label: "Description", icon: "fa-align-left", type: "textarea", required: false }
        ]
    },
    lines: {
        key: "lines",
        name: "Syst\u00e8me",
        viewId: "view-services",
        codeField: "code",
        parentKey: "workshopId",
        parentEntity: "workshops",
        fields: [
            { name: "workshopId", label: "Atelier parent", icon: "fa-warehouse", type: "parent", required: true },
            { name: "code", label: "Code syst\u00e8me", icon: "fa-hashtag", type: "text", required: true, uppercase: true, unique: true },
            { name: "name", label: "Nom de la ligne/syst\u00e8me", icon: "fa-project-diagram", type: "text", required: true },
            { name: "functionMain", label: "Fonction principale", icon: "fa-align-left", type: "textarea", required: true },
            {
                name: "criticality",
                label: "Criticit\u00e9 du syst\u00e8me",
                icon: "fa-exclamation-triangle",
                type: "radio",
                required: true,
                options: [
                    { value: "A", label: "\u00c9lev\u00e9e", className: "gmao-badge-critical" },
                    { value: "B", label: "Moyenne", className: "gmao-badge-important" },
                    { value: "C", label: "Faible", className: "gmao-badge-standard" }
                ]
            },
            { name: "description", label: "Description", icon: "fa-align-left", type: "textarea", required: false }
        ]
    },
    equipment: {
        key: "equipment",
        name: "\u00c9quipement",
        viewId: "view-equipements",
        codeField: "tag",
        parentKey: "lineId",
        parentEntity: "lines",
        tabs: [
            {
                id: "identification",
                label: "Identification",
                fields: [
                    { name: "lineId", label: "Syst\u00e8me parent", icon: "fa-project-diagram", type: "parent", required: true },
                    { name: "tag", label: "Code \u00e9quipement (TAG)", icon: "fa-hashtag", type: "text", required: true, uppercase: true, unique: true },
                    { name: "name", label: "D\u00e9signation", icon: "fa-cog", type: "text", required: true },
                    { name: "description", label: "Description d\u00e9taill\u00e9e", icon: "fa-align-left", type: "textarea", required: true },
                    { name: "family", label: "Famille", icon: "fa-folder", type: "text", required: true },
                    { name: "subFamily", label: "Sous-famille", icon: "fa-folder-open", type: "text", required: false },
                    { name: "category", label: "Cat\u00e9gorie", icon: "fa-tag", type: "text", required: false },
                    {
                        name: "criticality",
                        label: "Criticit\u00e9",
                        icon: "fa-exclamation-triangle",
                        type: "radio",
                        required: true,
                        options: [
                            { value: "A", label: "A — Critique", className: "gmao-badge-critical" },
                            { value: "B", label: "B — Important", className: "gmao-badge-important" },
                            { value: "C", label: "C — Standard", className: "gmao-badge-standard" }
                        ]
                    }
                ]
            },
            {
                id: "technique",
                label: "Technique & Fournisseur",
                fields: [
                    { name: "manufacturer", label: "Fabricant", icon: "fa-industry", type: "text", required: true },
                    { name: "model", label: "Mod\u00e8le", icon: "fa-barcode", type: "text", required: true },
                    { name: "serialNumber", label: "Num\u00e9ro de s\u00e9rie", icon: "fa-fingerprint", type: "text", required: true },
                    { name: "purchaseDate", label: "Date d'achat", icon: "fa-calendar", type: "date", required: true },
                    { name: "commissioningDate", label: "Date de mise en service", icon: "fa-calendar-check", type: "date", required: true },
                    { name: "acquisitionValue", label: "Valeur d'acquisition (DA)", icon: "fa-money-bill-wave", type: "number", required: true },
                    { name: "currentValue", label: "Valeur actuelle (DA)", icon: "fa-coins", type: "number", required: false },
                    { name: "lifetimeValue", label: "Dur\u00e9e de vie estim\u00e9e", icon: "fa-hourglass-half", type: "number", required: true },
                    {
                        name: "lifetimeUnit",
                        label: "Unit\u00e9",
                        icon: "fa-hourglass-half",
                        type: "select",
                        required: true,
                        options: ["ann\u00e9es", "mois", "heures"]
                    },
                    { name: "warrantyDate", label: "Date expiration garantie", icon: "fa-shield-alt", type: "date", required: false }
                ]
            },
            {
                id: "counters",
                label: "Compteurs",
                fields: [
                    { name: "counterHours", label: "Compteur heures de marche", icon: "fa-clock", type: "number", required: false },
                    { name: "counterCycles", label: "Compteur cycles", icon: "fa-sync", type: "number", required: false },
                    { name: "counterDistance", label: "Compteur km / distance", icon: "fa-road", type: "number", required: false },
                    { name: "counterUnit", label: "Unité personnalisée", icon: "fa-ruler", type: "text", required: false },
                    { name: "counterAlert", label: "Valeur seuil alerte", icon: "fa-bell", type: "number", required: false }
                ]
            },
            {
                id: "documents",
                label: "Documents & Photos",
                fields: [
                    { name: "photos", label: "Photos de l'équipement", icon: "fa-camera", type: "file", required: false, accept: "image/*", multiple: true },
                    { name: "documents", label: "Documents attachés", icon: "fa-file-pdf", type: "file", required: false, accept: ".pdf,.doc,.docx,.xls", multiple: true },
                    { name: "notes", label: "Notes / Remarques", icon: "fa-sticky-note", type: "textarea", required: false }
                ]
            }
        ]
    },
    subassemblies: {
        key: "subassemblies",
        name: "Sous-ensemble",
        viewId: "view-groupes-equip",
        codeField: "code",
        parentKey: "equipmentId",
        parentEntity: "equipment",
        fields: [
            { name: "equipmentId", label: "Équipement parent", icon: "fa-cog", type: "parent", required: true },
            { name: "code", label: "Code sous-ensemble", icon: "fa-hashtag", type: "text", required: true, uppercase: true, unique: true },
            { name: "name", label: "Nom du sous-ensemble", icon: "fa-puzzle-piece", type: "text", required: true },
            { name: "functionMain", label: "Fonction associ\u00e9e", icon: "fa-align-left", type: "textarea", required: true },
            { name: "replaceable", label: "Rempla\u00e7able en bloc", icon: "fa-exchange-alt", type: "toggle", required: true },
            { name: "description", label: "Description", icon: "fa-align-left", type: "textarea", required: false }
        ]
    },
    organs: {
        key: "organs",
        name: "Organe",
        viewId: "view-familles-equip",
        codeField: "code",
        parentKey: "subassemblyId",
        parentEntity: "subassemblies",
        fields: [
            { name: "subassemblyId", label: "Sous-ensemble parent", icon: "fa-puzzle-piece", type: "parent", required: true },
            { name: "code", label: "Code organe", icon: "fa-hashtag", type: "text", required: true, uppercase: true, unique: true },
            { name: "name", label: "Nom de l'organe", icon: "fa-microchip", type: "text", required: true },
            { name: "nominalParameters", label: "Param\u00e8tres nominaux", icon: "fa-sliders-h", type: "textarea", required: true },
            { name: "alarmThresholds", label: "Seuils d'alarme", icon: "fa-bell", type: "textarea", required: true },
            { name: "description", label: "Description", icon: "fa-align-left", type: "textarea", required: false }
        ]
    },
    components: {
        key: "components",
        name: "Composant",
        viewId: "view-sousfamilles-equip",
        codeField: "code",
        parentKey: "organId",
        parentEntity: "organs",
        fields: [
            { name: "organId", label: "Organe parent", icon: "fa-microchip", type: "parent", required: true },
            { name: "code", label: "Code composant", icon: "fa-hashtag", type: "text", required: true, uppercase: true, unique: true },
            { name: "name", label: "Nom du composant", icon: "fa-circle", type: "text", required: true },
            { name: "material", label: "Mati\u00e8re / Mat\u00e9riau", icon: "fa-layer-group", type: "text", required: true },
            { name: "dimensions", label: "Dimensions", icon: "fa-ruler", type: "text", required: true },
            { name: "description", label: "Description", icon: "fa-align-left", type: "textarea", required: false }
        ]
    },
    spareParts: {
        key: "spareParts",
        name: "Pi\u00e8ce de rechange",
        viewId: "view-spare-parts",
        codeField: "internalRef",
        parentKey: "componentId",
        parentEntity: "components",
        fields: [
            { name: "componentId", label: "Composant parent", icon: "fa-circle", type: "parent", required: true },
            { name: "name", label: "D\u00e9signation pi\u00e8ce", icon: "fa-box-open", type: "text", required: true },
            { name: "supplierRef", label: "R\u00e9f\u00e9rence fournisseur", icon: "fa-barcode", type: "text", required: true },
            { name: "internalRef", label: "R\u00e9f\u00e9rence interne (stock)", icon: "fa-hashtag", type: "text", required: true, uppercase: true, unique: true },
            { name: "supplier", label: "Fournisseur", icon: "fa-truck", type: "text", required: true },
            { name: "price", label: "Prix unitaire (DA)", icon: "fa-money-bill-wave", type: "number", required: true },
            { name: "leadTimeValue", label: "D\u00e9lai r\u00e9approvisionnement", icon: "fa-shipping-fast", type: "number", required: true },
            { name: "leadTimeUnit", label: "Unit\u00e9", icon: "fa-shipping-fast", type: "select", required: true, options: ["jours", "semaines", "mois"] },
            { name: "stockMin", label: "Stock minimum requis", icon: "fa-exclamation-triangle", type: "number", required: true },
            { name: "stockCurrent", label: "Stock actuel", icon: "fa-cubes", type: "number", required: true },
            { name: "location", label: "Emplacement en stock", icon: "fa-map-pin", type: "text", required: false },
            { name: "description", label: "Description / Notes", icon: "fa-align-left", type: "textarea", required: false }
        ]
    }
};

const entityData = {
    company: () => [company],
    sites: () => sites,
    departments: () => departments,
    workshops: () => workshops,
    lines: () => lines,
    equipment: () => equipment,
    subassemblies: () => subassemblies,
    organs: () => organs,
    components: () => components,
    spareParts: () => spareParts
};

const orgConfigs = {
    unites: {
        key: "unites",
        label: "Unité principale",
        plural: "Unités principales",
        prefix: "UNI-",
        createTitle: "Nouvelle Unité Principale",
        editTitle: "Modifier l'Unité",
        viewId: "view-unites",
        tableId: "table-unites",
        formId: "form-unites",
        modalId: "modal-unites-form",
        titleId: "modal-unites-title",
        detailModalId: "modal-unites-detail",
        detailBodyId: "detail-unites-body",
        deleteModalId: "modal-unites-delete",
        deleteBodyId: "delete-unites-body",
        parentKey: null,
        parentLevel: null,
        childLevel: "divisions"
    },
    divisions: {
        key: "divisions",
        label: "Division",
        plural: "Divisions",
        prefix: "DIV-",
        createTitle: "Nouvelle Division",
        editTitle: "Modifier la Division",
        viewId: "view-divisions",
        tableId: "table-divisions",
        formId: "form-divisions",
        modalId: "modal-divisions-form",
        titleId: "modal-divisions-title",
        detailModalId: "modal-divisions-detail",
        detailBodyId: "detail-divisions-body",
        deleteModalId: "modal-divisions-delete",
        deleteBodyId: "delete-divisions-body",
        parentKey: "uniteId",
        parentLevel: "unites",
        childLevel: "departements"
    },
    departements: {
        key: "departements",
        label: "Département",
        plural: "Départements",
        prefix: "DEP-",
        createTitle: "Nouveau Département",
        editTitle: "Modifier le Département",
        viewId: "view-departements",
        tableId: "table-departements",
        formId: "form-departements",
        modalId: "modal-departements-form",
        titleId: "modal-departements-title",
        detailModalId: "modal-departements-detail",
        detailBodyId: "detail-departements-body",
        deleteModalId: "modal-departements-delete",
        deleteBodyId: "delete-departements-body",
        parentKey: "divisionId",
        parentLevel: "divisions",
        childLevel: "services"
    },
    services: {
        key: "services",
        label: "Service / Atelier",
        plural: "Services / Ateliers",
        prefix: "SRV-",
        createTitle: "Nouveau Service / Atelier",
        editTitle: "Modifier le Service",
        viewId: "view-services",
        tableId: "table-services",
        formId: "form-services",
        modalId: "modal-services-form",
        titleId: "modal-services-title",
        detailModalId: "modal-services-detail",
        detailBodyId: "detail-services-body",
        deleteModalId: "modal-services-delete",
        deleteBodyId: "delete-services-body",
        parentKey: "departementId",
        parentLevel: "departements",
        childLevel: null
    }
};

const setEntityData = (key, data) => {
    switch (key) {
        case "sites":
            sites = data;
            break;
        case "departments":
            departments = data;
            break;
        case "workshops":
            workshops = data;
            break;
        case "lines":
            lines = data;
            break;
        case "equipment":
            equipment = data;
            break;
        case "subassemblies":
            subassemblies = data;
            break;
        case "organs":
            organs = data;
            break;
        case "components":
            components = data;
            break;
        case "spareParts":
            spareParts = data;
            break;
        default:
            break;
    }
};

const tableState = {
    sites: { search: "", filter: "" },
    departments: { search: "", filter: "" },
    workshops: { search: "", filter: "" },
    lines: { search: "", filter: "" },
    equipment: { search: "", filter: "" },
    subassemblies: { search: "", filter: "" },
    organs: { search: "", filter: "" },
    components: { search: "", filter: "" },
    spareParts: { search: "", filter: "" }
};

const orgDataMap = {
    unites: () => unitesPrincipales,
    divisions: () => divisions,
    departements: () => departements,
    services: () => services
};

const setOrgData = (level, data) => {
    switch (level) {
        case "unites":
            unitesPrincipales = data;
            break;
        case "divisions":
            divisions = data;
            break;
        case "departements":
            departements = data;
            break;
        case "services":
            services = data;
            break;
        default:
            break;
    }
};

const orgFilters = {
    unites: { search: "", parentId: "", parentName: "" },
    divisions: { search: "", parentId: "", parentName: "" },
    departements: { search: "", parentId: "", parentName: "" },
    services: { search: "", parentId: "", parentName: "" }
};

const equipDataMap = {
    groupes: () => groupesEquipements,
    familles: () => famillesEquipements,
    sousfamilles: () => sousFamillesEquipements,
    equipements: () => equipements
};

const setEquipData = (level, data) => {
    switch (level) {
        case "groupes":
            groupesEquipements = data;
            break;
        case "familles":
            famillesEquipements = data;
            break;
        case "sousfamilles":
            sousFamillesEquipements = data;
            break;
        case "equipements":
            equipements = data;
            break;
        default:
            break;
    }
};

const equipFilters = {
    groupes: { search: "" },
    familles: { search: "" },
    sousfamilles: { search: "" },
    equipements: { search: "" }
};

const organDataMap = {
    groupes: () => groupesOrganes,
    familles: () => famillesOrganes,
    sousfamilles: () => sousFamillesOrganes,
    organes: () => organes
};

const setOrganData = (level, data) => {
    switch (level) {
        case "groupes":
            groupesOrganes = data;
            break;
        case "familles":
            famillesOrganes = data;
            break;
        case "sousfamilles":
            sousFamillesOrganes = data;
            break;
        case "organes":
            organes = data;
            break;
        default:
            break;
    }
};

const organFilters = {
    groupes: { search: "" },
    familles: { search: "" },
    sousfamilles: { search: "" },
    organes: { search: "", equipementId: "", equipementNom: "", articleId: "", articleNom: "" }
};

const articleDataMap = {
    groupes: () => groupesArticles,
    familles: () => famillesArticles,
    sousfamilles: () => sousFamillesArticles,
    articles: () => articles
};

const setArticleData = (level, data) => {
    switch (level) {
        case "groupes":
            groupesArticles = data;
            break;
        case "familles":
            famillesArticles = data;
            break;
        case "sousfamilles":
            sousFamillesArticles = data;
            break;
        case "articles":
            articles = data;
            break;
        default:
            break;
    }
};

const articleFilters = {
    groupes: { search: "" },
    familles: { search: "" },
    sousfamilles: { search: "" },
    articles: { search: "", organeId: "", organeNom: "" }
};

const articleFormModals = {};
const articleDeleteModals = {};
const articleDetailModals = {};
let articleFormContext = null;
let pendingArticleDelete = null;
let articleOrganeLinks = [];

const organFormModals = {};
const organDeleteModals = {};
const organDetailModals = {};
let organFormContext = null;
let pendingOrganDelete = null;

const equipFormModals = {};
const equipDeleteModals = {};
const equipDetailModals = {};
let equipFormContext = null;
let pendingEquipDelete = null;

const getOrgConfig = (level) => orgConfigs[level];

const getOrgItems = (level) => orgDataMap[level]();

const getEntityConfig = (key) => entityConfigs[key];

const getEntityItems = (key) => entityData[key]();

const updateCompanyInfo = () => {
    const companyNameElement = document.getElementById("company-name");
    const companyCodeElement = document.getElementById("company-code");
    const companyDetails = document.getElementById("company-details");
    const companySitesCount = document.getElementById("company-sites-count");

    if (companyNameElement) {
        companyNameElement.textContent = company.name;
    }

    if (companyCodeElement) {
        companyCodeElement.textContent = company.code;
    }

    if (companySitesCount) {
        companySitesCount.textContent = sites.length.toString();
    }

    if (companyDetails) {
        const rows = [
            ["Adresse", `${company.wilaya}, ${company.daira}, ${company.commune}`],
            ["Date de cr\u00e9ation", company.createdAt],
            ["T\u00e9l\u00e9phone", company.phone],
            ["Nombre de sites", sites.length.toString()]
        ];
        companyDetails.innerHTML = rows
            .map(([label, value]) => `<dt class="col-sm-4">${label}</dt><dd class="col-sm-8">${value}</dd>`)
            .join("");
    }
};

const getParentOptions = (entityKey) => {
    const config = getEntityConfig(entityKey);
    if (!config?.parentEntity) {
        return [];
    }

    return getEntityItems(config.parentEntity).map((item) => ({
        id: item.id,
        label: item.name || item.tag || item.code || item.internalRef
    }));
};

const getParentLabel = (entityKey, parentId) => {
    const config = getEntityConfig(entityKey);
    if (!config?.parentEntity) {
        return "";
    }

    const parentItem = getEntityItems(config.parentEntity).find((item) => item.id === parentId);
    return parentItem?.name || parentItem?.tag || parentItem?.code || parentItem?.internalRef || "";
};

const getStockStatus = (item) => {
    if (item.stockCurrent <= 0) {
        return { label: "Rupture", className: "gmao-stock-out" };
    }

    if (item.stockCurrent <= item.stockMin) {
        return { label: "Stock faible", className: "gmao-stock-low" };
    }

    return { label: "Stock OK", className: "gmao-stock-ok" };
};

const renderTableRows = (entityKey, items) => {
    switch (entityKey) {
        case "sites":
            return items
                .map((site) => {
                    const departmentCount = departments.filter((dept) => dept.siteId === site.id).length;
                    return `
                        <tr>
                            <td>${site.code}</td>
                            <td>${site.name}</td>
                            <td>${site.wilaya}, ${site.daira}, ${site.commune}</td>
                            <td>${site.manager}</td>
                            <td>${departmentCount}</td>
                            <td>${renderActions(entityKey, site.id, "departments")}</td>
                        </tr>`;
                })
                .join("");
        case "departments":
            return items
                .map((dept) => {
                    const workshopCount = workshops.filter((workshop) => workshop.departmentId === dept.id).length;
                    return `
                        <tr>
                            <td>${dept.code}</td>
                            <td>${dept.name}</td>
                            <td>${getParentLabel(entityKey, dept.siteId)}</td>
                            <td>${dept.manager}</td>
                            <td>${workshopCount}</td>
                            <td>${renderActions(entityKey, dept.id, "workshops")}</td>
                        </tr>`;
                })
                .join("");
        case "workshops":
            return items
                .map((workshop) => `
                        <tr>
                            <td>${workshop.code}</td>
                            <td>${workshop.name}</td>
                            <td>${getParentLabel(entityKey, workshop.departmentId)}</td>
                            <td>${workshop.manager}</td>
                            <td>${workshop.surface} m\u00b2</td>
                            <td>${renderActions(entityKey, workshop.id, "lines")}</td>
                        </tr>`)
                .join("");
        case "lines":
            return items
                .map((line) => `
                        <tr>
                            <td>${line.code}</td>
                            <td>${line.name}</td>
                            <td>${getParentLabel(entityKey, line.workshopId)}</td>
                            <td>${line.functionMain}</td>
                            <td>${renderCriticality(line.criticality)}</td>
                            <td>${renderActions(entityKey, line.id, "equipment")}</td>
                        </tr>`)
                .join("");
        case "equipment":
            return items
                .map((item) => `
                        <tr>
                            <td>${item.tag}</td>
                            <td>${item.name}</td>
                            <td>${item.family}</td>
                            <td>${item.manufacturer}</td>
                            <td>${renderCriticality(item.criticality)}</td>
                            <td>En service</td>
                            <td>${renderActions(entityKey, item.id, "subassemblies")}</td>
                        </tr>`)
                .join("");
        case "subassemblies":
            return items
                .map((item) => `
                        <tr>
                            <td>${item.code}</td>
                            <td>${item.name}</td>
                            <td>${getParentLabel(entityKey, item.equipmentId)}</td>
                            <td>${item.replaceable ? "Oui" : "Non"}</td>
                            <td>${renderActions(entityKey, item.id, "organs")}</td>
                        </tr>`)
                .join("");
        case "organs":
            return items
                .map((item) => `
                        <tr>
                            <td>${item.code}</td>
                            <td>${item.name}</td>
                            <td>${getParentLabel(entityKey, item.subassemblyId)}</td>
                            <td>${item.nominalParameters}</td>
                            <td>${renderActions(entityKey, item.id, "components")}</td>
                        </tr>`)
                .join("");
        case "components":
            return items
                .map((item) => `
                        <tr>
                            <td>${item.code}</td>
                            <td>${item.name}</td>
                            <td>${getParentLabel(entityKey, item.organId)}</td>
                            <td>${item.material}</td>
                            <td>${item.dimensions}</td>
                            <td>${renderActions(entityKey, item.id, "spareParts")}</td>
                        </tr>`)
                .join("");
        case "spareParts":
            return items
                .map((item) => {
                    const stock = getStockStatus(item);
                    return `
                        <tr>
                            <td>${item.internalRef}</td>
                            <td>${item.name}</td>
                            <td>${getParentLabel(entityKey, item.componentId)}</td>
                            <td>${item.supplier}</td>
                            <td>${item.price} DA</td>
                            <td>${item.stockCurrent}</td>
                            <td>${item.stockMin}</td>
                            <td><span class="badge ${stock.className}">${stock.label}</span></td>
                            <td>${renderActions(entityKey, item.id, null)}</td>
                        </tr>`;
                })
                .join("");
        default:
            return "";
    }
};

const renderCriticality = (value) => {
    if (value === "A") {
        return '<span class="badge gmao-badge-critical">Critique</span>';
    }
    if (value === "B") {
        return '<span class="badge gmao-badge-important">Important</span>';
    }
    return '<span class="badge gmao-badge-standard">Standard</span>';
};

const renderActions = (entityKey, id, childEntity) => {
    return `
        <div class="gmao-action-btns d-flex gap-1">
            <button class="btn btn-outline-secondary btn-sm" data-action="detail" data-entity="${entityKey}" data-id="${id}"><i class="fa-solid fa-eye"></i></button>
            <button class="btn btn-outline-primary btn-sm" data-action="edit" data-entity="${entityKey}" data-id="${id}"><i class="fa-solid fa-edit"></i></button>
            <button class="btn btn-outline-danger btn-sm" data-action="delete" data-entity="${entityKey}" data-id="${id}"><i class="fa-solid fa-trash"></i></button>
            ${childEntity ? `<button class="btn btn-outline-success btn-sm" data-action="add-child" data-entity="${entityKey}" data-id="${id}" data-child="${childEntity}"><i class="fa-solid fa-plus"></i></button>` : ""}
        </div>`;
};

const renderTable = (entityKey) => {
    const tableBody = document.getElementById(`table-${entityKey}`);
    if (!tableBody) {
        return;
    }

    const state = tableState[entityKey];
    let items = [...getEntityItems(entityKey)];

    if (state?.filter) {
        const config = getEntityConfig(entityKey);
        if (config?.parentKey) {
            items = items.filter((item) => item[config.parentKey] === state.filter);
        }
    }

    if (state?.search) {
        const searchValue = state.search.toLowerCase();
        items = items.filter((item) => JSON.stringify(item).toLowerCase().includes(searchValue));
    }

    tableBody.innerHTML = renderTableRows(entityKey, items);
};

const renderFilters = (entityKey) => {
    const filterSelect = document.querySelector(`[data-filter="${entityKey}"]`);
    if (!filterSelect) {
        return;
    }

    const options = getParentOptions(entityKey);
    if (!options.length) {
        filterSelect.classList.add("d-none");
        return;
    }

    filterSelect.classList.remove("d-none");
    filterSelect.innerHTML = "<option value=\"\">Tous les parents</option>" +
        options.map((option) => `<option value="${option.id}">${option.label}</option>`).join("");
};

const renderAllTables = () => {
    ["sites", "departments", "workshops", "lines", "equipment", "subassemblies", "organs", "components", "spareParts"].forEach((key) => {
        renderFilters(key);
        renderTable(key);
    });
    updateCompanyInfo();
    renderOrgTables();
    renderEquipTables();
    renderOrganTables();
    renderArticleTables();
    renderArticleFilterBadge();
    checkStockAlerts();
};

const applyUppercase = (input) => {
    if (!input) {
        return;
    }

    input.value = input.value.toUpperCase();
};

const populateGeoSelects = (form, initialData = {}) => {
    const wilayaSelect = form.querySelector("select[data-geo='wilaya']");
    const dairaSelect = form.querySelector("select[data-geo='daira']");
    const communeSelect = form.querySelector("select[data-geo='commune']");

    if (!wilayaSelect || !dairaSelect || !communeSelect || typeof ALGERIA_GEO === "undefined") {
        return;
    }

    wilayaSelect.innerHTML = "<option value=\"\">Choisir une wilaya</option>" +
        ALGERIA_GEO.map((wilaya) => `<option value="${wilaya.name}">${wilaya.code} - ${wilaya.name}</option>`).join("");

    const updateDairas = () => {
        const selectedWilaya = ALGERIA_GEO.find((wilaya) => wilaya.name === wilayaSelect.value);
        dairaSelect.innerHTML = "<option value=\"\">Choisir une da\u00efra</option>" +
            (selectedWilaya?.dairas ?? []).map((daira) => `<option value="${daira.name}">${daira.name}</option>`).join("");
        communeSelect.innerHTML = "<option value=\"\">Choisir une commune</option>";
    };

    const updateCommunes = () => {
        const selectedWilaya = ALGERIA_GEO.find((wilaya) => wilaya.name === wilayaSelect.value);
        const selectedDaira = selectedWilaya?.dairas.find((daira) => daira.name === dairaSelect.value);
        communeSelect.innerHTML = "<option value=\"\">Choisir une commune</option>" +
            (selectedDaira?.communes ?? []).map((commune) => `<option value="${commune}">${commune}</option>`).join("");
    };

    wilayaSelect.addEventListener("change", () => {
        updateDairas();
    });

    dairaSelect.addEventListener("change", () => {
        updateCommunes();
    });

    if (initialData.wilaya) {
        wilayaSelect.value = initialData.wilaya;
        updateDairas();
    }

    if (initialData.daira) {
        dairaSelect.value = initialData.daira;
        updateCommunes();
    }

    if (initialData.commune) {
        communeSelect.value = initialData.commune;
    }
};

const initOrgModals = () => {
    if (!bootstrapAvailable) {
        return;
    }

    Object.values(orgConfigs).forEach((config) => {
        const formModalElement = document.getElementById(config.modalId);
        const detailModalElement = document.getElementById(config.detailModalId);
        const deleteModalElement = document.getElementById(config.deleteModalId);

        if (formModalElement) {
            orgFormModals[config.key] = new bootstrap.Modal(formModalElement);
        }
        if (detailModalElement) {
            orgDetailModals[config.key] = new bootstrap.Modal(detailModalElement);
        }
        if (deleteModalElement) {
            orgDeleteModals[config.key] = new bootstrap.Modal(deleteModalElement);
        }
    });
};

const generateOrgCode = (prefix, items) => {
    const index = items.length + 1;
    return `${prefix}${index.toString().padStart(4, "0")}`;
};

const getOrgParentOptions = (level) => {
    const config = getOrgConfig(level);
    if (!config?.parentLevel) {
        return [];
    }

    return getOrgItems(config.parentLevel).map((item) => ({
        id: item.id,
        label: item.nom
    }));
};

const getOrgParentItem = (level, parentId) => {
    const config = getOrgConfig(level);
    if (!config?.parentLevel) {
        return null;
    }

    return getOrgItems(config.parentLevel).find((item) => item.id === parentId) ?? null;
};

const renderOrgActions = (level, id) => {
    return `
        <div class="gmao-action-btns d-flex gap-1">
            <button class="btn btn-outline-secondary btn-sm" data-org-action="detail" data-level="${level}" data-id="${id}"><i class="fa-solid fa-eye"></i></button>
            <button class="btn btn-outline-primary btn-sm" data-org-action="edit" data-level="${level}" data-id="${id}"><i class="fa-solid fa-edit"></i></button>
            <button class="btn btn-outline-danger btn-sm" data-org-action="delete" data-level="${level}" data-id="${id}"><i class="fa-solid fa-trash"></i></button>
        </div>`;
};

const renderOrgFilterBadge = (level) => {
    const badgeContainer = document.querySelector(`[data-filter-badge="${level}"]`);
    if (!badgeContainer) {
        return;
    }

    const filter = orgFilters[level];
    if (!filter?.parentId) {
        badgeContainer.innerHTML = "";
        return;
    }

    badgeContainer.innerHTML = `
        <div class="filter-badge">
            Filtré par: ${filter.parentName}
            <button type="button" class="btn btn-sm" data-org-action="clear-filter" data-level="${level}">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>`;
};

const renderArticleFilterBadge = () => {
    const badgeContainer = document.querySelector("[data-article-filter-badge='articles']");
    if (!badgeContainer) {
        return;
    }

    if (!articleFilters.articles.organeId) {
        badgeContainer.innerHTML = "";
        return;
    }

    badgeContainer.innerHTML = `
        <div class="filter-badge">
            Filtré par organe: ${articleFilters.articles.organeNom}
            <button type="button" class="btn btn-sm" data-article-filter-clear>
                <i class="fa-solid fa-times"></i>
            </button>
        </div>`;
};

const renderOrgTable = (level) => {
    const config = getOrgConfig(level);
    const tableBody = document.getElementById(config.tableId);
    if (!tableBody) {
        return;
    }

    const filter = orgFilters[level];
    let items = [...getOrgItems(level)];

    if (filter?.parentId && config.parentKey) {
        items = items.filter((item) => item[config.parentKey] === filter.parentId);
    }

    if (filter?.search) {
        const searchValue = filter.search.toLowerCase();
        items = items.filter((item) =>
            item.code.toLowerCase().includes(searchValue) ||
            item.nom.toLowerCase().includes(searchValue));
    }

    const rows = items.map((item) => {
        switch (level) {
            case "unites":
                return `
                    <tr>
                        <td>${item.code}</td>
                        <td>${item.nom}</td>
                        <td>${item.wilaya}</td>
                        <td>${item.directeur}</td>
                        <td>${item.telephone}</td>
                        <td>${renderOrgActions(level, item.id)}</td>
                    </tr>`;
            case "divisions":
                return `
                    <tr>
                        <td>${item.code}</td>
                        <td>${item.nom}</td>
                        <td>${item.uniteName ?? ""}</td>
                        <td>${item.wilaya}</td>
                        <td>${item.responsable}</td>
                        <td>${renderOrgActions(level, item.id)}</td>
                    </tr>`;
            case "departements":
                return `
                    <tr>
                        <td>${item.code}</td>
                        <td>${item.nom}</td>
                        <td>${item.divisionName ?? ""}</td>
                        <td>${item.wilaya}</td>
                        <td>${item.chef}</td>
                        <td>${renderOrgActions(level, item.id)}</td>
                    </tr>`;
            case "services":
                return `
                    <tr>
                        <td>${item.code}</td>
                        <td>${item.nom}</td>
                        <td>${item.departementName ?? ""}</td>
                        <td>${item.batiment ?? ""}</td>
                        <td>${item.chef}</td>
                        <td>${renderOrgActions(level, item.id)}</td>
                    </tr>`;
            default:
                return "";
        }
    }).join("");

    tableBody.innerHTML = rows;
    renderOrgFilterBadge(level);
};

const renderOrgTables = () => {
    Object.keys(orgConfigs).forEach((level) => renderOrgTable(level));
};

const updateLocationInfo = (form, level, parentItem) => {
    const info = form.querySelector(`[data-location-info="${level}"]`);
    if (!info) {
        return;
    }

    if (!parentItem) {
        info.classList.add("d-none");
        info.textContent = "";
        return;
    }

    info.textContent = `? Localisation héritée de ${parentItem.nom} — modifiable`;
    info.classList.remove("d-none");
};

const applyParentLocation = (form, level, parentItem) => {
    if (!parentItem) {
        updateLocationInfo(form, level, null);
        return;
    }

    const wilayaSelect = form.querySelector("select[data-geo='wilaya']");
    const dairaSelect = form.querySelector("select[data-geo='daira']");
    const communeSelect = form.querySelector("select[data-geo='commune']");

    if (!wilayaSelect || !dairaSelect || !communeSelect) {
        return;
    }

    wilayaSelect.value = parentItem.wilaya ?? "";
    wilayaSelect.dispatchEvent(new Event("change"));
    dairaSelect.value = parentItem.daira ?? "";
    dairaSelect.dispatchEvent(new Event("change"));
    communeSelect.value = parentItem.commune ?? "";

    updateLocationInfo(form, level, parentItem);
};

const fillParentSelect = (level, form, selectedId) => {
    const parentSelect = form.querySelector("[data-parent-select]");
    if (!parentSelect) {
        return;
    }

    const options = getOrgParentOptions(level);
    parentSelect.innerHTML = "<option value=\"\">Sélectionner</option>" +
        options.map((option) => `<option value="${option.id}">${option.label}</option>`).join("");

    if (selectedId) {
        parentSelect.value = selectedId;
    }
};

const openOrgForm = (level, mode, itemId, parentId) => {
    const config = getOrgConfig(level);
    const form = document.getElementById(config.formId);
    const modalTitle = document.getElementById(config.titleId);
    if (!form || !modalTitle) {
        return;
    }

    form.reset();
    form.classList.remove("was-validated");
    const items = getOrgItems(level);
    const existingItem = itemId ? items.find((item) => item.id === itemId) : null;
    const codeInput = form.querySelector("[data-field='code']");

    if (codeInput) {
        codeInput.value = mode === "create" ? generateOrgCode(config.prefix, items) : existingItem?.code ?? "";
    }

    form.querySelectorAll("[data-field]").forEach((input) => {
        const field = input.dataset.field;
        if (field === "code") {
            return;
        }
        const value = existingItem?.[field] ?? "";
        if (input.tagName === "SELECT") {
            input.value = value;
        } else {
            input.value = value;
        }
    });

    fillParentSelect(level, form, existingItem?.[config.parentKey] ?? parentId);
    populateGeoSelects(form, existingItem ?? {});

    if (config.parentKey) {
        const parentSelect = form.querySelector("[data-parent-select]");
        const parentItem = getOrgParentItem(level, parentSelect?.value);
        if (mode === "create" && parentItem) {
            applyParentLocation(form, level, parentItem);
        } else {
            updateLocationInfo(form, level, null);
        }
    }

    orgFormContext = { level, mode, itemId };
    modalTitle.textContent = mode === "create" ? config.createTitle : config.editTitle;
    orgFormModals[level]?.show();
};

const readOrgFormValues = (level) => {
    const config = getOrgConfig(level);
    const form = document.getElementById(config.formId);
    if (!form) {
        return null;
    }

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return null;
    }

    const values = {};
    form.querySelectorAll("[data-field]").forEach((input) => {
        const field = input.dataset.field;
        values[field] = input.value;
    });

    return values;
};

const saveOrgForm = (level) => {
    const values = readOrgFormValues(level);
    if (!values) {
        return;
    }

    const config = getOrgConfig(level);
    const items = [...getOrgItems(level)];
    const isEdit = orgFormContext?.mode === "edit";
    const parentItem = config.parentKey ? getOrgParentItem(level, values[config.parentKey]) : null;

    if (config.parentKey) {
        if (level === "divisions") {
            values.uniteName = parentItem?.nom ?? "";
        }
        if (level === "departements") {
            values.divisionName = parentItem?.nom ?? "";
        }
        if (level === "services") {
            values.departementName = parentItem?.nom ?? "";
        }
    }

    if (isEdit && orgFormContext?.itemId) {
        const index = items.findIndex((item) => item.id === orgFormContext.itemId);
        if (index >= 0) {
            items[index] = { ...items[index], ...values };
        }
    } else {
        items.push({
            id: createId(),
            ...values,
            createdAt: new Date().toISOString()
        });
    }

    setOrgData(level, items);
    renderOrgTable(level);
    orgFormModals[level]?.hide();
};

const buildParentChain = (level, item) => {
    const chain = [];
    let currentLevel = level;
    let currentItem = item;

    while (currentLevel) {
        const config = getOrgConfig(currentLevel);
        if (currentItem?.nom) {
            chain.unshift(currentItem.nom);
        }
        if (!config?.parentLevel || !config.parentKey) {
            break;
        }
        currentItem = getOrgParentItem(currentLevel, currentItem[config.parentKey]);
        currentLevel = config.parentLevel;
    }

    return chain.join(" > ");
};

const buildDetailFields = (level, item) => {
    const fields = [];
    if (level === "unites") {
        fields.push(
            ["Wilaya", item.wilaya],
            ["Daïra", item.daira],
            ["Commune", item.commune],
            ["Adresse", item.adresse],
            ["Directeur", item.directeur],
            ["Téléphone", item.telephone],
            ["Email", item.email],
            ["Description", item.description]
        );
    }
    if (level === "divisions") {
        fields.push(
            ["Unité", item.uniteName],
            ["Wilaya", item.wilaya],
            ["Daïra", item.daira],
            ["Commune", item.commune],
            ["Adresse", item.adresse],
            ["Responsable", item.responsable],
            ["Téléphone", item.telephone],
            ["Email", item.email],
            ["Description", item.description]
        );
    }
    if (level === "departements") {
        fields.push(
            ["Division", item.divisionName],
            ["Wilaya", item.wilaya],
            ["Daïra", item.daira],
            ["Commune", item.commune],
            ["Adresse", item.adresse],
            ["Chef", item.chef],
            ["Téléphone", item.telephone],
            ["Email", item.email],
            ["Description", item.description]
        );
    }
    if (level === "services") {
        fields.push(
            ["Département", item.departementName],
            ["Wilaya", item.wilaya],
            ["Daïra", item.daira],
            ["Commune", item.commune],
            ["Bâtiment", item.batiment],
            ["Adresse", item.adresse],
            ["Chef", item.chef],
            ["Téléphone", item.telephone],
            ["Email", item.email],
            ["Description", item.description]
        );
    }

    return fields
        .filter(([_, value]) => value !== undefined)
        .map(([label, value]) => `
            <div class="col-md-6">
                <div class="text-muted small">${label}</div>
                <div class="fw-semibold">${value || "-"}</div>
            </div>`)
        .join("");
};

const openOrgDetail = (level, itemId) => {
    const config = getOrgConfig(level);
    const detailBody = document.getElementById(config.detailBodyId);
    const modalElement = document.getElementById(config.detailModalId);
    if (!detailBody || !modalElement) {
        return;
    }

    const item = getOrgItems(level).find((entry) => entry.id === itemId);
    if (!item) {
        return;
    }

    modalElement.dataset.itemId = itemId;
    const parentChain = buildParentChain(level, item);
    const childLevel = config.childLevel;
    let childrenSection = "";

    if (childLevel) {
        const childConfig = getOrgConfig(childLevel);
        const children = getOrgItems(childLevel).filter((entry) => entry[childConfig.parentKey] === item.id);
        const childrenList = children.map((child) => `<li>${child.code} - ${child.nom}</li>`).join("") || "Aucun.";
        childrenSection = `
            <div class="mt-4">
                <div class="fw-semibold mb-2">Sous-niveaux (${children.length})</div>
                <ul class="mb-3">${childrenList}</ul>
                <button class="btn btn-outline-primary btn-sm" data-org-action="view-children" data-level="${childLevel}" data-parent-id="${item.id}" data-parent-name="${item.nom}">Voir les ${childConfig.plural.toLowerCase()}</button>
            </div>`;
    }

    detailBody.innerHTML = `
        <div class="mb-3">
            <span class="badge bg-primary me-2">${item.code}</span>
            <span class="fw-bold fs-5">${item.nom}</span>
            <span class="badge bg-secondary ms-2">${config.label}</span>
        </div>
        <div class="detail-parent-chain">Parent : ${parentChain}</div>
        <div class="row g-3 mt-2">
            ${buildDetailFields(level, item)}
        </div>
        ${childrenSection}`;

    orgDetailModals[level]?.show();
};

const openOrgDelete = (level, itemId) => {
    const config = getOrgConfig(level);
    const body = document.getElementById(config.deleteBodyId);
    if (!body) {
        return;
    }

    const item = getOrgItems(level).find((entry) => entry.id === itemId);
    if (!item) {
        return;
    }

    pendingOrgDelete = { level, itemId };
    body.innerHTML = `Êtes-vous sûr de vouloir supprimer <strong>${item.nom}</strong> ?<br/>Attention : tous les sous-niveaux associés seront également supprimés.`;
    orgDeleteModals[level]?.show();
};

const cascadeOrgDelete = (level, itemId) => {
    const config = getOrgConfig(level);
    const items = getOrgItems(level).filter((entry) => entry.id !== itemId);
    setOrgData(level, items);

    if (config.childLevel) {
        const childConfig = getOrgConfig(config.childLevel);
        const childItems = getOrgItems(config.childLevel)
            .filter((entry) => entry[childConfig.parentKey] !== itemId);
        const removedChildren = getOrgItems(config.childLevel)
            .filter((entry) => entry[childConfig.parentKey] === itemId)
            .map((entry) => entry.id);

        setOrgData(config.childLevel, childItems);
        removedChildren.forEach((childId) => cascadeOrgDelete(config.childLevel, childId));
    }
};

const confirmOrgDelete = (level) => {
    if (!pendingOrgDelete || pendingOrgDelete.level !== level) {
        return;
    }

    cascadeOrgDelete(level, pendingOrgDelete.itemId);
    pendingOrgDelete = null;
    renderOrgTables();
    orgDeleteModals[level]?.hide();
};

const initEquipModals = () => {
    if (!bootstrapAvailable) {
        return;
    }

    Object.values(equipConfigs).forEach((config) => {
        const formModal = document.getElementById(config.modalId);
        const deleteModal = document.getElementById(config.deleteModalId);
        const detailModal = config.detailModalId ? document.getElementById(config.detailModalId) : null;

        if (formModal) {
            equipFormModals[config.key] = new bootstrap.Modal(formModal);
        }
        if (deleteModal) {
            equipDeleteModals[config.key] = new bootstrap.Modal(deleteModal);
        }
        if (detailModal) {
            equipDetailModals[config.key] = new bootstrap.Modal(detailModal);
        }
    });
};

const getEquipConfig = (level) => equipConfigs[level];
const getEquipItems = (level) => equipDataMap[level]();

const generateEquipCode = (prefix, items) => {
    const index = items.length + 1;
    return `${prefix}${index.toString().padStart(4, "0")}`;
};

const buildEquipOptions = (items) => {
    return items.map((item) => `<option value="${item.id}">${item.nom}</option>`).join("");
};

const renderEquipActions = (level, id) => {
    return `
        <div class="gmao-action-btns d-flex gap-1">
            ${level === "equipements" ? `<button class="btn btn-outline-secondary btn-sm" data-equip-action="detail" data-level="${level}" data-id="${id}"><i class="fa-solid fa-eye"></i></button>` : ""}
            <button class="btn btn-outline-primary btn-sm" data-equip-action="edit" data-level="${level}" data-id="${id}"><i class="fa-solid fa-edit"></i></button>
            <button class="btn btn-outline-danger btn-sm" data-equip-action="delete" data-level="${level}" data-id="${id}"><i class="fa-solid fa-trash"></i></button>
        </div>`;
};

const renderEquipTable = (level) => {
    const config = getEquipConfig(level);
    const tableBody = document.getElementById(config.tableId);
    if (!tableBody) {
        return;
    }

    const filter = equipFilters[level];
    let items = [...getEquipItems(level)];

    if (filter?.search) {
        const value = filter.search.toLowerCase();
        items = items.filter((item) => item.code.toLowerCase().includes(value) || item.nom.toLowerCase().includes(value));
    }

    const rows = items.map((item) => {
        switch (level) {
            case "groupes": {
                const familyCount = famillesEquipements.filter((fam) => fam.groupeId === item.id).length;
                return `
                    <tr>
                        <td>${item.code}</td>
                        <td>${item.nom}</td>
                        <td>${item.designation || "-"}</td>
                        <td>${familyCount}</td>
                        <td>${renderEquipActions(level, item.id)}</td>
                    </tr>`;
            }
            case "familles": {
                const subCount = sousFamillesEquipements.filter((sf) => sf.familleId === item.id).length;
                return `
                    <tr>
                        <td>${item.code}</td>
                        <td>${item.nom}</td>
                        <td>${item.groupeNom || ""}</td>
                        <td>${item.designation || "-"}</td>
                        <td>${subCount}</td>
                        <td>${renderEquipActions(level, item.id)}</td>
                    </tr>`;
            }
            case "sousfamilles": {
                const equipCount = equipements.filter((eq) => eq.sousFamilleId === item.id).length;
                return `
                    <tr>
                        <td>${item.code}</td>
                        <td>${item.nom}</td>
                        <td>${item.familleNom || ""}</td>
                        <td>${item.groupeNom || ""}</td>
                        <td>${item.designation || "-"}</td>
                        <td>${equipCount}</td>
                        <td>${renderEquipActions(level, item.id)}</td>
                    </tr>`;
            }
            case "equipements":
                return `
                    <tr>
                        <td>${item.code}</td>
                        <td>${item.nom}</td>
                        <td>${item.marque}</td>
                        <td>${renderCriticiteBadge(item.criticite)}</td>
                        <td>${renderStatutBadge(item.statut)}</td>
                        <td>${item.serviceNom || ""}</td>
                        <td>${renderEquipActions(level, item.id)}</td>
                    </tr>`;
            default:
                return "";
        }
    }).join("");

    tableBody.innerHTML = rows;
};

const renderEquipTables = () => {
    Object.keys(equipConfigs).forEach((level) => renderEquipTable(level));
};

const populateEquipSelects = (form, level) => {
    const groupSelect = form.querySelector("[data-equip-group]");
    const familySelect = form.querySelector("[data-equip-family]");
    const subFamilySelect = form.querySelector("[data-equip-subfamily]");

    if (groupSelect) {
        groupSelect.innerHTML = `<option value="">Sélectionner</option>${buildEquipOptions(groupesEquipements)}`;
    }
    if (familySelect) {
        familySelect.innerHTML = "<option value=\"\">Sélectionner</option>";
    }
    if (subFamilySelect) {
        subFamilySelect.innerHTML = "<option value=\"\">Sélectionner</option>";
    }

    if (level === "familles") {
        const select = form.querySelector("[data-equip-parent='familles']");
        if (select) {
            select.innerHTML = `<option value="">Sélectionner</option>${buildEquipOptions(groupesEquipements)}`;
        }
    }

    if (level === "sousfamilles") {
        const group = form.querySelector("[data-equip-parent='sousfamilles']");
        const family = form.querySelector("[data-equip-family='sousfamilles']");
        if (group) {
            group.innerHTML = `<option value="">Sélectionner</option>${buildEquipOptions(groupesEquipements)}`;
        }
        if (family) {
            family.innerHTML = "<option value=\"\">Sélectionner</option>";
        }
    }

    if (level === "equipements") {
        const serviceSelect = form.querySelector("[data-equip-service]");
        if (serviceSelect) {
            serviceSelect.innerHTML = `<option value="">Sélectionner</option>${services.map((svc) => `<option value="${svc.id}">${svc.nom}</option>`).join("")}`;
        }
    }
};

const cascadeEquipFamilies = (groupId, familySelect, subFamilySelect) => {
    const families = famillesEquipements.filter((fam) => fam.groupeId === groupId);
    familySelect.innerHTML = `<option value="">Sélectionner</option>${buildEquipOptions(families)}`;
    subFamilySelect.innerHTML = "<option value=\"\">Sélectionner</option>";
};

const cascadeEquipSubFamilies = (familyId, subFamilySelect) => {
    const subs = sousFamillesEquipements.filter((sf) => sf.familleId === familyId);
    subFamilySelect.innerHTML = `<option value="">Sélectionner</option>${buildEquipOptions(subs)}`;
};

const setServiceLocation = (form, serviceId) => {
    const locationInput = form.querySelector("[data-field='localisation']");
    if (!locationInput) {
        return;
    }

    const service = services.find((svc) => svc.id === serviceId);
    if (!service) {
        locationInput.value = "";
        return;
    }

    locationInput.value = `${service.wilaya || ""} ${service.daira || ""} ${service.commune || ""}`.trim();
};

const setupCriticiteCards = (form, value) => {
    const cards = form.querySelectorAll("[data-criticite-group] .criticite-card");
    cards.forEach((card) => {
        card.classList.toggle("active", card.dataset.value === value);
    });
};

const openEquipForm = (level, mode, itemId) => {
    const config = getEquipConfig(level);
    const form = document.getElementById(config.formId);
    const title = document.getElementById(config.titleId);
    if (!form || !title) {
        return;
    }

    form.reset();
    form.classList.remove("was-validated");
    const items = getEquipItems(level);
    const existing = itemId ? items.find((item) => item.id === itemId) : null;
    const codeInput = form.querySelector("[data-field='code']");
    if (codeInput) {
        codeInput.value = mode === "create" ? generateEquipCode(config.prefix, items) : existing?.code ?? "";
    }

    populateEquipSelects(form, level);

    form.querySelectorAll("[data-field]").forEach((input) => {
        const field = input.dataset.field;
        if (field === "code") {
            return;
        }
        if (input.type === "file") {
            return;
        }
        input.value = existing?.[field] ?? "";
    });

    if (level === "equipements") {
        const groupSelect = form.querySelector("[data-equip-group]");
        const familySelect = form.querySelector("[data-equip-family]");
        const subFamilySelect = form.querySelector("[data-equip-subfamily]");
        if (groupSelect && familySelect && subFamilySelect && existing?.groupeId) {
            groupSelect.value = existing.groupeId;
            cascadeEquipFamilies(existing.groupeId, familySelect, subFamilySelect);
        }
        if (familySelect && subFamilySelect && existing?.familleId) {
            familySelect.value = existing.familleId;
            cascadeEquipSubFamilies(existing.familleId, subFamilySelect);
        }
        if (subFamilySelect && existing?.sousFamilleId) {
            subFamilySelect.value = existing.sousFamilleId;
        }
        const serviceSelect = form.querySelector("[data-equip-service]");
        if (serviceSelect && existing?.serviceId) {
            serviceSelect.value = existing.serviceId;
            setServiceLocation(form, existing.serviceId);
        }
        setupCriticiteCards(form, existing?.criticite ?? "1");
        form.querySelectorAll("[name='statut']").forEach((radio) => {
            radio.checked = radio.value === (existing?.statut ?? "En service");
        });
    }

    if (level === "familles") {
        const parent = form.querySelector("[data-equip-parent='familles']");
        if (parent && existing?.groupeId) {
            parent.value = existing.groupeId;
        }
    }

    if (level === "sousfamilles") {
        const group = form.querySelector("[data-equip-parent='sousfamilles']");
        const family = form.querySelector("[data-equip-family='sousfamilles']");
        if (group && existing?.groupeId) {
            group.value = existing.groupeId;
            if (family) {
                const families = famillesEquipements.filter((fam) => fam.groupeId === existing.groupeId);
                family.innerHTML = `<option value="">Sélectionner</option>${buildEquipOptions(families)}`;
            }
        }
        if (family && existing?.familleId) {
            family.value = existing.familleId;
        }
    }

    equipFormContext = { level, mode, itemId };
    title.textContent = mode === "create" ? `Nouveau ${config.label}` : `Modifier ${config.label}`;
    equipFormModals[level]?.show();
};

const readEquipFormValues = (level) => {
    const config = getEquipConfig(level);
    const form = document.getElementById(config.formId);
    if (!form) {
        return null;
    }

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return null;
    }

    const values = {};
    form.querySelectorAll("[data-field]").forEach((input) => {
        const field = input.dataset.field;
        if (input.type === "file") {
            return;
        }
        values[field] = input.value;
    });

    if (level === "equipements") {
        const criticiteCard = form.querySelector("[data-criticite-group] .criticite-card.active");
        values.criticite = criticiteCard?.dataset.value ?? "1";
        const statut = form.querySelector("[name='statut']:checked");
        values.statut = statut?.value ?? "En service";

        const photoInput = form.querySelector("[data-field='photo']");
        if (photoInput?.files?.length) {
            values.photo = URL.createObjectURL(photoInput.files[0]);
        }

        const documentsInput = form.querySelector("[data-field='documents']");
        if (documentsInput?.files?.length) {
            values.documents = Array.from(documentsInput.files).map((file) => ({
                nom: file.name,
                type: file.type
            }));
        }
    }

    return values;
};

const saveEquipForm = (level) => {
    const values = readEquipFormValues(level);
    if (!values) {
        return;
    }

    const config = getEquipConfig(level);
    const items = [...getEquipItems(level)];
    const isEdit = equipFormContext?.mode === "edit";

    if (level === "familles") {
        const groupe = groupesEquipements.find((grp) => grp.id === values.groupeId);
        values.groupeNom = groupe?.nom ?? "";
    }
    if (level === "sousfamilles") {
        const famille = famillesEquipements.find((fam) => fam.id === values.familleId);
        values.familleNom = famille?.nom ?? "";
        values.groupeId = famille?.groupeId ?? values.groupeId;
        values.groupeNom = famille?.groupeNom ?? "";
    }
    if (level === "equipements") {
        const groupe = groupesEquipements.find((grp) => grp.id === values.groupeId);
        const famille = famillesEquipements.find((fam) => fam.id === values.familleId);
        const sousFamille = sousFamillesEquipements.find((sf) => sf.id === values.sousFamilleId);
        const service = services.find((svc) => svc.id === values.serviceId);
        values.groupeNom = groupe?.nom ?? "";
        values.familleNom = famille?.nom ?? "";
        values.sousFamilleNom = sousFamille?.nom ?? "";
        values.serviceNom = service?.nom ?? "";
    }

    if (isEdit && equipFormContext?.itemId) {
        const index = items.findIndex((item) => item.id === equipFormContext.itemId);
        if (index >= 0) {
            const current = items[index];
            items[index] = {
                ...current,
                ...values,
                photo: values.photo ?? current.photo,
                documents: values.documents ?? current.documents
            };
        }
    } else {
        items.push({ id: createId(), ...values, createdAt: new Date().toISOString() });
    }

    setEquipData(level, items);
    renderEquipTables();
    equipFormModals[level]?.hide();
};

const renderCriticiteBadge = (value) => {
    switch (value) {
        case "1":
            return '<span class="badge criticite-badge criticite-1">Très Haute</span>';
        case "2":
            return '<span class="badge criticite-badge criticite-2">Haute</span>';
        case "3":
            return '<span class="badge criticite-badge criticite-3">Normale</span>';
        default:
            return '<span class="badge criticite-badge criticite-4">Basse</span>';
    }
};

const renderStatutBadge = (value) => {
    const map = {
        "En service": "statut-service",
        "En panne": "statut-panne",
        "En maintenance": "statut-maintenance",
        "En standby": "statut-standby",
        "Hors service": "statut-hors-service"
    };
    const className = map[value] ?? "statut-hors-service";
    return `<span class="badge statut-badge ${className}">${value}</span>`;
};

const openEquipDetail = (itemId) => {
    const item = equipements.find((eq) => eq.id === itemId);
    const body = document.getElementById(equipConfigs.equipements.detailBodyId);
    if (!item || !body) {
        return;
    }

    const documents = (item.documents ?? []).map((doc) => `<li><i class="fa-solid fa-file"></i> ${doc.nom}</li>`).join("") || "<li>Aucun document</li>";
    body.innerHTML = `
        <div class="equip-detail-header">
            <div class="equip-photo">${item.photo ? `<img src="${item.photo}" alt="Photo" />` : "<i class=\"fa-solid fa-camera\"></i>"}</div>
            <div>
                <div class="badge bg-primary mb-2">${item.code}</div>
                <div class="fw-bold fs-4">${item.nom}</div>
                <div class="d-flex flex-wrap gap-2 mt-2">
                    ${renderCriticiteBadge(item.criticite)}
                    ${renderStatutBadge(item.statut)}
                    <span class="badge bg-secondary">${item.groupeNom} &gt; ${item.familleNom} &gt; ${item.sousFamilleNom}</span>
                </div>
                <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-outline-primary btn-sm" data-equip-action="edit" data-level="equipements" data-id="${item.id}"><i class="fa-solid fa-edit"></i> Modifier</button>
                    <button class="btn btn-outline-danger btn-sm" data-equip-action="delete" data-level="equipements" data-id="${item.id}"><i class="fa-solid fa-trash"></i> Supprimer</button>
                    <button class="btn btn-outline-secondary btn-sm" data-view="view-organes" data-organe-filter="${item.id}"><i class="fa-solid fa-puzzle-piece"></i> Voir les Organes</button>
                </div>
            </div>
        </div>
        <div class="row g-3 mt-3">
            <div class="col-md-6"><div class="text-muted small">Marque</div><div class="fw-semibold">${item.marque || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Fournisseur</div><div class="fw-semibold">${item.fournisseur || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">N° série</div><div class="fw-semibold">${item.numeroSerie || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Service/Atelier</div><div class="fw-semibold">${item.serviceNom || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Date achat</div><div class="fw-semibold">${item.dateAchat || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Prix achat</div><div class="fw-semibold">${item.prixAchat || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Date mise en service</div><div class="fw-semibold">${item.dateMiseEnService || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Garantie</div><div class="fw-semibold">${item.periodeGarantie || "-"} ${item.periodeGarantieUnite || ""}</div></div>
            <div class="col-md-6"><div class="text-muted small">Bâtiment</div><div class="fw-semibold">${item.batiment || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Salle</div><div class="fw-semibold">${item.salle || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Ligne</div><div class="fw-semibold">${item.ligne || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Compteur heures</div><div class="fw-semibold">${item.compteurHeures || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Compteur cycles</div><div class="fw-semibold">${item.compteurCycles || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Compteur km</div><div class="fw-semibold">${item.compteurKm || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Seuil alerte</div><div class="fw-semibold">${item.seuilAlerte || "-"}</div></div>
        </div>
        <div class="mt-3">
            <div class="fw-semibold mb-2">Documents</div>
            <ul class="file-list">${documents}</ul>
        </div>`;

    equipDetailModals.equipements?.show();
};

const openEquipDelete = (level, itemId) => {
    const config = getEquipConfig(level);
    const body = document.getElementById(config.deleteBodyId);
    if (!body) {
        return;
    }

    const item = getEquipItems(level).find((entry) => entry.id === itemId);
    if (!item) {
        return;
    }

    pendingEquipDelete = { level, itemId };
    body.innerHTML = `Êtes-vous sûr de vouloir supprimer <strong>${item.nom}</strong> ?<br/>Tous les sous-niveaux associés seront supprimés.`;
    equipDeleteModals[level]?.show();
};

const cascadeEquipDelete = (level, itemId) => {
    const items = getEquipItems(level).filter((entry) => entry.id !== itemId);
    setEquipData(level, items);

    if (level === "groupes") {
        famillesEquipements.filter((fam) => fam.groupeId === itemId).forEach((fam) => cascadeEquipDelete("familles", fam.id));
    }
    if (level === "familles") {
        sousFamillesEquipements.filter((sf) => sf.familleId === itemId).forEach((sf) => cascadeEquipDelete("sousfamilles", sf.id));
    }
    if (level === "sousfamilles") {
        equipements.filter((eq) => eq.sousFamilleId === itemId).forEach((eq) => cascadeEquipDelete("equipements", eq.id));
    }
};

const confirmEquipDelete = (level) => {
    if (!pendingEquipDelete || pendingEquipDelete.level !== level) {
        return;
    }

    cascadeEquipDelete(level, pendingEquipDelete.itemId);
    pendingEquipDelete = null;
    renderEquipTables();
    equipDeleteModals[level]?.hide();
};

const initOrganModals = () => {
    if (!bootstrapAvailable) {
        return;
    }

    Object.values(organConfigs).forEach((config) => {
        const formModal = document.getElementById(config.modalId);
        const deleteModal = document.getElementById(config.deleteModalId);
        const detailModal = config.detailModalId ? document.getElementById(config.detailModalId) : null;

        if (formModal) {
            organFormModals[config.key] = new bootstrap.Modal(formModal);
        }
        if (deleteModal) {
            organDeleteModals[config.key] = new bootstrap.Modal(deleteModal);
        }
        if (detailModal) {
            organDetailModals[config.key] = new bootstrap.Modal(detailModal);
        }
    });
};

const getOrganConfig = (level) => organConfigs[level];
const getOrganItems = (level) => organDataMap[level]();

const generateOrganCode = (prefix, items) => {
    const index = items.length + 1;
    return `${prefix}${index.toString().padStart(4, "0")}`;
};

const renderOrganActions = (level, id) => {
    return `
        <div class="gmao-action-btns d-flex gap-1">
            <button class="btn btn-outline-secondary btn-sm" data-organ-action="detail" data-level="${level}" data-id="${id}"><i class="fa-solid fa-eye"></i></button>
            <button class="btn btn-outline-primary btn-sm" data-organ-action="edit" data-level="${level}" data-id="${id}"><i class="fa-solid fa-edit"></i></button>
            <button class="btn btn-outline-danger btn-sm" data-organ-action="delete" data-level="${level}" data-id="${id}"><i class="fa-solid fa-trash"></i></button>
        </div>`;
};

const renderOrganFilterBadge = () => {
    const badgeContainer = document.querySelector("[data-organ-filter-badge='organes']");
    if (!badgeContainer) {
        return;
    }

    if (!organFilters.organes.equipementId && !organFilters.organes.articleId) {
        badgeContainer.innerHTML = "";
        return;
    }

    if (organFilters.organes.articleId) {
        badgeContainer.innerHTML = `
        <div class="filter-badge">
            Filtré par article: ${organFilters.organes.articleNom}
            <button type="button" class="btn btn-sm" data-organ-action="clear-filter" data-level="organes">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>`;
        return;
    }

    badgeContainer.innerHTML = `
        <div class="filter-badge">
            Filtré par équipement: ${organFilters.organes.equipementNom}
            <button type="button" class="btn btn-sm" data-organ-action="clear-filter" data-level="organes">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>`;
};

const renderOrganStatusBadge = (value) => {
    const map = {
        "En service": "organ-statut-service",
        "Usé": "organ-statut-use",
        "En attente remplacement": "organ-statut-attente",
        "Remplacé": "organ-statut-remplace",
        "Hors service": "organ-statut-hs"
    };
    const className = map[value] ?? "organ-statut-service";
    return `<span class="badge organe-statut-badge ${className}">${value}</span>`;
};

const renderOrganTable = (level) => {
    const config = getOrganConfig(level);
    const tableBody = document.getElementById(config.tableId);
    if (!tableBody) {
        return;
    }

    const filter = organFilters[level];
    let items = [...getOrganItems(level)];

    if (level === "organes" && filter.equipementId) {
        items = items.filter((item) => item.equipementId === filter.equipementId);
    }

    if (level === "organes" && filter.articleId) {
        const linkedOrganeIds = articles
            .find((article) => article.id === filter.articleId)?.organeLinks
            ?.map((link) => link.organeId) ?? [];
        items = items.filter((item) => linkedOrganeIds.includes(item.id));
    }

    if (filter?.search) {
        const value = filter.search.toLowerCase();
        items = items.filter((item) => item.code.toLowerCase().includes(value) || item.nom.toLowerCase().includes(value));
    }

    const rows = items.map((item) => {
        switch (level) {
            case "groupes": {
                const familyCount = famillesOrganes.filter((fam) => fam.groupeId === item.id).length;
                return `
                    <tr>
                        <td>${item.code}</td>
                        <td>${item.nom}</td>
                        <td>${item.designation || "-"}</td>
                        <td>${familyCount}</td>
                        <td>${renderOrganActions(level, item.id)}</td>
                    </tr>`;
            }
            case "familles": {
                const subCount = sousFamillesOrganes.filter((sf) => sf.familleId === item.id).length;
                return `
                    <tr>
                        <td>${item.code}</td>
                        <td>${item.nom}</td>
                        <td>${item.groupeNom || ""}</td>
                        <td>${item.designation || "-"}</td>
                        <td>${subCount}</td>
                        <td>${renderOrganActions(level, item.id)}</td>
                    </tr>`;
            }
            case "sousfamilles": {
                const organCount = organes.filter((org) => org.sousFamilleId === item.id).length;
                return `
                    <tr>
                        <td>${item.code}</td>
                        <td>${item.nom}</td>
                        <td>${item.familleNom || ""}</td>
                        <td>${item.groupeNom || ""}</td>
                        <td>${item.designation || "-"}</td>
                        <td>${organCount}</td>
                        <td>${renderOrganActions(level, item.id)}</td>
                    </tr>`;
            }
            case "organes":
                return `
                    <tr>
                        <td>${item.code}</td>
                        <td>${item.nom}</td>
                        <td>${item.equipementNom || ""}</td>
                        <td>${item.familleNom || ""}</td>
                        <td>${renderOrganStatusBadge(item.statut)}</td>
                        <td>${renderOrganActions(level, item.id)}</td>
                    </tr>`;
            default:
                return "";
        }
    }).join("");

    tableBody.innerHTML = rows;

    if (level === "organes") {
        renderOrganFilterBadge();
    }
};

const renderOrganTables = () => {
    Object.keys(organConfigs).forEach((level) => renderOrganTable(level));
};

const populateOrganSelects = (form, level) => {
    const groupSelect = form.querySelector("[data-organe-group]");
    const familySelect = form.querySelector("[data-organe-family]");
    const subFamilySelect = form.querySelector("[data-organe-subfamily]");

    if (groupSelect) {
        groupSelect.innerHTML = `<option value="">Sélectionner</option>${groupesOrganes.map((grp) => `<option value="${grp.id}">${grp.nom}</option>`).join("")}`;
    }
    if (familySelect) {
        familySelect.innerHTML = "<option value=\"\">Sélectionner</option>";
    }
    if (subFamilySelect) {
        subFamilySelect.innerHTML = "<option value=\"\">Sélectionner</option>";
    }

    if (level === "familles") {
        const select = form.querySelector("[data-organ-parent='familles']");
        if (select) {
            select.innerHTML = `<option value="">Sélectionner</option>${groupesOrganes.map((grp) => `<option value="${grp.id}">${grp.nom}</option>`).join("")}`;
        }
    }

    if (level === "sousfamilles") {
        const group = form.querySelector("[data-organ-parent='sousfamilles']");
        const family = form.querySelector("[data-organ-family='sousfamilles']");
        if (group) {
            group.innerHTML = `<option value="">Sélectionner</option>${groupesOrganes.map((grp) => `<option value="${grp.id}">${grp.nom}</option>`).join("")}`;
        }
        if (family) {
            family.innerHTML = "<option value=\"\">Sélectionner</option>";
        }
    }

    if (level === "organes") {
        const equipSelect = form.querySelector("[data-organe-equipement]");
        if (equipSelect) {
            equipSelect.innerHTML = `<option value="">Sélectionner</option>${equipements.map((eq) => `<option value="${eq.id}">[${eq.code}] ${eq.nom}</option>`).join("")}`;
        }
    }
};

const cascadeOrganFamilies = (groupId, familySelect, subFamilySelect) => {
    const families = famillesOrganes.filter((fam) => fam.groupeId === groupId);
    familySelect.innerHTML = `<option value="">Sélectionner</option>${families.map((fam) => `<option value="${fam.id}">${fam.nom}</option>`).join("")}`;
    subFamilySelect.innerHTML = "<option value=\"\">Sélectionner</option>";
};

const cascadeOrganSubFamilies = (familyId, subFamilySelect) => {
    const subs = sousFamillesOrganes.filter((sf) => sf.familleId === familyId);
    subFamilySelect.innerHTML = `<option value="">Sélectionner</option>${subs.map((sf) => `<option value="${sf.id}">${sf.nom}</option>`).join("")}`;
};

const renderEquipementInfoCard = (form, equipementId) => {
    const infoCard = form.querySelector("[data-equipement-info]");
    if (!infoCard) {
        return;
    }

    const equipement = equipements.find((eq) => eq.id === equipementId);
    if (!equipement) {
        infoCard.classList.add("d-none");
        infoCard.innerHTML = "";
        return;
    }

    infoCard.classList.remove("d-none");
    infoCard.innerHTML = `
        <div class="d-flex align-items-start gap-3">
            <div class="equip-info-icon"><i class="fa-solid fa-cog"></i></div>
            <div>
                <div class="fw-semibold">${equipement.nom} (${equipement.code})</div>
                <div class="text-muted small">Service: ${equipement.serviceNom || "-"}</div>
                <div class="text-muted small">Criticité: ${renderCriticiteBadge(equipement.criticite)}</div>
                <div class="text-muted small">Localisation: ${[equipement.batiment, equipement.salle, equipement.ligne].filter(Boolean).join(", ") || "-"}</div>
            </div>
        </div>`;
};

const openOrganForm = (level, mode, itemId) => {
    const config = getOrganConfig(level);
    const form = document.getElementById(config.formId);
    const title = document.getElementById(config.titleId);
    if (!form || !title) {
        return;
    }

    form.reset();
    form.classList.remove("was-validated");
    const items = getOrganItems(level);
    const existing = itemId ? items.find((item) => item.id === itemId) : null;
    const codeInput = form.querySelector("[data-field='code']");
    if (codeInput) {
        codeInput.value = mode === "create" ? generateOrganCode(config.prefix, items) : existing?.code ?? "";
    }

    populateOrganSelects(form, level);

    form.querySelectorAll("[data-field]").forEach((input) => {
        const field = input.dataset.field;
        if (field === "code" || input.type === "file") {
            return;
        }
        input.value = existing?.[field] ?? "";
    });

    if (level === "familles") {
        const parent = form.querySelector("[data-organ-parent='familles']");
        if (parent && existing?.groupeId) {
            parent.value = existing.groupeId;
        }
    }

    if (level === "sousfamilles") {
        const group = form.querySelector("[data-organ-parent='sousfamilles']");
        const family = form.querySelector("[data-organ-family='sousfamilles']");
        if (group && existing?.groupeId) {
            group.value = existing.groupeId;
            if (family) {
                const families = famillesOrganes.filter((fam) => fam.groupeId === existing.groupeId);
                family.innerHTML = `<option value="">Sélectionner</option>${families.map((fam) => `<option value="${fam.id}">${fam.nom}</option>`).join("")}`;
            }
        }
        if (family && existing?.familleId) {
            family.value = existing.familleId;
        }
    }

    if (level === "organes") {
        const groupSelect = form.querySelector("[data-organe-group]");
        const familySelect = form.querySelector("[data-organe-family]");
        const subFamilySelect = form.querySelector("[data-organe-subfamily]");
        if (groupSelect && familySelect && subFamilySelect && existing?.groupeId) {
            groupSelect.value = existing.groupeId;
            cascadeOrganFamilies(existing.groupeId, familySelect, subFamilySelect);
        }
        if (familySelect && subFamilySelect && existing?.familleId) {
            familySelect.value = existing.familleId;
            cascadeOrganSubFamilies(existing.familleId, subFamilySelect);
        }
        if (subFamilySelect && existing?.sousFamilleId) {
            subFamilySelect.value = existing.sousFamilleId;
        }
        const equipSelect = form.querySelector("[data-organe-equipement]");
        if (equipSelect && existing?.equipementId) {
            equipSelect.value = existing.equipementId;
            renderEquipementInfoCard(form, existing.equipementId);
        } else {
            renderEquipementInfoCard(form, "");
        }

        form.querySelectorAll("[name='statut-organe']").forEach((radio) => {
            radio.checked = radio.value === (existing?.statut ?? "En service");
        });
    }

    organFormContext = { level, mode, itemId };
    title.textContent = mode === "create" ? `Nouveau ${config.label}` : `Modifier ${config.label}`;
    organFormModals[level]?.show();
};

const readOrganFormValues = (level) => {
    const config = getOrganConfig(level);
    const form = document.getElementById(config.formId);
    if (!form) {
        return null;
    }

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return null;
    }

    const values = {};
    form.querySelectorAll("[data-field]").forEach((input) => {
        const field = input.dataset.field;
        if (input.type === "file") {
            return;
        }
        values[field] = input.value;
    });

    if (level === "organes") {
        const statut = form.querySelector("[name='statut-organe']:checked");
        values.statut = statut?.value ?? "En service";

        const photoInput = form.querySelector("[data-field='photo']");
        if (photoInput?.files?.length) {
            values.photo = URL.createObjectURL(photoInput.files[0]);
        }

        const documentsInput = form.querySelector("[data-field='documents']");
        if (documentsInput?.files?.length) {
            values.documents = Array.from(documentsInput.files).map((file) => ({
                nom: file.name,
                type: file.type
            }));
        }
    }

    return values;
};

const saveOrganForm = (level) => {
    const values = readOrganFormValues(level);
    if (!values) {
        return;
    }

    const config = getOrganConfig(level);
    const items = [...getOrganItems(level)];
    const isEdit = organFormContext?.mode === "edit";

    if (level === "familles") {
        const groupe = groupesOrganes.find((grp) => grp.id === values.groupeId);
        values.groupeNom = groupe?.nom ?? "";
    }
    if (level === "sousfamilles") {
        const famille = famillesOrganes.find((fam) => fam.id === values.familleId);
        values.familleNom = famille?.nom ?? "";
        values.groupeId = famille?.groupeId ?? values.groupeId;
        values.groupeNom = famille?.groupeNom ?? "";
    }
    if (level === "organes") {
        const groupe = groupesOrganes.find((grp) => grp.id === values.groupeId);
        const famille = famillesOrganes.find((fam) => fam.id === values.familleId);
        const sousFamille = sousFamillesOrganes.find((sf) => sf.id === values.sousFamilleId);
        const equipement = equipements.find((eq) => eq.id === values.equipementId);
        values.groupeNom = groupe?.nom ?? "";
        values.familleNom = famille?.nom ?? "";
        values.sousFamilleNom = sousFamille?.nom ?? "";
        values.equipementNom = equipement?.nom ?? "";
        values.equipementCode = equipement?.code ?? "";
    }

    if (isEdit && organFormContext?.itemId) {
        const index = items.findIndex((item) => item.id === organFormContext.itemId);
        if (index >= 0) {
            const current = items[index];
            items[index] = {
                ...current,
                ...values,
                photo: values.photo ?? current.photo,
                documents: values.documents ?? current.documents
            };
        }
    } else {
        items.push({ id: createId(), ...values, createdAt: new Date().toISOString() });
    }

    setOrganData(level, items);
    renderOrganTables();
    organFormModals[level]?.hide();
};

const openOrganDetail = (level, itemId) => {
    const config = getOrganConfig(level);
    const item = getOrganItems(level).find((entry) => entry.id === itemId);
    const body = document.getElementById(config.detailBodyId);
    const modalElement = document.getElementById(config.detailModalId);
    if (!item || !body || !modalElement) {
        return;
    }

    modalElement.dataset.itemId = itemId;

    if (level !== "organes") {
        body.innerHTML = `
            <div class="mb-2"><span class="badge bg-primary">${item.code}</span></div>
            <div class="fw-bold">${item.nom}</div>
            <div class="text-muted">${item.designation || "-"}</div>`;
        organDetailModals[level]?.show();
        return;
    }

    const documents = (item.documents ?? []).map((doc) => `<li><i class="fa-solid fa-file"></i> ${doc.nom}</li>`).join("") || "<li>Aucun document</li>";
    body.innerHTML = `
        <div class="equip-detail-header">
            <div class="equip-photo">${item.photo ? `<img src="${item.photo}" alt="Photo" />` : "<i class=\"fa-solid fa-camera\"></i>"}</div>
            <div>
                <div class="badge bg-primary mb-2">${item.code}</div>
                <div class="fw-bold fs-4">${item.nom}</div>
                <div class="d-flex flex-wrap gap-2 mt-2">
                    ${renderOrganStatusBadge(item.statut)}
                    <span class="badge bg-secondary">${item.groupeNom} &gt; ${item.familleNom} &gt; ${item.sousFamilleNom}</span>
                </div>
                <div class="text-muted mt-2">Appartient à → <a href="#" data-equipement-detail="${item.equipementId}"><i class="fa-solid fa-cog"></i> ${item.equipementNom} (${item.equipementCode})</a></div>
                <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-outline-primary btn-sm" data-organ-action="edit" data-level="organes" data-id="${item.id}"><i class="fa-solid fa-edit"></i> Modifier</button>
                    <button class="btn btn-outline-danger btn-sm" data-organ-action="delete" data-level="organes" data-id="${item.id}"><i class="fa-solid fa-trash"></i> Supprimer</button>
                    <button class="btn btn-outline-secondary btn-sm" data-organ-action="view-articles" data-id="${item.id}" data-name="${item.nom}"><i class="fa-solid fa-box-open"></i> Voir les Articles liés</button>
                </div>
            </div>
        </div>
        <div class="row g-3 mt-3">
            <div class="col-md-6"><div class="text-muted small">Marque</div><div class="fw-semibold">${item.marque || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Référence</div><div class="fw-semibold">${item.reference || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Fournisseur</div><div class="fw-semibold">${item.fournisseur || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Date installation</div><div class="fw-semibold">${item.dateInstallation || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Date remplacement</div><div class="fw-semibold">${item.dateRemplacement || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Durée de vie</div><div class="fw-semibold">${item.dureeVie || "-"} ${item.dureeVieUnite || ""}</div></div>
            <div class="col-md-6"><div class="text-muted small">Prix unitaire</div><div class="fw-semibold">${item.prixUnitaire || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Position</div><div class="fw-semibold">${item.positionSurEquipement || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Description</div><div class="fw-semibold">${item.descriptionTechnique || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Équipement</div><div class="fw-semibold">${item.equipementNom || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Service</div><div class="fw-semibold">${equipements.find((eq) => eq.id === item.equipementId)?.serviceNom || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Criticité</div><div class="fw-semibold">${renderCriticiteBadge(equipements.find((eq) => eq.id === item.equipementId)?.criticite ?? "1")}</div></div>
        </div>
        <div class="mt-3">
            <div class="fw-semibold mb-2">Documents</div>
            <ul class="file-list">${documents}</ul>
        </div>`;

    organDetailModals.organes?.show();
};

const openOrganDelete = (level, itemId) => {
    const config = getOrganConfig(level);
    const body = document.getElementById(config.deleteBodyId);
    if (!body) {
        return;
    }

    const item = getOrganItems(level).find((entry) => entry.id === itemId);
    if (!item) {
        return;
    }

    pendingOrganDelete = { level, itemId };
    body.innerHTML = `Êtes-vous sûr de vouloir supprimer <strong>${item.nom}</strong> ?<br/>Tous les sous-niveaux associés seront supprimés.`;
    organDeleteModals[level]?.show();
};

const cascadeOrganDelete = (level, itemId) => {
    const items = getOrganItems(level).filter((entry) => entry.id !== itemId);
    setOrganData(level, items);

    if (level === "groupes") {
        famillesOrganes.filter((fam) => fam.groupeId === itemId).forEach((fam) => cascadeOrganDelete("familles", fam.id));
    }
    if (level === "familles") {
        sousFamillesOrganes.filter((sf) => sf.familleId === itemId).forEach((sf) => cascadeOrganDelete("sousfamilles", sf.id));
    }
    if (level === "sousfamilles") {
        organes.filter((org) => org.sousFamilleId === itemId).forEach((org) => cascadeOrganDelete("organes", org.id));
    }
};

const confirmOrganDelete = (level) => {
    if (!pendingOrganDelete || pendingOrganDelete.level !== level) {
        return;
    }

    cascadeOrganDelete(level, pendingOrganDelete.itemId);
    pendingOrganDelete = null;
    renderOrganTables();
    organDeleteModals[level]?.hide();
};

const initArticleModals = () => {
    if (!bootstrapAvailable) {
        return;
    }

    Object.values(articleConfigs).forEach((config) => {
        const formModal = document.getElementById(config.modalId);
        const deleteModal = document.getElementById(config.deleteModalId);
        const detailModal = config.detailModalId ? document.getElementById(config.detailModalId) : null;

        if (formModal) {
            articleFormModals[config.key] = new bootstrap.Modal(formModal);
        }
        if (deleteModal) {
            articleDeleteModals[config.key] = new bootstrap.Modal(deleteModal);
        }
        if (detailModal) {
            articleDetailModals[config.key] = new bootstrap.Modal(detailModal);
        }
    });
};

const getArticleConfig = (level) => articleConfigs[level];
const getArticleItems = (level) => articleDataMap[level]();

const generateArticleCode = (prefix, items) => {
    const index = items.length + 1;
    return `${prefix}${index.toString().padStart(4, "0")}`;
};

const computeArticleStats = (article) => {
    const stockActuel = Number(article.stockActuel) || 0;
    const stockMinimum = Number(article.stockMinimum) || 0;
    const stockCritique = Number(article.stockCritique) || 0;
    const prixUnitaire = Number(article.prixUnitaire) || 0;

    let statutStock = "OK";
    if (stockActuel === 0) {
        statutStock = "Rupture";
    } else if (stockActuel <= stockCritique) {
        statutStock = "Critique";
    } else if (stockActuel <= stockMinimum) {
        statutStock = "Faible";
    }

    return {
        ...article,
        statutStock,
        valeurTotale: stockActuel * prixUnitaire
    };
};

const renderStockStatusBadge = (status) => {
    const map = {
        OK: "stock-badge-ok",
        Faible: "stock-badge-low",
        Critique: "stock-badge-critical",
        Rupture: "stock-badge-rupture"
    };
    const className = map[status] ?? "stock-badge-ok";
    return `<span class="badge stock-status-badge ${className}">${status}</span>`;
};

const renderArticleActions = (level, id) => {
    return `
        <div class="gmao-action-btns d-flex gap-1">
            <button class="btn btn-outline-secondary btn-sm" data-article-action="detail" data-level="${level}" data-id="${id}"><i class="fa-solid fa-eye"></i></button>
            <button class="btn btn-outline-primary btn-sm" data-article-action="edit" data-level="${level}" data-id="${id}"><i class="fa-solid fa-edit"></i></button>
            <button class="btn btn-outline-danger btn-sm" data-article-action="delete" data-level="${level}" data-id="${id}"><i class="fa-solid fa-trash"></i></button>
        </div>`;
};

const renderArticleTable = (level) => {
    const config = getArticleConfig(level);
    const tableBody = document.getElementById(config.tableId);
    if (!tableBody) {
        return;
    }

    const filter = articleFilters[level];
    let items = [...getArticleItems(level)];

    if (level === "articles" && filter.organeId) {
        items = items.filter((article) => article.organeLinks?.some((link) => link.organeId === filter.organeId));
    }

    if (filter?.search) {
        const value = filter.search.toLowerCase();
        items = items.filter((item) => item.code.toLowerCase().includes(value) || item.nom?.toLowerCase().includes(value) || item.designation?.toLowerCase().includes(value));
    }

    const rows = items.map((item) => {
        switch (level) {
            case "groupes": {
                const familyCount = famillesArticles.filter((fam) => fam.groupeId === item.id).length;
                return `
                    <tr>
                        <td>${item.code}</td>
                        <td>${item.nom}</td>
                        <td>${item.designation || "-"}</td>
                        <td>${familyCount}</td>
                        <td>${renderArticleActions(level, item.id)}</td>
                    </tr>`;
            }
            case "familles": {
                const subCount = sousFamillesArticles.filter((sf) => sf.familleId === item.id).length;
                return `
                    <tr>
                        <td>${item.code}</td>
                        <td>${item.nom}</td>
                        <td>${item.groupeNom || ""}</td>
                        <td>${item.designation || "-"}</td>
                        <td>${subCount}</td>
                        <td>${renderArticleActions(level, item.id)}</td>
                    </tr>`;
            }
            case "sousfamilles": {
                const articleCount = articles.filter((article) => article.sousFamilleId === item.id).length;
                return `
                    <tr>
                        <td>${item.code}</td>
                        <td>${item.nom}</td>
                        <td>${item.familleNom || ""}</td>
                        <td>${item.groupeNom || ""}</td>
                        <td>${item.designation || "-"}</td>
                        <td>${articleCount}</td>
                        <td>${renderArticleActions(level, item.id)}</td>
                    </tr>`;
            }
            case "articles": {
                const stats = computeArticleStats(item);
                return `
                    <tr>
                        <td>${stats.code}</td>
                        <td>${stats.designation}</td>
                        <td>${stats.type}</td>
                        <td>${stats.uniteMesure}</td>
                        <td>${stats.stockActuel ?? 0}</td>
                        <td>${stats.stockMinimum ?? 0}</td>
                        <td>${renderStockStatusBadge(stats.statutStock)}</td>
                        <td>${renderArticleActions(level, item.id)}</td>
                    </tr>`;
            }
            default:
                return "";
        }
    }).join("");

    tableBody.innerHTML = rows;

    if (level === "articles") {
        renderArticleFilterBadge();
        renderArticleKpis();
    }
};

const renderArticleTables = () => {
    Object.keys(articleConfigs).forEach((level) => renderArticleTable(level));
};

const renderArticleKpis = () => {
    const totalElement = document.getElementById("kpi-articles-total");
    const ruptureElement = document.getElementById("kpi-articles-rupture");
    const critiqueElement = document.getElementById("kpi-articles-critique");
    const valeurElement = document.getElementById("kpi-articles-valeur");

    if (!totalElement || !ruptureElement || !critiqueElement || !valeurElement) {
        return;
    }

    const stats = articles.map((item) => computeArticleStats(item));
    totalElement.textContent = stats.length.toString();
    ruptureElement.textContent = stats.filter((item) => item.statutStock === "Rupture").length.toString();
    critiqueElement.textContent = stats.filter((item) => item.statutStock === "Critique").length.toString();
    const valeurTotale = stats.reduce((sum, item) => sum + (Number(item.valeurTotale) || 0), 0);
    valeurElement.textContent = valeurTotale.toLocaleString("fr-FR");
};

const populateArticleSelects = (form, level) => {
    const groupSelect = form.querySelector("[data-article-group]");
    const familySelect = form.querySelector("[data-article-family]");
    const subFamilySelect = form.querySelector("[data-article-subfamily]");

    if (groupSelect) {
        groupSelect.innerHTML = `<option value="">Sélectionner</option>${groupesArticles.map((grp) => `<option value="${grp.id}">${grp.nom}</option>`).join("")}`;
    }
    if (familySelect) {
        familySelect.innerHTML = "<option value=\"\">Sélectionner</option>";
    }
    if (subFamilySelect) {
        subFamilySelect.innerHTML = "<option value=\"\">Sélectionner</option>";
    }

    if (level === "familles") {
        const select = form.querySelector("[data-article-parent='familles']");
        if (select) {
            select.innerHTML = `<option value="">Sélectionner</option>${groupesArticles.map((grp) => `<option value="${grp.id}">${grp.nom}</option>`).join("")}`;
        }
    }

    if (level === "sousfamilles") {
        const group = form.querySelector("[data-article-parent='sousfamilles']");
        const family = form.querySelector("[data-article-family='sousfamilles']");
        if (group) {
            group.innerHTML = `<option value="">Sélectionner</option>${groupesArticles.map((grp) => `<option value="${grp.id}">${grp.nom}</option>`).join("")}`;
        }
        if (family) {
            family.innerHTML = "<option value=\"\">Sélectionner</option>";
        }
    }
};

const cascadeArticleFamilies = (groupId, familySelect, subFamilySelect) => {
    const families = famillesArticles.filter((fam) => fam.groupeId === groupId);
    familySelect.innerHTML = `<option value="">Sélectionner</option>${families.map((fam) => `<option value="${fam.id}">${fam.nom}</option>`).join("")}`;
    subFamilySelect.innerHTML = "<option value=\"\">Sélectionner</option>";
};

const cascadeArticleSubFamilies = (familyId, subFamilySelect) => {
    const subs = sousFamillesArticles.filter((sf) => sf.familleId === familyId);
    subFamilySelect.innerHTML = `<option value="">Sélectionner</option>${subs.map((sf) => `<option value="${sf.id}">${sf.nom}</option>`).join("")}`;
};

const renderArticleTypeCards = (form, value) => {
    form.querySelectorAll("[data-article-type-group] .type-card").forEach((card) => {
        card.classList.toggle("active", card.dataset.value === value);
    });
};

const renderStockIndicator = (form) => {
    const indicator = form.querySelector("[data-article-stock-indicator]");
    if (!indicator) {
        return;
    }

    const stockActuel = Number(form.querySelector("[data-field='stockActuel']")?.value) || 0;
    const stockMinimum = Number(form.querySelector("[data-field='stockMinimum']")?.value) || 0;
    const stockCritique = Number(form.querySelector("[data-field='stockCritique']")?.value) || 0;

    let statusLabel = "Stock OK";
    let statusClass = "stock-indicator-ok";
    if (stockActuel === 0) {
        statusLabel = "Rupture de stock";
        statusClass = "stock-indicator-rupture";
    } else if (stockActuel <= stockCritique) {
        statusLabel = "Stock critique";
        statusClass = "stock-indicator-critical";
    } else if (stockActuel <= stockMinimum) {
        statusLabel = "Stock faible";
        statusClass = "stock-indicator-low";
    }

    indicator.innerHTML = `
        <div class="stock-indicator-card ${statusClass}">
            <div class="fw-semibold">${statusLabel}</div>
            <div class="small">Stock actuel: ${stockActuel} | Min: ${stockMinimum}</div>
        </div>`;
};

const updateArticleStockValue = (form) => {
    const prixUnitaire = Number(form.querySelector("[data-field='prixUnitaire']")?.value) || 0;
    const stockActuel = Number(form.querySelector("[data-field='stockActuel']")?.value) || 0;
    const valeurField = form.querySelector("[data-field='valeurTotale']");
    if (valeurField) {
        valeurField.value = (stockActuel * prixUnitaire).toLocaleString("fr-FR");
    }
};

const renderArticleOrganeOptions = (form) => {
    const datalist = form.querySelector("#organe-options");
    if (!datalist) {
        return;
    }

    datalist.innerHTML = organes
        .map((organe) => {
            const equipement = equipements.find((eq) => eq.id === organe.equipementId);
            const equipLabel = equipement ? ` → ${equipement.nom} (${equipement.code})` : "";
            return `<option value="[${organe.code}] ${organe.nom}${equipLabel}"></option>`;
        })
        .join("");
};

const renderArticleOrganeLinks = (form) => {
    const tableBody = form.querySelector("[data-article-organe-table]");
    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = articleOrganeLinks
        .map((link, index) => `
            <tr>
                <td>${link.organeCode}</td>
                <td>${link.organeNom}</td>
                <td>${link.equipementNom}</td>
                <td><input class="form-control form-control-sm" type="number" value="${link.qteUtilisee}" data-article-organe-qty="${index}" /></td>
                <td><button type="button" class="btn btn-sm btn-outline-danger" data-article-organe-remove="${index}"><i class="fa-solid fa-trash"></i></button></td>
            </tr>`)
        .join("");
};

const openArticleForm = (level, mode, itemId) => {
    const config = getArticleConfig(level);
    const form = document.getElementById(config.formId);
    const title = document.getElementById(config.titleId);
    if (!form || !title) {
        return;
    }

    form.reset();
    form.classList.remove("was-validated");
    const items = getArticleItems(level);
    const existing = itemId ? items.find((item) => item.id === itemId) : null;
    const codeInput = form.querySelector("[data-field='code']");
    if (codeInput) {
        codeInput.value = mode === "create" ? generateArticleCode(config.prefix, items) : existing?.code ?? "";
    }

    populateArticleSelects(form, level);

    form.querySelectorAll("[data-field]").forEach((input) => {
        const field = input.dataset.field;
        if (field === "code" || input.type === "file") {
            return;
        }
        input.value = existing?.[field] ?? "";
    });

    if (level === "familles") {
        const parent = form.querySelector("[data-article-parent='familles']");
        if (parent && existing?.groupeId) {
            parent.value = existing.groupeId;
        }
    }

    if (level === "sousfamilles") {
        const group = form.querySelector("[data-article-parent='sousfamilles']");
        const family = form.querySelector("[data-article-family='sousfamilles']");
        if (group && existing?.groupeId) {
            group.value = existing.groupeId;
            if (family) {
                const families = famillesArticles.filter((fam) => fam.groupeId === existing.groupeId);
                family.innerHTML = `<option value="">Sélectionner</option>${families.map((fam) => `<option value="${fam.id}">${fam.nom}</option>`).join("")}`;
            }
        }
        if (family && existing?.familleId) {
            family.value = existing.familleId;
        }
    }

    if (level === "articles") {
        const groupSelect = form.querySelector("[data-article-group]");
        const familySelect = form.querySelector("[data-article-family]");
        const subFamilySelect = form.querySelector("[data-article-subfamily]");
        if (groupSelect && familySelect && subFamilySelect && existing?.groupeId) {
            groupSelect.value = existing.groupeId;
            cascadeArticleFamilies(existing.groupeId, familySelect, subFamilySelect);
        }
        if (familySelect && subFamilySelect && existing?.familleId) {
            familySelect.value = existing.familleId;
            cascadeArticleSubFamilies(existing.familleId, subFamilySelect);
        }
        if (subFamilySelect && existing?.sousFamilleId) {
            subFamilySelect.value = existing.sousFamilleId;
        }
        renderArticleTypeCards(form, existing?.type ?? "Pièce de rechange");
        articleOrganeLinks = (existing?.organeLinks ?? []).map((link) => {
            const organe = organes.find((entry) => entry.id === link.organeId);
            return {
                organeId: link.organeId,
                organeCode: organe?.code ?? "",
                organeNom: link.organeNom,
                equipementNom: link.equipementNom,
                qteUtilisee: link.qteUtilisee ?? 1
            };
        });
        renderArticleOrganeOptions(form);
        renderArticleOrganeLinks(form);
        renderStockIndicator(form);
        updateArticleStockValue(form);
    }

    articleFormContext = { level, mode, itemId };
    title.textContent = mode === "create" ? `Nouveau ${config.label}` : `Modifier ${config.label}`;
    articleFormModals[level]?.show();
};

const readArticleFormValues = (level) => {
    const config = getArticleConfig(level);
    const form = document.getElementById(config.formId);
    if (!form) {
        return null;
    }

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return null;
    }

    const values = {};
    form.querySelectorAll("[data-field]").forEach((input) => {
        const field = input.dataset.field;
        if (input.type === "file") {
            return;
        }
        values[field] = input.value;
    });

    if (level === "articles") {
        const activeType = form.querySelector("[data-article-type-group] .type-card.active");
        values.type = activeType?.dataset.value ?? "Pièce de rechange";
        values.organeLinks = articleOrganeLinks.map((link) => ({
            organeId: link.organeId,
            organeNom: link.organeNom,
            equipementNom: link.equipementNom,
            qteUtilisee: Number(link.qteUtilisee) || 1
        }));

        const photoInput = form.querySelector("[data-field='photo']");
        if (photoInput?.files?.length) {
            values.photo = URL.createObjectURL(photoInput.files[0]);
        }

        const documentsInput = form.querySelector("[data-field='documents']");
        if (documentsInput?.files?.length) {
            values.documents = Array.from(documentsInput.files).map((file) => ({
                nom: file.name,
                type: file.type
            }));
        }
    }

    return values;
};

const saveArticleForm = (level) => {
    const values = readArticleFormValues(level);
    if (!values) {
        return;
    }

    const items = [...getArticleItems(level)];
    const isEdit = articleFormContext?.mode === "edit";

    if (level === "familles") {
        const groupe = groupesArticles.find((grp) => grp.id === values.groupeId);
        values.groupeNom = groupe?.nom ?? "";
    }
    if (level === "sousfamilles") {
        const famille = famillesArticles.find((fam) => fam.id === values.familleId);
        values.familleNom = famille?.nom ?? "";
        values.groupeId = famille?.groupeId ?? values.groupeId;
        values.groupeNom = famille?.groupeNom ?? "";
    }
    if (level === "articles") {
        const groupe = groupesArticles.find((grp) => grp.id === values.groupeId);
        const famille = famillesArticles.find((fam) => fam.id === values.familleId);
        const sousFamille = sousFamillesArticles.find((sf) => sf.id === values.sousFamilleId);
        values.groupeNom = groupe?.nom ?? "";
        values.familleNom = famille?.nom ?? "";
        values.sousFamilleNom = sousFamille?.nom ?? "";
        Object.assign(values, computeArticleStats(values));
    }

    if (isEdit && articleFormContext?.itemId) {
        const index = items.findIndex((item) => item.id === articleFormContext.itemId);
        if (index >= 0) {
            const current = items[index];
            const updated = { ...current, ...values };
            items[index] = {
                ...updated,
                photo: values.photo ?? current.photo,
                documents: values.documents ?? current.documents
            };
        }
    } else {
        items.push({ id: createId(), ...values, createdAt: new Date().toISOString() });
    }

    setArticleData(level, items);
    renderArticleTables();
    checkStockAlerts();
    articleFormModals[level]?.hide();
};

const renderStockGauge = (article) => {
    const stockActuel = Number(article.stockActuel) || 0;
    const stockMinimum = Number(article.stockMinimum) || 0;
    const stockCritique = Number(article.stockCritique) || 0;
    const maxValue = Math.max(stockMinimum, stockCritique, stockActuel, 1);
    const percent = Math.min(100, (stockActuel / maxValue) * 100);
    return `
        <div class="stock-gauge">
            <div class="stock-gauge-bar" style="width: ${percent}%;"></div>
            <div class="stock-gauge-label">${stockActuel} / ${stockMinimum} min</div>
        </div>`;
};

const openArticleDetail = (level, itemId) => {
    const config = getArticleConfig(level);
    const item = getArticleItems(level).find((entry) => entry.id === itemId);
    const body = document.getElementById(config.detailBodyId);
    const modalElement = document.getElementById(config.detailModalId);
    if (!item || !body || !modalElement) {
        return;
    }

    modalElement.dataset.itemId = itemId;

    if (level !== "articles") {
        body.innerHTML = `
            <div class="mb-2"><span class="badge bg-primary">${item.code}</span></div>
            <div class="fw-bold">${item.nom}</div>
            <div class="text-muted">${item.designation || "-"}</div>`;
        articleDetailModals[level]?.show();
        return;
    }

    const article = computeArticleStats(item);
    const documents = (article.documents ?? []).map((doc) => `<li><i class="fa-solid fa-file"></i> ${doc.nom}</li>`).join("") || "<li>Aucun document</li>";
    const organeRows = (article.organeLinks ?? [])
        .map((link) => `
            <tr>
                <td>${link.organeNom}</td>
                <td>${link.equipementNom}</td>
                <td>${link.qteUtilisee}</td>
            </tr>`)
        .join("") || `<tr><td colspan="3" class="text-muted">Aucun organe lié</td></tr>`;

    body.innerHTML = `
        <div class="equip-detail-header">
            <div class="equip-photo">${article.photo ? `<img src="${article.photo}" alt="Photo" />` : "<i class=\"fa-solid fa-camera\"></i>"}</div>
            <div>
                <div class="badge bg-success mb-2">${article.code}</div>
                <div class="fw-bold fs-4">${article.designation}</div>
                <div class="d-flex flex-wrap gap-2 mt-2">
                    <span class="badge bg-secondary">${article.type}</span>
                    <span class="badge bg-secondary">${article.uniteMesure}</span>
                    ${renderStockStatusBadge(article.statutStock)}
                </div>
                <div class="text-muted mt-2">${article.groupeNom} &gt; ${article.familleNom} &gt; ${article.sousFamilleNom}</div>
                <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-outline-primary btn-sm" data-article-action="edit" data-level="articles" data-id="${article.id}"><i class="fa-solid fa-edit"></i> Modifier</button>
                    <button class="btn btn-outline-danger btn-sm" data-article-action="delete" data-level="articles" data-id="${article.id}"><i class="fa-solid fa-trash"></i> Supprimer</button>
                    <button class="btn btn-outline-secondary btn-sm" data-article-action="view-organes" data-id="${article.id}" data-name="${article.designation}"><i class="fa-solid fa-puzzle-piece"></i> Voir les Organes liés</button>
                </div>
            </div>
        </div>
        <div class="row g-3 mt-3">
            <div class="col-md-6"><div class="text-muted small">Réf. interne</div><div class="fw-semibold">${article.referenceInterne || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Réf. fabricant</div><div class="fw-semibold">${article.referenceFabricant || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Marque</div><div class="fw-semibold">${article.marque || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Fournisseur</div><div class="fw-semibold">${article.fournisseur || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Stock actuel</div><div class="fw-semibold">${article.stockActuel || 0}</div></div>
            <div class="col-md-6"><div class="text-muted small">Stock minimum</div><div class="fw-semibold">${article.stockMinimum || 0}</div></div>
            <div class="col-md-6"><div class="text-muted small">Stock critique</div><div class="fw-semibold">${article.stockCritique || 0}</div></div>
            <div class="col-md-6"><div class="text-muted small">Emplacement</div><div class="fw-semibold">${article.emplacementStock || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Qté réapprovisionnement</div><div class="fw-semibold">${article.qteReapprovisionnement || "-"}</div></div>
            <div class="col-md-6"><div class="text-muted small">Valeur totale stock</div><div class="fw-semibold text-success">${(article.valeurTotale || 0).toLocaleString("fr-FR")}</div></div>
        </div>
        ${renderStockGauge(article)}
        <div class="mt-3">
            <div class="fw-semibold mb-2">Organes liés</div>
            <div class="table-responsive">
                <table class="table table-sm">
                    <thead><tr><th>Organe</th><th>Équipement</th><th>Qté utilisée</th></tr></thead>
                    <tbody>${organeRows}</tbody>
                </table>
            </div>
        </div>
        <div class="mt-3">
            <div class="fw-semibold mb-2">Documents</div>
            <ul class="file-list">${documents}</ul>
        </div>`;

    articleDetailModals.articles?.show();
};

const openArticleDelete = (level, itemId) => {
    const config = getArticleConfig(level);
    const body = document.getElementById(config.deleteBodyId);
    if (!body) {
        return;
    }

    const item = getArticleItems(level).find((entry) => entry.id === itemId);
    if (!item) {
        return;
    }

    pendingArticleDelete = { level, itemId };
    body.innerHTML = `Êtes-vous sûr de vouloir supprimer <strong>${item.nom ?? item.designation}</strong> ?<br/>Tous les sous-niveaux associés seront supprimés.`;
    articleDeleteModals[level]?.show();
};

const cascadeArticleDelete = (level, itemId) => {
    const items = getArticleItems(level).filter((entry) => entry.id !== itemId);
    setArticleData(level, items);

    if (level === "groupes") {
        famillesArticles.filter((fam) => fam.groupeId === itemId).forEach((fam) => cascadeArticleDelete("familles", fam.id));
    }
    if (level === "familles") {
        sousFamillesArticles.filter((sf) => sf.familleId === itemId).forEach((sf) => cascadeArticleDelete("sousfamilles", sf.id));
    }
    if (level === "sousfamilles") {
        articles.filter((article) => article.sousFamilleId === itemId).forEach((article) => cascadeArticleDelete("articles", article.id));
    }
};

const confirmArticleDelete = (level) => {
    if (!pendingArticleDelete || pendingArticleDelete.level !== level) {
        return;
    }

    cascadeArticleDelete(level, pendingArticleDelete.itemId);
    pendingArticleDelete = null;
    renderArticleTables();
    checkStockAlerts();
    articleDeleteModals[level]?.hide();
};

const checkStockAlerts = () => {
    const notifications = [];
    articles.map((article) => computeArticleStats(article)).forEach((article) => {
        if (article.statutStock === "Faible") {
            notifications.push(`⚠️ Stock faible: ${article.designation} (${article.stockActuel} restants)`);
        }
        if (article.statutStock === "Critique") {
            notifications.push(`🔴 Stock critique: ${article.designation} (${article.stockActuel} restants)`);
        }
        if (article.statutStock === "Rupture") {
            notifications.push(`🔴 Rupture: ${article.designation} (0 restants)`);
        }
    });

    const badge = document.getElementById("notification-count");
    const list = document.getElementById("notification-list");
    if (badge) {
        badge.textContent = notifications.length.toString();
        badge.style.display = notifications.length ? "inline-block" : "none";
    }
    if (list) {
        if (notifications.length === 0) {
            list.innerHTML = "<li><span class=\"dropdown-item-text text-muted\">Aucune alerte</span></li>";
        } else {
            list.innerHTML = notifications.map((text) => `<li><span class="dropdown-item-text">${text}</span></li>`).join("");
        }
    }
};

const renderField = (field, value, entityKey) => {
    const requiredClass = field.required ? "gmao-required" : "";
    const inputId = `${entityKey}-${field.name}`;
    const requiredAttr = field.required ? "required" : "";
    const valueAttr = value ?? "";

    if (field.type === "textarea") {
        return `
            <div class="mb-3 gmao-form-group">
                <label for="${inputId}" class="form-label ${requiredClass}">${field.label}</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fa-solid ${field.icon}"></i></span>
                    <textarea class="form-control" id="${inputId}" data-field="${field.name}" ${requiredAttr}>${valueAttr}</textarea>
                </div>
                <div class="invalid-feedback">Ce champ est requis.</div>
            </div>`;
    }

    if (field.type === "select") {
        const options = field.options ?? [];
        return `
            <div class="mb-3 gmao-form-group">
                <label for="${inputId}" class="form-label ${requiredClass}">${field.label}</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fa-solid ${field.icon}"></i></span>
                    <select class="form-select" id="${inputId}" data-field="${field.name}" ${requiredAttr}>
                        <option value="">S\u00e9lectionner</option>
                        ${options.map((option) => `<option value="${option}">${option}</option>`).join("")}
                    </select>
                </div>
                <div class="invalid-feedback">Ce champ est requis.</div>
            </div>`;
    }

    if (field.type === "parent") {
        const options = getParentOptions(entityKey);
        return `
            <div class="mb-3 gmao-form-group">
                <label for="${inputId}" class="form-label ${requiredClass}">${field.label}</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fa-solid ${field.icon}"></i></span>
                    <select class="form-select" id="${inputId}" data-field="${field.name}" ${requiredAttr}>
                        <option value="">S\u00e9lectionner</option>
                        ${options.map((option) => `<option value="${option.id}">${option.label}</option>`).join("")}
                    </select>
                </div>
                <div class="invalid-feedback">Ce champ est requis.</div>
            </div>`;
    }

    if (field.type === "radio") {
        return `
            <div class="mb-3 gmao-form-group">
                <label class="form-label ${requiredClass}">${field.label}</label>
                <div class="d-flex gap-2 flex-wrap" data-field="${field.name}">
                    ${field.options
                        .map(
                            (option, index) => `
                                <div>
                                    <input class="btn-check" type="radio" name="${field.name}" id="${inputId}-${index}" value="${option.value}" data-field="${field.name}" ${requiredAttr}>
                                    <label class="btn btn-outline-light border ${option.className}" for="${inputId}-${index}">${option.label}</label>
                                </div>`
                        )
                        .join("")}
                </div>
                <div class="invalid-feedback">Ce champ est requis.</div>
            </div>`;
    }

    if (field.type === "toggle") {
        return `
            <div class="mb-3 gmao-form-group">
                <label class="form-label ${requiredClass}">${field.label}</label>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="${inputId}" data-field="${field.name}" ${value ? "checked" : ""}>
                    <label class="form-check-label" for="${inputId}">Oui / Non</label>
                </div>
            </div>`;
    }

    if (field.type === "file") {
        return `
            <div class="mb-3 gmao-form-group">
                <label for="${inputId}" class="form-label">${field.label}</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fa-solid ${field.icon}"></i></span>
                    <input class="form-control" type="file" id="${inputId}" data-field="${field.name}" ${field.multiple ? "multiple" : ""} ${field.accept ? `accept=\"${field.accept}\"` : ""}>
                </div>
                <div class="gmao-file-preview" data-preview="${field.name}"></div>
            </div>`;
    }

    if (field.type === "geo-wilaya" || field.type === "geo-daira" || field.type === "geo-commune") {
        const geoType = field.type.replace("geo-", "");
        return `
            <div class="mb-3 gmao-form-group">
                <label for="${inputId}" class="form-label ${requiredClass}">${field.label}</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fa-solid ${field.icon}"></i></span>
                    <select class="form-select" id="${inputId}" data-field="${field.name}" data-geo="${geoType}" ${requiredAttr}>
                        <option value="">S\u00e9lectionner</option>
                    </select>
                </div>
                <div class="invalid-feedback">Ce champ est requis.</div>
            </div>`;
    }

    const duplicateHint = field.unique ? `<div class="text-warning small d-none" data-duplicate="${field.name}">Ce code existe d\u00e9j\u00e0.</div>` : "";
    return `
        <div class="mb-3 gmao-form-group">
            <label for="${inputId}" class="form-label ${requiredClass}">${field.label}</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fa-solid ${field.icon}"></i></span>
                <input class="form-control" type="${field.type}" id="${inputId}" data-field="${field.name}" value="${valueAttr}" ${requiredAttr} ${field.min !== undefined ? `min=\"${field.min}\"` : ""}>
            </div>
            <div class="invalid-feedback">Ce champ est requis.</div>
            ${duplicateHint}
        </div>`;
};

const renderForm = (entityKey, item) => {
    const config = getEntityConfig(entityKey);
    if (!config) {
        return "";
    }

    if (config.tabs) {
        const tabs = config.tabs
            .map(
                (tab, index) =>
                    `<li class="nav-item" role="presentation">
                        <button class="nav-link ${index === 0 ? "active" : ""}" data-bs-toggle="tab" data-bs-target="#tab-${entityKey}-${tab.id}" type="button" role="tab">${tab.label}</button>
                    </li>`
            )
            .join("");

        const content = config.tabs
            .map(
                (tab, index) => `
                    <div class="tab-pane fade ${index === 0 ? "show active" : ""}" id="tab-${entityKey}-${tab.id}" role="tabpanel">
                        <div class="gmao-tab-content">
                            ${tab.fields.map((field) => renderField(field, item?.[field.name], entityKey)).join("")}
                        </div>
                    </div>`
            )
            .join("");

        return `
            <form id="crud-form" class="needs-validation" novalidate>
                <ul class="nav nav-tabs" role="tablist">${tabs}</ul>
                <div class="tab-content">${content}</div>
            </form>`;
    }

    return `
        <form id="crud-form" class="needs-validation" novalidate>
            ${config.fields.map((field) => renderField(field, item?.[field.name], entityKey)).join("")}
        </form>`;
};

const attachFormHandlers = (entityKey, item) => {
    const form = document.getElementById("crud-form");
    if (!form) {
        return;
    }

    const updateDuplicateHint = (fieldName, value) => {
        const hint = form.querySelector(`[data-duplicate='${fieldName}']`);
        if (!hint) {
            return;
        }

        const config = getEntityConfig(entityKey);
        const field = findFieldConfig(entityKey, fieldName);
        if (!field?.unique || !config?.codeField) {
            hint.classList.add("d-none");
            return;
        }

        const isDuplicate = getEntityItems(entityKey).some((entry) =>
            entry[config.codeField]?.toString().toUpperCase() === value?.toString().toUpperCase() && entry.id !== item?.id);
        hint.classList.toggle("d-none", !isDuplicate);
    };

    form.querySelectorAll("input[data-field][data-uppercase]").forEach((input) => {
        input.addEventListener("input", () => applyUppercase(input));
    });

    form.querySelectorAll("input[data-field]").forEach((input) => {
        const fieldConfig = findFieldConfig(entityKey, input.dataset.field);
        if (fieldConfig?.uppercase) {
            input.dataset.uppercase = "true";
            input.addEventListener("input", () => applyUppercase(input));
        }

        if (fieldConfig?.unique) {
            input.addEventListener("input", () => updateDuplicateHint(fieldConfig.name, input.value));
        }
    });

    form.querySelectorAll("select[data-field]").forEach((select) => {
        const fieldConfig = findFieldConfig(entityKey, select.dataset.field);
        if (fieldConfig?.uppercase) {
            select.dataset.uppercase = "true";
            select.addEventListener("change", () => applyUppercase(select));
        }

        if (fieldConfig?.unique) {
            select.addEventListener("change", () => updateDuplicateHint(fieldConfig.name, select.value));
        }
    });

    populateGeoSelects(form, item ?? {});

    form.querySelectorAll("input[type='file']").forEach((input) => {
        input.addEventListener("change", (event) => {
            const previewContainer = form.querySelector(`[data-preview='${input.dataset.field}']`);
            if (!previewContainer) {
                return;
            }

            previewContainer.innerHTML = "";
            const files = Array.from(event.target.files ?? []);
            files.forEach((file) => {
                if (file.type.startsWith("image/")) {
                    const img = document.createElement("img");
                    img.src = URL.createObjectURL(file);
                    previewContainer.appendChild(img);
                } else {
                    const itemDiv = document.createElement("div");
                    itemDiv.className = "gmao-file-item";
                    itemDiv.innerHTML = `<i class="fa-solid fa-file"></i><span>${file.name}</span>`;
                    previewContainer.appendChild(itemDiv);
                }
            });
        });
    });
};

const configHasGeo = (entityKey) => {
    const config = getEntityConfig(entityKey);
    return (config?.fields ?? []).some((field) => field.type?.startsWith("geo-")) ||
        (config?.tabs ?? []).some((tab) => tab.fields.some((field) => field.type?.startsWith("geo-")));
};

const findFieldConfig = (entityKey, fieldName) => {
    const config = getEntityConfig(entityKey);
    const fields = config?.fields ?? config?.tabs?.flatMap((tab) => tab.fields) ?? [];
    return fields.find((field) => field.name === fieldName);
};

const openFormModal = (entityKey, mode, item, preselectedParentId) => {
    const config = getEntityConfig(entityKey);
    if (!config || !crudFormModal || !crudFormTitle || !crudFormBody || !crudFormSubmit) {
        return;
    }

    crudFormError.textContent = "";
    const titleAction = mode === "edit" ? "Modifier" : "Cr\u00e9er";
    crudFormTitle.textContent = `${titleAction} ${config.name}`;
    crudFormBody.innerHTML = renderForm(entityKey, item);
    activeFormContext = { entityKey, mode, itemId: item?.id ?? null };

    const form = document.getElementById("crud-form");
    if (form) {
        if (preselectedParentId) {
            const parentField = config.parentKey;
            const parentSelect = form.querySelector(`[data-field='${parentField}']`);
            if (parentSelect) {
                parentSelect.value = preselectedParentId;
            }
        }

        attachFormHandlers(entityKey, item);
        if (item) {
            form.querySelectorAll("input, select, textarea").forEach((input) => {
                const fieldName = input.dataset.field || input.name;
                if (input.type === "radio" && item[fieldName]) {
                    input.checked = input.value === item[fieldName];
                } else if (input.dataset.field && item[input.dataset.field] !== undefined) {
                    if (input.type === "checkbox") {
                        input.checked = Boolean(item[input.dataset.field]);
                    } else {
                        input.value = item[input.dataset.field];
                    }
                }
            });
        }
    }

    crudFormModal.show();
};

const readFormValues = (entityKey) => {
    const form = document.getElementById("crud-form");
    if (!form) {
        return null;
    }

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return null;
    }

    const values = {};
    form.querySelectorAll("[data-field]").forEach((input) => {
        const field = input.dataset.field;
        if (!field) {
            return;
        }

        if (input.type === "checkbox") {
            values[field] = input.checked;
        } else if (input.type === "file") {
            if (field === "photos") {
                values[field] = Array.from(input.files ?? []).map((file) => ({ name: file.name }));
            } else {
                values[field] = Array.from(input.files ?? []).map((file) => ({ name: file.name }));
            }
        } else if (input.type === "radio") {
            if (input.checked) {
                values[field] = input.value;
            }
        } else {
            values[field] = input.value;
        }
    });

    const config = getEntityConfig(entityKey);
    const codeField = config?.codeField;
    if (codeField && values[codeField]) {
        values[codeField] = values[codeField].toUpperCase();
    }

    return values;
};

const hasDuplicateCode = (entityKey, values, itemId) => {
    const config = getEntityConfig(entityKey);
    if (!config?.codeField) {
        return false;
    }

    const currentItems = getEntityItems(entityKey);
    return currentItems.some((item) => item[config.codeField]?.toString().toUpperCase() === values[config.codeField]?.toString().toUpperCase() && item.id !== itemId);
};

const saveForm = () => {
    if (!activeFormContext) {
        return;
    }

    const { entityKey, mode, itemId } = activeFormContext;
    const values = readFormValues(entityKey);
    if (!values) {
        return;
    }

    if (hasDuplicateCode(entityKey, values, itemId)) {
        crudFormError.textContent = "Ce code existe d\u00e9j\u00e0. Merci de choisir un code unique.";
        return;
    }

    if (entityKey === "company") {
        Object.assign(company, values);
    } else {
        const items = [...getEntityItems(entityKey)];
        if (mode === "edit" && itemId) {
            const index = items.findIndex((item) => item.id === itemId);
            if (index >= 0) {
                const current = items[index];
                const merged = { ...current, ...values };
                if (entityKey === "equipment") {
                    merged.photos = values.photos?.length ? values.photos : current.photos;
                    merged.documents = values.documents?.length ? values.documents : current.documents;
                }
                items[index] = merged;
            }
        } else {
            items.push({ id: createId(), ...values });
        }

        setEntityData(entityKey, items);
    }
    renderAllTables();
    renderDiTable();
    renderOtTable();
    renderBtTable();
    populateBtTechnicienFilter();
    crudFormModal?.hide();
};

const openDetailModal = (entityKey, itemId) => {
    const config = getEntityConfig(entityKey);
    const item = getEntityItems(entityKey).find((entry) => entry.id === itemId);
    if (!config || !item || !crudDetailModal || !crudDetailTitle || !crudDetailBody) {
        return;
    }

    crudDetailTitle.textContent = `${config.name} - ${item.name ?? item.tag ?? item.code ?? item.internalRef}`;

    if (entityKey === "equipment") {
        crudDetailBody.innerHTML = renderEquipmentDetail(item);
    } else {
        const fields = config.fields ?? [];
        const listItems = fields
            .filter((field) => field.type !== "file")
            .map((field) => {
                const value = field.type === "parent" ? getParentLabel(entityKey, item[field.name]) : item[field.name];
                return `<dt class="col-sm-4">${field.label}</dt><dd class="col-sm-8">${value ?? ""}</dd>`;
            })
            .join("");
        crudDetailBody.innerHTML = `<dl class="row">${listItems}</dl>`;
    }

    crudDetailModal.show();
};

const renderEquipmentDetail = (item) => {
    const tabs = entityConfigs.equipment.tabs
        .map(
            (tab, index) => `
                <li class="nav-item" role="presentation">
                    <button class="nav-link ${index === 0 ? "active" : ""}" data-bs-toggle="tab" data-bs-target="#detail-${tab.id}" type="button">${tab.label}</button>
                </li>`
        )
        .join("");

    const content = entityConfigs.equipment.tabs
        .map(
            (tab, index) => `
                <div class="tab-pane fade ${index === 0 ? "show active" : ""}" id="detail-${tab.id}">
                    <div class="gmao-tab-content">
                        <dl class="row">
                            ${tab.fields
                                .filter((field) => field.type !== "file")
                                .map((field) => {
                                    const value = field.type === "parent" ? getParentLabel("equipment", item[field.name]) : item[field.name];
                                    return `<dt class="col-sm-4">${field.label}</dt><dd class="col-sm-8">${value ?? ""}</dd>`;
                                })
                                .join("")}
                        </dl>
                        ${tab.id === "documents" ? renderEquipmentFiles(item) : ""}
                    </div>
                </div>`
        )
        .join("");

    const subassemblyList = subassemblies
        .filter((sub) => sub.equipmentId === item.id)
        .map((sub) => `<li>${sub.code} - ${sub.name}</li>`)
        .join(", ");

    return `
        <ul class="nav nav-tabs" role="tablist">${tabs}</ul>
        <div class="tab-content">${content}</div>
        <div class="mt-3">
            <h6>Sous-ensembles associ\u00e9s</h6>
            <ul>${subassemblyList || "Aucun sous-ensemble associ\u00e9."}</ul>
            <div class="d-flex gap-2">
                <span class="badge bg-primary">Total OT: 24</span>
                <span class="badge bg-success">Derni\u00e8re intervention: 01/04/2026</span>
                <span class="badge bg-warning text-dark">Prochaine MP: 15/05/2026</span>
            </div>
            <button class="btn btn-primary btn-sm mt-2"><i class="fa-solid fa-plus"></i> Cr\u00e9er un OT</button>
        </div>`;
};

const renderEquipmentFiles = (item) => {
    const photos = (item.photos ?? []).map((file) => `<div class="gmao-file-item"><i class="fa-solid fa-camera"></i>${file.name}</div>`).join("");
    const documents = (item.documents ?? []).map((file) => `<div class="gmao-file-item"><i class="fa-solid fa-file"></i>${file.name}</div>`).join("");
    return `
        <div class="mt-2">
            <h6>Photos</h6>
            <div class="gmao-file-preview">${photos || "Aucune photo"}</div>
            <h6 class="mt-3">Documents</h6>
            <div class="gmao-file-preview">${documents || "Aucun document"}</div>
        </div>`;
};

const openDeleteModal = (entityKey, itemId) => {
    const config = getEntityConfig(entityKey);
    const item = getEntityItems(entityKey).find((entry) => entry.id === itemId);
    if (!config || !item || !crudDeleteModal || !crudDeleteBody) {
        return;
    }

    pendingDelete = { entityKey, itemId };
    const label = item.name ?? item.tag ?? item.code ?? item.internalRef;
    crudDeleteBody.innerHTML = `\u00cates-vous s\u00fbr de vouloir supprimer <strong>${label}</strong> ? Cette action supprimera \u00e9galement tous les sous-niveaux associ\u00e9s.`;
    crudDeleteModal.show();
};

const cascadeDelete = (entityKey, itemId) => {
    const config = getEntityConfig(entityKey);
    const items = getEntityItems(entityKey).filter((item) => item.id !== itemId);
    setEntityData(entityKey, items);

    const childConfig = Object.values(entityConfigs).find((entry) => entry.parentEntity === entityKey);
    if (childConfig) {
        const childItems = getEntityItems(childConfig.key)
            .filter((item) => item[childConfig.parentKey] !== itemId);
        const removedChildren = getEntityItems(childConfig.key)
            .filter((item) => item[childConfig.parentKey] === itemId)
            .map((item) => item.id);

        setEntityData(childConfig.key, childItems);
        removedChildren.forEach((childId) => cascadeDelete(childConfig.key, childId));
    }
};

const confirmDelete = () => {
    if (!pendingDelete) {
        return;
    }

    cascadeDelete(pendingDelete.entityKey, pendingDelete.itemId);
    pendingDelete = null;
    renderAllTables();
    crudDeleteModal?.hide();
};

const applyDate = () => {
    const dateElement = document.getElementById("current-date");
    if (!dateElement) {
        return;
    }

    const formatter = new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const formattedDate = formatter.format(new Date());
    dateElement.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

const updateSidebarState = () => {
    const width = window.innerWidth;

    document.body.classList.remove("sidebar-mobile-open", "sidebar-overlay-open");

    if (width >= 992) {
        document.body.classList.remove("sidebar-collapsed");
        return;
    }

    if (width >= 768) {
        document.body.classList.add("sidebar-collapsed");
        return;
    }

    document.body.classList.remove("sidebar-collapsed");
};

const closeOverlays = () => {
    document.body.classList.remove("sidebar-mobile-open", "sidebar-overlay-open");
};

const toggleSidebar = () => {
    const width = window.innerWidth;

    if (width < 768) {
        document.body.classList.toggle("sidebar-mobile-open");
        return;
    }

    if (width < 992) {
        document.body.classList.toggle("sidebar-overlay-open");
        return;
    }

    document.body.classList.toggle("sidebar-collapsed");
};

const animateCounters = () => {
    if (countersStarted) {
        return;
    }

    countersStarted = true;
    const duration = 1500;

    kpiValues.forEach((valueElement) => {
        const target = Number.parseInt(valueElement.dataset.target ?? "0", 10);
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easeOut * target);
            valueElement.textContent = currentValue.toString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                valueElement.textContent = target.toString();
            }
        };

        requestAnimationFrame(updateCounter);
    });
};

const buildTreeDetails = (node, context) => {
    switch (node.type) {
        case "entreprise":
            return { Type: "Organisationnel" };
        case "unite":
        case "division":
        case "departement":
        case "service":
            return node.code ? { Code: node.code } : {};
        case "equipement":
            return {
                Code: node.code,
                "Rattach\u00e9 \u00e0": context.serviceName ?? "",
                "Criticit\u00e9": node.criticite,
                Localisation: node.localisation
            };
        case "organe":
            return {
                Code: node.code,
                "Appartient \u00e0": context.equipmentName ?? ""
            };
        case "article":
            return {
                "R\u00e9f\u00e9rence": node.ref,
                "Stock actuel": node.stockActuel,
                "Stock minimum": node.stockMinimum,
                "Utilis\u00e9 sur": context.organeName && context.equipmentName
                    ? `${context.organeName} (${context.equipmentName})`
                    : ""
            };
        default:
            return {};
    }
};

const buildTreeBadge = (node) => {
    if (node.type === "equipement") {
        const badgeClass = node.criticite === "A"
            ? "tree-badge tree-badge-critical"
            : node.criticite === "B"
                ? "tree-badge tree-badge-important"
                : "tree-badge tree-badge-standard";
        return `<span class="${badgeClass}"><i class="fa-solid fa-circle"></i> ${node.criticite}</span>`;
    }

    if (node.type === "article") {
        const stockClass = node.stockActuel <= 0
            ? "tree-badge tree-badge-stock-out"
            : node.stockActuel <= node.stockMinimum
                ? "tree-badge tree-badge-stock-low"
                : "tree-badge tree-badge-stock-ok";
        const label = node.stockActuel <= 0 ? "Rupture" : node.stockActuel <= node.stockMinimum ? "Faible" : "OK";
        return `<span class="${stockClass}"><i class="fa-solid fa-circle"></i> ${label}</span>`;
    }

    return "";
};

const renderTreeNodes = (nodes, context) => {
    return nodes
        .map((node) => {
            const meta = treeTypeMap[node.type];
            const nodeContext = { ...context };
            if (node.type === "service") {
                nodeContext.serviceName = node.name;
            }
            if (node.type === "equipement") {
                nodeContext.equipmentName = node.name;
            }
            if (node.type === "organe") {
                nodeContext.organeName = node.name;
            }

            const details = buildTreeDetails(node, nodeContext);
            const badge = buildTreeBadge(node);
            const children = node.children?.length
                ? `<ul class="tree-children">${renderTreeNodes(node.children, nodeContext)}</ul>`
                : "";
            const hasChildren = Boolean(node.children?.length);
            const toggleIcon = hasChildren ? "fa-chevron-down" : "fa-chevron-right";
            const expandedClass = hasChildren ? "expanded" : "";

            return `
                <li class="tree-node ${expandedClass}" data-level="${meta.level}" data-name="${node.name}" data-details='${JSON.stringify(details)}'>
                    <div class="tree-item">
                        <button class="tree-toggle" aria-label="Basculer"><i class="fa-solid ${toggleIcon}"></i></button>
                        <span class="tree-icon ${meta.iconClass}"><i class="fa-solid ${meta.icon}"></i></span>
                        <span class="tree-label">${node.name}</span>
                        ${badge}
                    </div>
                    ${children}
                </li>`;
        })
        .join("");
};

const renderTree = () => {
    const treeRoot = document.getElementById("gmao-tree");
    if (!treeRoot) {
        return;
    }

    treeRoot.innerHTML = renderTreeNodes(treeData, {});
    bindTreeEvents();
};

const bindTreeEvents = () => {
    treeNodes = Array.from(document.querySelectorAll(".tree-node"));
    treeNodes.forEach((node) => {
        const toggleButton = node.querySelector(".tree-toggle");
        const label = node.querySelector(".tree-label");

        if (toggleButton) {
            toggleButton.addEventListener("click", (event) => {
                event.stopPropagation();
                node.classList.toggle("expanded");
                const icon = toggleButton.querySelector("i");
                if (icon) {
                    icon.classList.toggle("fa-chevron-right");
                    icon.classList.toggle("fa-chevron-down");
                }
            });
        }

        if (label) {
            label.addEventListener("click", () => {
                treeNodes.forEach((item) => item.classList.remove("selected"));
                node.classList.add("selected");
                updateTreeDetails(node);
            });
        }
    });
};

const initCharts = () => {
    if (chartsInitialized || typeof Chart === "undefined") {
        return;
    }

    const lineCanvas = document.getElementById("interventionsChart");
    const doughnutCanvas = document.getElementById("criticityChart");

    if (!lineCanvas || !doughnutCanvas) {
        return;
    }

    chartsInitialized = true;

    new Chart(lineCanvas, {
        type: "line",
        data: {
            labels: ["Jan", "F\u00e9v", "Mar", "Avr", "Mai", "Juin", "Juil", "Ao\u00fb", "Sep", "Oct", "Nov", "D\u00e9c"],
            datasets: [
                {
                    label: "Pr\u00e9ventive",
                    data: [12, 18, 15, 22, 26, 24, 28, 30, 27, 23, 20, 19],
                    borderColor: "#0f6cbf",
                    backgroundColor: "rgba(15, 108, 191, 0.2)",
                    tension: 0.3,
                    fill: true
                },
                {
                    label: "Corrective",
                    data: [8, 10, 9, 14, 12, 13, 16, 18, 15, 14, 12, 10],
                    borderColor: "#fd7e14",
                    backgroundColor: "rgba(253, 126, 20, 0.2)",
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });

    new Chart(doughnutCanvas, {
        type: "doughnut",
        data: {
            labels: ["Critique A", "Important B", "Standard C"],
            datasets: [
                {
                    data: [22, 45, 33],
                    backgroundColor: ["#dc3545", "#fd7e14", "#28a745"],
                    hoverOffset: 4
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
};

const updateTreeDetails = (node) => {
    const titleElement = document.getElementById("tree-detail-title");
    const levelElement = document.getElementById("tree-detail-level");
    const listElement = document.getElementById("tree-detail-list");

    if (!titleElement || !levelElement || !listElement) {
        return;
    }

    const level = node.dataset.level ?? "";
    const name = node.dataset.name ?? "";
    const details = node.dataset.details ? JSON.parse(node.dataset.details) : {};
    selectedTreeNode = node;

    titleElement.textContent = name;
    levelElement.textContent = level;

    listElement.innerHTML = "";

    Object.entries(details).forEach(([key, value]) => {
        const term = document.createElement("dt");
        term.className = "col-sm-5";
        term.textContent = key;

        const description = document.createElement("dd");
        description.className = "col-sm-7";

        if (key === "Criticit\u00e9") {
            const badgeClass = value === "A"
                ? "tree-badge tree-badge-critical"
                : value === "B"
                    ? "tree-badge tree-badge-important"
                    : "tree-badge tree-badge-standard";
            description.innerHTML = `<span class="${badgeClass}"><i class="fa-solid fa-circle"></i> ${value}</span>`;
        } else {
            description.textContent = value;
        }

        listElement.append(term, description);
    });

    if (details["Stock actuel"] !== undefined && details["Stock minimum"] !== undefined) {
        const stockCurrent = Number(details["Stock actuel"]);
        const stockMin = Number(details["Stock minimum"]);
        const stockClass = stockCurrent <= 0
            ? "tree-badge tree-badge-stock-out"
            : stockCurrent <= stockMin
                ? "tree-badge tree-badge-stock-low"
                : "tree-badge tree-badge-stock-ok";
        const stockLabel = stockCurrent <= 0 ? "Rupture" : stockCurrent <= stockMin ? "Stock faible" : "Stock OK";

        const term = document.createElement("dt");
        term.className = "col-sm-5";
        term.textContent = "Statut stock";

        const description = document.createElement("dd");
        description.className = "col-sm-7";
        description.innerHTML = `<span class="${stockClass}"><i class="fa-solid fa-circle"></i> ${stockLabel}</span>`;

        listElement.append(term, description);
    }
};

const navigateTo = (viewId) => {
    const targetView = document.getElementById(viewId);

    if (!targetView) {
        return;
    }

    viewSections.forEach((section) => section.classList.remove("active"));
    targetView.classList.add("active");

    navLinks.forEach((link) => {
        link.classList.toggle("active", link.dataset.view === viewId);
    });

    window.location.hash = viewId;
    const viewTitle = targetView.dataset.title ?? "GMAO";
    document.title = `${viewTitle} - GMAO`;

    if (viewId === "view-dashboard") {
        animateCounters();
        initCharts();
    }

    if (window.innerWidth < 992) {
        closeOverlays();
    }
};

navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const viewId = link.dataset.view;
        if (viewId) {
            navigateTo(viewId);
        }
    });
});

document.querySelectorAll("[data-search]").forEach((input) => {
    input.addEventListener("input", () => {
        const entityKey = input.dataset.search;
        if (!entityKey) {
            return;
        }

        tableState[entityKey].search = input.value;
        renderTable(entityKey);
    });
});

document.querySelectorAll("[data-org-search]").forEach((input) => {
    input.addEventListener("input", () => {
        const level = input.dataset.orgSearch;
        if (!level || !orgFilters[level]) {
            return;
        }

        orgFilters[level].search = input.value;
        renderOrgTable(level);
    });
});

document.querySelectorAll("[data-parent-select]").forEach((select) => {
    select.addEventListener("change", () => {
        const level = select.dataset.parentSelect;
        if (!level) {
            return;
        }

        const form = select.closest("form");
        if (!form) {
            return;
        }

        const parentItem = getOrgParentItem(level, select.value);
        applyParentLocation(form, level, parentItem);
    });
});

document.querySelectorAll("[data-filter]").forEach((select) => {
    select.addEventListener("change", () => {
        const entityKey = select.dataset.filter;
        if (!entityKey) {
            return;
        }

        tableState[entityKey].filter = select.value;
        renderTable(entityKey);
    });
});

document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) {
        return;
    }

    const action = target.dataset.action;
    const entityKey = target.dataset.entity;
    const itemId = target.dataset.id;
    const childEntity = target.dataset.child;

    if (action === "create" && entityKey) {
        openFormModal(entityKey, "create");
    }

    if (action === "edit" && entityKey && itemId) {
        const item = getEntityItems(entityKey).find((entry) => entry.id === itemId);
        openFormModal(entityKey, "edit", item);
    }

    if (action === "detail" && entityKey && itemId) {
        openDetailModal(entityKey, itemId);
    }

    if (action === "delete" && entityKey && itemId) {
        openDeleteModal(entityKey, itemId);
    }

    if (action === "add-child" && childEntity) {
        tableState[childEntity].filter = itemId;
        navigateTo(getEntityConfig(childEntity).viewId);
        const filterSelect = document.querySelector(`[data-filter="${childEntity}"]`);
        if (filterSelect) {
            filterSelect.value = itemId;
        }
        renderTable(childEntity);
    }
});

document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-org-action]");
    if (!target) {
        return;
    }

    const action = target.dataset.orgAction;
    const level = target.dataset.level;
    if (!action || !level) {
        return;
    }

    if (action === "create") {
        const parentId = orgFilters[level]?.parentId || "";
        openOrgForm(level, "create", null, parentId || null);
    }

    if (action === "edit") {
        const itemId = target.dataset.id;
        if (itemId) {
            openOrgForm(level, "edit", itemId);
        }
    }

    if (action === "detail") {
        const itemId = target.dataset.id;
        if (itemId) {
            openOrgDetail(level, itemId);
        }
    }

    if (action === "delete") {
        const itemId = target.dataset.id;
        if (itemId) {
            openOrgDelete(level, itemId);
        }
    }

    if (action === "save") {
        saveOrgForm(level);
    }

    if (action === "confirm-delete") {
        confirmOrgDelete(level);
    }

    if (action === "detail-edit" || action === "detail-delete") {
        const config = getOrgConfig(level);
        const modalElement = document.getElementById(config.detailModalId);
        const itemId = modalElement?.dataset.itemId;
        if (itemId && action === "detail-edit") {
            orgDetailModals[level]?.hide();
            openOrgForm(level, "edit", itemId);
        }
        if (itemId && action === "detail-delete") {
            orgDetailModals[level]?.hide();
            openOrgDelete(level, itemId);
        }
    }

    if (action === "view-children") {
        const parentId = target.dataset.parentId;
        const parentName = target.dataset.parentName ?? "";
        if (parentId) {
            orgFilters[level].parentId = parentId;
            orgFilters[level].parentName = parentName;
            renderOrgTable(level);
            navigateTo(getOrgConfig(level).viewId);
        }
    }

    if (action === "clear-filter") {
        orgFilters[level].parentId = "";
        orgFilters[level].parentName = "";
        renderOrgTable(level);
    }
});

document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-equip-action]");
    if (!target) {
        return;
    }

    const action = target.dataset.equipAction;
    const level = target.dataset.level;
    if (!action || !level) {
        return;
    }

    if (action === "create") {
        openEquipForm(level, "create");
    }

    if (action === "edit") {
        const itemId = target.dataset.id;
        if (itemId) {
            if (level === "equipements") {
                equipDetailModals.equipements?.hide();
            }
            openEquipForm(level, "edit", itemId);
        }
    }

    if (action === "detail") {
        const itemId = target.dataset.id;
        if (itemId) {
            openEquipDetail(itemId);
        }
    }

    if (action === "delete") {
        const itemId = target.dataset.id;
        if (itemId) {
            openEquipDelete(level, itemId);
        }
    }

    if (action === "save") {
        saveEquipForm(level);
    }

    if (action === "confirm-delete") {
        confirmEquipDelete(level);
    }
});

document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-organ-action]");
    if (!target) {
        return;
    }

    const action = target.dataset.organAction;
    const level = target.dataset.level;
    if (!action) {
        return;
    }

    if (action === "create" && level) {
        openOrganForm(level, "create");
    }

    if (action === "edit" && level) {
        const itemId = target.dataset.id;
        if (itemId) {
            if (level === "organes") {
                organDetailModals.organes?.hide();
            }
            openOrganForm(level, "edit", itemId);
        }
    }

    if (action === "detail" && level) {
        const itemId = target.dataset.id;
        if (itemId) {
            openOrganDetail(level, itemId);
        }
    }

    if (action === "delete" && level) {
        const itemId = target.dataset.id;
        if (itemId) {
            openOrganDelete(level, itemId);
        }
    }

    if (action === "save" && level) {
        saveOrganForm(level);
    }

    if (action === "confirm-delete" && level) {
        confirmOrganDelete(level);
    }

    if (action === "clear-filter" && level === "organes") {
        organFilters.organes.equipementId = "";
        organFilters.organes.equipementNom = "";
        organFilters.organes.articleId = "";
        organFilters.organes.articleNom = "";
        renderOrganTable("organes");
    }

    if (action === "view-articles") {
        articleFilters.articles.organeId = target.dataset.id ?? "";
        articleFilters.articles.organeNom = target.dataset.name ?? "";
        renderArticleFilterBadge();
        navigateTo("view-articles");
    }
});

document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-article-action]");
    if (!target) {
        return;
    }

    const action = target.dataset.articleAction;
    const level = target.dataset.level;
    if (!action) {
        return;
    }

    if (action === "create" && level) {
        openArticleForm(level, "create");
    }

    if (action === "edit" && level) {
        const itemId = target.dataset.id;
        if (itemId) {
            if (level === "articles") {
                articleDetailModals.articles?.hide();
            }
            openArticleForm(level, "edit", itemId);
        }
    }

    if (action === "detail" && level) {
        const itemId = target.dataset.id;
        if (itemId) {
            openArticleDetail(level, itemId);
        }
    }

    if (action === "delete" && level) {
        const itemId = target.dataset.id;
        if (itemId) {
            openArticleDelete(level, itemId);
        }
    }

    if (action === "save" && level) {
        saveArticleForm(level);
    }

    if (action === "confirm-delete" && level) {
        confirmArticleDelete(level);
    }

    if (action === "view-organes") {
        const articleId = target.dataset.id;
        const articleName = target.dataset.name;
        if (articleId) {
            organFilters.organes.articleId = articleId;
            organFilters.organes.articleNom = articleName ?? "";
            organFilters.organes.equipementId = "";
            organFilters.organes.equipementNom = "";
            renderOrganTable("organes");
            navigateTo("view-organes");
        }
    }
});

document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-equipement-detail]");
    if (!target) {
        return;
    }

    const itemId = target.dataset.equipementDetail;
    if (itemId) {
        openEquipDetail(itemId);
    }
});

document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-organe-filter]");
    if (!target) {
        return;
    }

    const equipementId = target.dataset.organeFilter;
    const equipement = equipements.find((eq) => eq.id === equipementId);
    if (equipementId) {
        organFilters.organes.equipementId = equipementId;
        organFilters.organes.equipementNom = equipement?.nom ?? "";
        renderOrganTable("organes");
        navigateTo("view-organes");
    }
});

document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-article-filter-clear]");
    if (!target) {
        return;
    }

    articleFilters.articles.organeId = "";
    articleFilters.articles.organeNom = "";
    renderArticleTable("articles");
});

document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-organe-filter]");
    if (!target) {
        return;
    }

    navigateTo("view-organes");
});

document.querySelectorAll("[data-equip-search]").forEach((input) => {
    input.addEventListener("input", () => {
        const level = input.dataset.equipSearch;
        if (!equipFilters[level]) {
            return;
        }

        equipFilters[level].search = input.value;
        renderEquipTable(level);
    });
});

document.querySelectorAll("[data-organ-search]").forEach((input) => {
    input.addEventListener("input", () => {
        const level = input.dataset.organSearch;
        if (!organFilters[level]) {
            return;
        }

        organFilters[level].search = input.value;
        renderOrganTable(level);
    });
});

document.querySelectorAll("[data-article-search]").forEach((input) => {
    input.addEventListener("input", () => {
        const level = input.dataset.articleSearch;
        if (!articleFilters[level]) {
            return;
        }

        articleFilters[level].search = input.value;
        renderArticleTable(level);
    });
});

document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.matches("[data-equip-group='equipements']")) {
        const form = target.closest("form");
        const familySelect = form?.querySelector("[data-equip-family='equipements']");
        const subFamilySelect = form?.querySelector("[data-equip-subfamily='equipements']");
        if (familySelect && subFamilySelect) {
            cascadeEquipFamilies(target.value, familySelect, subFamilySelect);
        }
    }

    if (target.matches("[data-equip-family='equipements']")) {
        const form = target.closest("form");
        const subFamilySelect = form?.querySelector("[data-equip-subfamily='equipements']");
        if (subFamilySelect) {
            cascadeEquipSubFamilies(target.value, subFamilySelect);
        }
    }

    if (target.matches("[data-equip-parent='sousfamilles']")) {
        const form = target.closest("form");
        const familySelect = form?.querySelector("[data-equip-family='sousfamilles']");
        if (familySelect) {
            const families = famillesEquipements.filter((fam) => fam.groupeId === target.value);
            familySelect.innerHTML = `<option value="">Sélectionner</option>${buildEquipOptions(families)}`;
        }
    }

    if (target.matches("[data-equip-service='equipements']")) {
        const form = target.closest("form");
        if (form) {
            setServiceLocation(form, target.value);
        }
    }
});

document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.matches("[data-organe-group='organes']")) {
        const form = target.closest("form");
        const familySelect = form?.querySelector("[data-organe-family='organes']");
        const subFamilySelect = form?.querySelector("[data-organe-subfamily='organes']");
        if (familySelect && subFamilySelect) {
            cascadeOrganFamilies(target.value, familySelect, subFamilySelect);
        }
    }

    if (target.matches("[data-organe-family='organes']")) {
        const form = target.closest("form");
        const subFamilySelect = form?.querySelector("[data-organe-subfamily='organes']");
        if (subFamilySelect) {
            cascadeOrganSubFamilies(target.value, subFamilySelect);
        }
    }

    if (target.matches("[data-organ-parent='sousfamilles']")) {
        const form = target.closest("form");
        const familySelect = form?.querySelector("[data-organ-family='sousfamilles']");
        if (familySelect) {
            const families = famillesOrganes.filter((fam) => fam.groupeId === target.value);
            familySelect.innerHTML = `<option value="">Sélectionner</option>${families.map((fam) => `<option value="${fam.id}">${fam.nom}</option>`).join("")}`;
        }
    }

    if (target.matches("[data-organe-equipement='organes']")) {
        const form = target.closest("form");
        if (form) {
            renderEquipementInfoCard(form, target.value);
        }
    }
});

document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.matches("[data-article-group='articles']")) {
        const form = target.closest("form");
        const familySelect = form?.querySelector("[data-article-family='articles']");
        const subFamilySelect = form?.querySelector("[data-article-subfamily='articles']");
        if (familySelect && subFamilySelect) {
            cascadeArticleFamilies(target.value, familySelect, subFamilySelect);
        }
    }

    if (target.matches("[data-article-family='articles']")) {
        const form = target.closest("form");
        const subFamilySelect = form?.querySelector("[data-article-subfamily='articles']");
        if (subFamilySelect) {
            cascadeArticleSubFamilies(target.value, subFamilySelect);
        }
    }

    if (target.matches("[data-article-parent='sousfamilles']")) {
        const form = target.closest("form");
        const familySelect = form?.querySelector("[data-article-family='sousfamilles']");
        if (familySelect) {
            const families = famillesArticles.filter((fam) => fam.groupeId === target.value);
            familySelect.innerHTML = `<option value="">Sélectionner</option>${families.map((fam) => `<option value="${fam.id}">${fam.nom}</option>`).join("")}`;
        }
    }

    if (target.matches("[data-field='stockActuel'], [data-field='stockMinimum'], [data-field='stockCritique'], [data-field='prixUnitaire']")) {
        const form = target.closest("form");
        if (form?.id === "form-articles") {
            renderStockIndicator(form);
            updateArticleStockValue(form);
        }
    }
});

document.addEventListener("click", (event) => {
    const card = event.target.closest(".type-card");
    if (!card) {
        return;
    }

    const group = card.closest("[data-article-type-group]");
    if (!group) {
        return;
    }

    group.querySelectorAll(".type-card").forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
});

document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-article-organe-add]");
    if (addButton) {
        const form = addButton.closest("form");
        const input = form?.querySelector("[data-article-organe-search]");
        if (!input) {
            return;
        }

        const selected = input.value.trim();
        const organe = organes.find((entry) => `[${entry.code}] ${entry.nom}` === selected || selected.startsWith(`[${entry.code}]`));
        if (!organe) {
            return;
        }

        const equipement = equipements.find((eq) => eq.id === organe.equipementId);
        const exists = articleOrganeLinks.some((link) => link.organeId === organe.id);
        if (!exists) {
            articleOrganeLinks.push({
                organeId: organe.id,
                organeCode: organe.code,
                organeNom: organe.nom,
                equipementNom: equipement?.nom ?? "",
                qteUtilisee: 1
            });
        }

        input.value = "";
        renderArticleOrganeLinks(form);
        return;
    }

    const removeButton = event.target.closest("[data-article-organe-remove]");
    if (removeButton) {
        const index = Number(removeButton.dataset.articleOrganeRemove);
        if (!Number.isNaN(index)) {
            articleOrganeLinks.splice(index, 1);
            const form = removeButton.closest("form");
            if (form) {
                renderArticleOrganeLinks(form);
            }
        }
    }
});

document.addEventListener("input", (event) => {
    const target = event.target;
    if (target.matches("[data-article-organe-qty]")) {
        const index = Number(target.dataset.articleOrganeQty);
        if (!Number.isNaN(index) && articleOrganeLinks[index]) {
            articleOrganeLinks[index].qteUtilisee = Number(target.value) || 1;
        }
    }
});

document.addEventListener("click", (event) => {
    const card = event.target.closest(".criticite-card");
    if (!card) {
        return;
    }

    const group = card.closest("[data-criticite-group]");
    if (!group) {
        return;
    }

    group.querySelectorAll(".criticite-card").forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
});

document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.matches("[data-field='photo']")) {
        const preview = target.closest("form")?.querySelector("[data-photo-preview]");
        if (!preview) {
            return;
        }

        preview.innerHTML = "";
        const file = target.files?.[0];
        if (file) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            preview.appendChild(img);
        }
    }

    if (target.matches("[data-field='documents']")) {
        const list = target.closest("form")?.querySelector("[data-file-list]");
        if (!list) {
            return;
        }

        list.innerHTML = "";
        Array.from(target.files ?? []).forEach((file) => {
            const item = document.createElement("div");
            item.className = "file-list-item";
            item.innerHTML = `<i class="fa-solid fa-file"></i><span>${file.name}</span>`;
            list.appendChild(item);
        });
    }
});

const diUser = (() => {
    const body = document.body;
    return {
        name: body?.dataset.userName ?? "Utilisateur",
        role: body?.dataset.userRole ?? "Utilisateur"
    };
})();

const diStatusMeta = {
    SOUMISE: { label: "Soumise", badgeClass: "di-status-soumise", icon: "fa-paper-plane" },
    EN_EXAMEN: { label: "En cours d'examen", badgeClass: "di-status-examen", icon: "fa-search" },
    ACCEPTEE: { label: "Acceptée", badgeClass: "di-status-acceptee", icon: "fa-check-circle" },
    CONVERTIE_EN_OT: { label: "Convertie en OT", badgeClass: "di-status-convertie", icon: "fa-tools" },
    REFUSEE: { label: "Refusée", badgeClass: "di-status-refusee", icon: "fa-times-circle" },
    ARCHIVEE: { label: "Archivée", badgeClass: "di-status-archivee", icon: "fa-archive" }
};

const diUrgenceMeta = {
    URGENTE: { label: "Urgente", badgeClass: "di-urgency-urgent" },
    HAUTE: { label: "Haute", badgeClass: "di-urgency-haute" },
    NORMALE: { label: "Normale", badgeClass: "di-urgency-normale" },
    BASSE: { label: "Basse", badgeClass: "di-urgency-basse" }
};

const diDisponibiliteLabels = {
    ARRET_TOTAL: "Oui — Arrêt total",
    DEGRADE: "Oui — Dégradé",
    EN_SERVICE: "Non"
};

const diTimelineSteps = ["SOUMISE", "EN_EXAMEN", "ACCEPTEE", "CONVERTIE_EN_OT"];
const diTechniciens = ["N. Slimani", "L. Hadj", "K. Bensaid", "R. Ait", "H. Meziane"];

let demandesIntervention = [
    {
        id: "di-1",
        numero: "DI-2026-0001",
        titre: "Vibration anormale compresseur",
        typeIntervention: "Panne",
        urgence: "URGENTE",
        statut: "SOUMISE",
        equipementId: "equip-1",
        equipementNom: "Compresseur principal",
        equipementCode: "CMP-501",
        organeId: "org-1",
        organeNom: "Organe lubrification",
        disponibiliteEquipement: "ARRET_TOTAL",
        description: "Vibration élevée et bruit métallique depuis ce matin.",
        symptomes: "Bruitage intermittent, hausse température",
        photos: [],
        documents: [],
        demandeur: diUser.name,
        dateSoumission: "2026-05-01T14:30:00",
        telephoneDemandeur: "",
        historique: [
            { action: "Soumise", utilisateur: diUser.name, date: "2026-05-01T14:30:00", commentaire: "" }
        ],
        createdAt: "2026-05-01T14:30:00"
    },
    {
        id: "di-2",
        numero: "DI-2026-0002",
        titre: "Fuite d'huile sur pompe",
        typeIntervention: "Anomalie détectée",
        urgence: "HAUTE",
        statut: "EN_EXAMEN",
        equipementId: "equip-1",
        equipementNom: "Compresseur principal",
        equipementCode: "CMP-501",
        organeId: "org-1",
        organeNom: "Organe lubrification",
        disponibiliteEquipement: "DEGRADE",
        description: "Présence d'huile au niveau du carter.",
        symptomes: "Fuite visible, odeur",
        photos: [],
        documents: [],
        demandeur: "A. Ferhat",
        dateSoumission: "2026-05-01T09:10:00",
        telephoneDemandeur: "021000001",
        examinateur: "Admin",
        dateExamen: "2026-05-01T10:00:00",
        historique: [
            { action: "Soumise", utilisateur: "A. Ferhat", date: "2026-05-01T09:10:00", commentaire: "" },
            { action: "Mise en examen", utilisateur: "Admin", date: "2026-05-01T10:00:00", commentaire: "" }
        ],
        createdAt: "2026-05-01T09:10:00"
    },
    {
        id: "di-3",
        numero: "DI-2026-0003",
        titre: "Inspection périodique compresseur",
        typeIntervention: "Inspection",
        urgence: "NORMALE",
        statut: "ACCEPTEE",
        equipementId: "equip-1",
        equipementNom: "Compresseur principal",
        equipementCode: "CMP-501",
        organeId: "org-1",
        organeNom: "Organe lubrification",
        disponibiliteEquipement: "EN_SERVICE",
        description: "Inspection trimestrielle planifiée.",
        symptomes: "",
        photos: [],
        documents: [],
        demandeur: "K. Benali",
        dateSoumission: "2026-04-28T08:30:00",
        telephoneDemandeur: "021000010",
        examinateur: "Admin",
        dateExamen: "2026-04-28T09:00:00",
        decision: "ACCEPTEE",
        prioriteOTSuggeree: "NORMALE",
        typeMaintenanceSuggeree: "MP-Préventive",
        historique: [
            { action: "Soumise", utilisateur: "K. Benali", date: "2026-04-28T08:30:00", commentaire: "" },
            { action: "Acceptée", utilisateur: "Admin", date: "2026-04-28T09:00:00", commentaire: "RAS" }
        ],
        createdAt: "2026-04-28T08:30:00"
    },
    {
        id: "di-4",
        numero: "DI-2026-0004",
        titre: "Demande d'amélioration zone atelier",
        typeIntervention: "Amélioration",
        urgence: "BASSE",
        statut: "REFUSEE",
        equipementId: "equip-1",
        equipementNom: "Compresseur principal",
        equipementCode: "CMP-501",
        organeId: "",
        organeNom: "",
        disponibiliteEquipement: "EN_SERVICE",
        description: "Améliorer la zone de stockage autour de l'équipement.",
        symptomes: "",
        photos: [],
        documents: [],
        demandeur: "M. Rahmani",
        dateSoumission: "2026-04-20T11:15:00",
        telephoneDemandeur: "021000011",
        examinateur: "Admin",
        dateExamen: "2026-04-20T12:00:00",
        decision: "REFUSEE",
        motifRefus: "Non prioritaire pour le moment.",
        historique: [
            { action: "Soumise", utilisateur: "M. Rahmani", date: "2026-04-20T11:15:00", commentaire: "" },
            { action: "Refusée", utilisateur: "Admin", date: "2026-04-20T12:00:00", commentaire: "Non prioritaire" }
        ],
        createdAt: "2026-04-20T11:15:00"
    },
    {
        id: "di-5",
        numero: "DI-2026-0005",
        titre: "Remplacement roulement",
        typeIntervention: "Panne",
        urgence: "URGENTE",
        statut: "CONVERTIE_EN_OT",
        equipementId: "equip-1",
        equipementNom: "Compresseur principal",
        equipementCode: "CMP-501",
        organeId: "org-1",
        organeNom: "Organe lubrification",
        disponibiliteEquipement: "ARRET_TOTAL",
        description: "Roulement usé, remplacement immédiat.",
        symptomes: "Bruit fort",
        photos: [],
        documents: [],
        demandeur: "S. Kaci",
        dateSoumission: "2026-04-15T13:00:00",
        telephoneDemandeur: "021000020",
        examinateur: "Admin",
        dateExamen: "2026-04-15T13:30:00",
        decision: "ACCEPTEE",
        prioriteOTSuggeree: "URGENTE",
        typeMaintenanceSuggeree: "MC-Corrective",
        otCreeeId: "ot-1",
        otCreeeNumero: "OT-2026-0001",
        historique: [
            { action: "Soumise", utilisateur: "S. Kaci", date: "2026-04-15T13:00:00", commentaire: "" },
            { action: "Acceptée", utilisateur: "Admin", date: "2026-04-15T13:30:00", commentaire: "Urgent" },
            { action: "OT créé", utilisateur: "Admin", date: "2026-04-15T13:35:00", commentaire: "OT-2026-0001" }
        ],
        createdAt: "2026-04-15T13:00:00"
    }
];

let ordresDeTravail = [
    {
        id: "ot-1",
        numero: "OT-2026-0001",
        titre: "Remplacement roulement",
        typeMaintenance: "MC-Corrective",
        priorite: "URGENTE",
        dateDebutPrevue: "2026-05-02",
        dateFinPrevue: "2026-05-02",
        technicien: "N. Slimani",
        techniciensSup: ["L. Hadj"],
        statut: "VALIDÉ",
        equipementId: "equip-1",
        equipementNom: "Compresseur principal",
        equipementCode: "CMP-501",
        organeId: "org-1",
        organeNom: "Organe lubrification",
        localisation: "Atelier Usinage — Bâtiment A, Salle 12",
        criticite: "🔴 Très Haute",
        description: "Remplacer le roulement avant et vérifier l'alignement.",
        symptomes: "Bruit métallique, vibration",
        diOrigineId: "di-5",
        diOrigineNumero: "DI-2026-0005",
        piecesAttendu: [
            {
                articleId: "art-1",
                nom: "Roulement SKF 6205",
                ref: "SKF-6205",
                qtePrevue: 1,
                unite: "pcs",
                emplacement: "Magasin A, Étagère 3, Case 12",
                stockDispo: 5
            }
        ],
        historique: [
            { action: "OT validé", utilisateur: "Admin", date: "2026-05-01T09:00:00", commentaire: "" }
        ]
    }
];

let bonsDeTravail = [
    {
        id: "bt-1",
        numero: "BT-2026-0001",
        otId: "ot-1",
        otNumero: "OT-2026-0001",
        diOrigineId: "di-5",
        diOrigineNumero: "DI-2026-0005",
        statut: "EN_COURS",
        dateGeneration: "2026-05-01",
        datePrevue: "2026-05-02",
        heurePrevue: "08:00",
        instructionsSpeciales: "Intervention avec arrêt total.",
        consignesSecurite: "Consigner électriquement l'équipement.",
        episRequis: ["Casque", "Gants", "Chaussures sécu."],
        equipementId: "equip-1",
        equipementNom: "Compresseur principal",
        equipementCode: "CMP-501",
        organeId: "org-1",
        organeNom: "Organe lubrification",
        localisation: "Atelier Usinage — Bâtiment A, Salle 12",
        criticite: "🔴 Très Haute",
        technicienPrincipal: "N. Slimani",
        techniciensSup: ["L. Hadj"],
        travailAFaire: "Remplacer le roulement avant et vérifier l'alignement.",
        symptomes: "Bruit métallique, vibration",
        piecesAttendu: [
            {
                articleId: "art-1",
                nom: "Roulement SKF 6205",
                ref: "SKF-6205",
                qtePrevue: 1,
                unite: "pcs",
                emplacement: "Magasin A, Étagère 3, Case 12",
                stockDispo: 5
            }
        ],
        piecesConsommees: [
            { articleId: "art-1", nom: "Roulement SKF 6205", ref: "SKF-6205", qtePrevue: 1, qteReelle: 1, unite: "pcs" }
        ],
        historique: [
            { action: "BT généré", utilisateur: "Admin", date: "2026-05-01T10:00:00", commentaire: "" },
            { action: "Démarré", utilisateur: "N. Slimani", date: "2026-05-02T08:05:00", commentaire: "" }
        ],
        createdAt: "2026-05-01T10:00:00"
    }
];

const diFilters = {
    search: "",
    urgence: "",
    statut: ""
};

const diForm = document.getElementById("form-di");
const diFormModalElement = document.getElementById("modal-di-form");
const diExamenModalElement = document.getElementById("modal-di-examen");
const diOtModalElement = document.getElementById("modal-di-ot");
const diDetailModalElement = document.getElementById("modal-di-detail");
const diFormModal = diFormModalElement && bootstrapAvailable ? new bootstrap.Modal(diFormModalElement) : null;
const diExamenModal = diExamenModalElement && bootstrapAvailable ? new bootstrap.Modal(diExamenModalElement) : null;
const diOtModal = diOtModalElement && bootstrapAvailable ? new bootstrap.Modal(diOtModalElement) : null;
const diDetailModal = diDetailModalElement && bootstrapAvailable ? new bootstrap.Modal(diDetailModalElement) : null;
const toastContainer = document.getElementById("toast-container");

const btFilters = {
    search: "",
    statut: "",
    technicien: ""
};

const btStatusMeta = {
    GENERE: { label: "Généré", badgeClass: "bt-status-genere", icon: "fa-file-alt" },
    REMIS: { label: "Remis", badgeClass: "bt-status-remis", icon: "fa-hand-holding" },
    EN_COURS: { label: "En cours", badgeClass: "bt-status-encours", icon: "fa-tools" },
    INCOMPLET: { label: "Incomplet", badgeClass: "bt-status-incomplet", icon: "fa-exclamation" },
    COMPLETE: { label: "Complété", badgeClass: "bt-status-complete", icon: "fa-clipboard-check" },
    VALIDE: { label: "Validé", badgeClass: "bt-status-valide", icon: "fa-check-double" }
};

const otStatusMeta = {
    PLANIFIE: "Planifié",
    EN_COURS: "En cours",
    VALIDE: "Validé",
    CLOTURE: "Clôturé"
};

const otDetailModalElement = document.getElementById("modal-ot-detail");
const btGenerateModalElement = document.getElementById("modal-bt-generate");
const btDetailModalElement = document.getElementById("modal-bt-detail");
const btValidateModalElement = document.getElementById("modal-bt-validate");
const btPrintModalElement = document.getElementById("modal-bt-print");
const btGenerateModal = btGenerateModalElement && bootstrapAvailable ? new bootstrap.Modal(btGenerateModalElement) : null;
const btDetailModal = btDetailModalElement && bootstrapAvailable ? new bootstrap.Modal(btDetailModalElement) : null;
const btValidateModal = btValidateModalElement && bootstrapAvailable ? new bootstrap.Modal(btValidateModalElement) : null;
const btPrintModal = btPrintModalElement && bootstrapAvailable ? new bootstrap.Modal(btPrintModalElement) : null;
const otDetailModal = otDetailModalElement && bootstrapAvailable ? new bootstrap.Modal(otDetailModalElement) : null;
const btPrintable = document.getElementById("bt-printable");

let btGenerateContext = null;
let btDetailContext = null;
let btValidateContext = null;

let diFormContext = null;
let diExamenContext = null;
let diOtContext = null;

const formatDiDate = (value) => (value ? new Date(value).toLocaleDateString("fr-FR") : "-");
const formatDiDateTime = (value) => (value ? new Date(value).toLocaleString("fr-FR") : "-");

const getNextSequence = (items, prefix) => {
    const currentYear = new Date().getFullYear();
    const sequences = items
        .map((item) => item.numero)
        .filter((numero) => typeof numero === "string" && numero.startsWith(`${prefix}-${currentYear}-`))
        .map((numero) => Number(numero.split("-").pop()))
        .filter((value) => !Number.isNaN(value));
    const next = (sequences.length ? Math.max(...sequences) : 0) + 1;
    return `${prefix}-${currentYear}-${next.toString().padStart(4, "0")}`;
};

const getEquipmentById = (equipmentId) => equipment.find((item) => item.id === equipmentId) ?? null;

const getEquipmentService = (equip) => {
    const line = lines.find((entry) => entry.id === equip?.lineId);
    const workshop = workshops.find((entry) => entry.id === line?.workshopId);
    return workshop?.name ?? "-";
};

const getEquipmentCriticite = (equip) => {
    const map = {
        A: "🔴 Très Haute",
        B: "🟠 Haute",
        C: "🟢 Normale"
    };
    return map[equip?.criticality] ?? "🟡 Moyenne";
};

const getOrgansForEquipment = (equipmentId) => {
    const relatedSubassemblies = subassemblies.filter((sub) => sub.equipmentId === equipmentId).map((sub) => sub.id);
    return organs.filter((org) => relatedSubassemblies.includes(org.subassemblyId));
};

const renderDiStatusBadge = (status) => {
    const meta = diStatusMeta[status] ?? diStatusMeta.SOUMISE;
    return `<span class="badge di-status-badge ${meta.badgeClass}"><i class="fa-solid ${meta.icon}"></i>${meta.label}</span>`;
};

const renderDiUrgenceBadge = (urgence) => {
    const meta = diUrgenceMeta[urgence] ?? diUrgenceMeta.NORMALE;
    return `<span class="badge di-urgency-badge ${meta.badgeClass}">${meta.label}</span>`;
};

const renderDiActions = (di) => {
    const role = (diUser.role ?? "").toLowerCase();
    const isResponsable = role.includes("responsable") || role.includes("mod");
    const isDemandeur = di.demandeur === diUser.name;
    const buttons = [
        `<button class="btn btn-outline-secondary btn-sm" data-di-action="detail" data-di-id="${di.id}" title="Voir détail"><i class="fa-solid fa-eye"></i></button>`
    ];

    if (di.statut === "SOUMISE" && isDemandeur) {
        buttons.push(`<button class="btn btn-outline-primary btn-sm" data-di-action="edit" data-di-id="${di.id}" title="Modifier"><i class="fa-solid fa-edit"></i></button>`);
    }
    if (di.statut === "SOUMISE" && isResponsable) {
        buttons.push(`<button class="btn btn-outline-warning btn-sm" data-di-action="examine" data-di-id="${di.id}" title="Examiner"><i class="fa-solid fa-search"></i></button>`);
    }
    if (di.statut === "EN_EXAMEN" && isResponsable) {
        buttons.push(`<button class="btn btn-outline-success btn-sm" data-di-action="accept" data-di-id="${di.id}" title="Accepter"><i class="fa-solid fa-check"></i></button>`);
        buttons.push(`<button class="btn btn-outline-danger btn-sm" data-di-action="refuse" data-di-id="${di.id}" title="Refuser"><i class="fa-solid fa-times"></i></button>`);
    }
    if (di.statut === "ACCEPTEE" && isResponsable) {
        buttons.push(`<button class="btn btn-outline-success btn-sm" data-di-action="convert" data-di-id="${di.id}" title="Créer un OT"><i class="fa-solid fa-tools"></i></button>`);
    }
    if (di.statut === "REFUSEE" && isResponsable) {
        buttons.push(`<button class="btn btn-outline-secondary btn-sm" data-di-action="archive" data-di-id="${di.id}" title="Archiver"><i class="fa-solid fa-archive"></i></button>`);
    }

    return `<div class="d-flex gap-1">${buttons.join("")}</div>`;
};

const renderDiKpis = () => {
    const total = demandesIntervention.length;
    const attente = demandesIntervention.filter((di) => di.statut === "SOUMISE").length;
    const acceptees = demandesIntervention.filter((di) => di.statut === "ACCEPTEE").length;
    const refusees = demandesIntervention.filter((di) => di.statut === "REFUSEE").length;
    const totalElement = document.getElementById("kpi-di-total");
    const attenteElement = document.getElementById("kpi-di-attente");
    const accepteesElement = document.getElementById("kpi-di-acceptees");
    const refuseesElement = document.getElementById("kpi-di-refusees");

    if (totalElement) totalElement.textContent = total;
    if (attenteElement) attenteElement.textContent = attente;
    if (accepteesElement) accepteesElement.textContent = acceptees;
    if (refuseesElement) refuseesElement.textContent = refusees;
};

const renderDiTable = () => {
    const tableBody = document.getElementById("table-demandes");
    if (!tableBody) {
        return;
    }

    const searchValue = diFilters.search.trim().toLowerCase();
    let items = [...demandesIntervention];

    if (diFilters.urgence) {
        items = items.filter((di) => di.urgence === diFilters.urgence);
    }
    if (diFilters.statut) {
        items = items.filter((di) => di.statut === diFilters.statut);
    }
    if (searchValue) {
        items = items.filter((di) =>
            di.numero.toLowerCase().includes(searchValue)
            || di.titre.toLowerCase().includes(searchValue)
            || di.equipementNom.toLowerCase().includes(searchValue)
            || di.demandeur.toLowerCase().includes(searchValue));
    }

    if (!items.length) {
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">Aucune demande disponible.</td></tr>`;
        renderDiKpis();
        return;
    }

    tableBody.innerHTML = items
        .map((di) => `
            <tr>
                <td>${di.numero}</td>
                <td>${di.titre}</td>
                <td>${di.equipementNom || "-"}</td>
                <td>${renderDiUrgenceBadge(di.urgence)}</td>
                <td>${di.demandeur}</td>
                <td>${formatDiDate(di.dateSoumission)}</td>
                <td>${renderDiStatusBadge(di.statut)}</td>
                <td>${renderDiActions(di)}</td>
            </tr>`)
        .join("");

    renderDiKpis();
};

const renderOtTable = () => {
    const tableBody = document.getElementById("table-workorders");
    if (!tableBody) {
        return;
    }

    if (!ordresDeTravail.length) {
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">Aucun ordre de travail.</td></tr>`;
        return;
    }

    tableBody.innerHTML = ordresDeTravail
        .map((ot) => `
            <tr>
                <td>${ot.numero}</td>
                <td>${ot.titre}</td>
                <td>${ot.equipementNom || "-"}</td>
                <td>${renderDiUrgenceBadge(ot.priorite)}</td>
                <td>${ot.technicien || "-"}</td>
                <td><span class="badge bg-primary">${ot.statut || "Planifié"}</span></td>
                <td>${ot.dateDebutPrevue || "-"} → ${ot.dateFinPrevue || "-"}</td>
                <td>
                    <div class="d-flex gap-1">
                        <button class="btn btn-outline-secondary btn-sm" data-ot-action="detail" data-ot-id="${ot.id}" title="Voir détail"><i class="fa-solid fa-eye"></i></button>
                    </div>
                </td>
            </tr>`)
        .join("");
};

const renderBtStatusBadge = (status) => {
    const meta = btStatusMeta[status] ?? btStatusMeta.GENERE;
    return `<span class="badge bt-status-badge ${meta.badgeClass}"><i class="fa-solid ${meta.icon}"></i>${meta.label}</span>`;
};

const renderBtActions = (bt) => {
    const buttons = [
        `<button class="btn btn-outline-secondary btn-sm" data-bt-action="detail" data-bt-id="${bt.id}" title="Voir détail"><i class="fa-solid fa-eye"></i></button>`,
        `<button class="btn btn-outline-primary btn-sm" data-bt-action="print" data-bt-id="${bt.id}" title="Imprimer"><i class="fa-solid fa-print"></i></button>`
    ];

    if (bt.statut === "GENERE") {
        buttons.push(`<button class="btn btn-outline-warning btn-sm" data-bt-action="remis" data-bt-id="${bt.id}" title="Marquer Remis"><i class="fa-solid fa-hand-holding"></i></button>`);
    }
    if (bt.statut === "REMIS") {
        buttons.push(`<button class="btn btn-outline-success btn-sm" data-bt-action="start" data-bt-id="${bt.id}" title="Démarrer"><i class="fa-solid fa-play"></i></button>`);
    }
    if (bt.statut === "EN_COURS" || bt.statut === "INCOMPLET") {
        buttons.push(`<button class="btn btn-outline-success btn-sm" data-bt-action="complete" data-bt-id="${bt.id}" title="Compléter"><i class="fa-solid fa-clipboard-check"></i></button>`);
    }
    if (bt.statut === "COMPLETE") {
        buttons.push(`<button class="btn btn-outline-success btn-sm" data-bt-action="validate" data-bt-id="${bt.id}" title="Valider"><i class="fa-solid fa-check-double"></i></button>`);
    }

    return `<div class="d-flex gap-1">${buttons.join("")}</div>`;
};

const renderBtKpis = () => {
    const total = bonsDeTravail.length;
    const encours = bonsDeTravail.filter((bt) => bt.statut === "EN_COURS").length;
    const completes = bonsDeTravail.filter((bt) => bt.statut === "COMPLETE" || bt.statut === "VALIDE").length;
    const attente = bonsDeTravail.filter((bt) => bt.statut === "COMPLETE").length;
    const totalElement = document.getElementById("kpi-bt-total");
    const encoursElement = document.getElementById("kpi-bt-encours");
    const completesElement = document.getElementById("kpi-bt-completes");
    const attenteElement = document.getElementById("kpi-bt-attente");

    if (totalElement) totalElement.textContent = total;
    if (encoursElement) encoursElement.textContent = encours;
    if (completesElement) completesElement.textContent = completes;
    if (attenteElement) attenteElement.textContent = attente;
};

const renderBtTable = () => {
    const tableBody = document.getElementById("table-bons-travail");
    if (!tableBody) {
        return;
    }

    let items = [...bonsDeTravail];
    const searchValue = btFilters.search.trim().toLowerCase();

    if (btFilters.statut) {
        items = items.filter((bt) => bt.statut === btFilters.statut);
    }
    if (btFilters.technicien) {
        items = items.filter((bt) => bt.technicienPrincipal === btFilters.technicien);
    }
    if (searchValue) {
        items = items.filter((bt) =>
            bt.numero.toLowerCase().includes(searchValue)
            || bt.otNumero.toLowerCase().includes(searchValue)
            || bt.technicienPrincipal.toLowerCase().includes(searchValue));
    }

    if (!items.length) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Aucun bon de travail.</td></tr>`;
        renderBtKpis();
        return;
    }

    tableBody.innerHTML = items
        .map((bt) => `
            <tr>
                <td>${bt.numero}</td>
                <td>${bt.otNumero}</td>
                <td>${bt.equipementNom || "-"}</td>
                <td>${bt.technicienPrincipal || "-"}</td>
                <td>${bt.datePrevue || "-"}</td>
                <td>${renderBtStatusBadge(bt.statut)}</td>
                <td>${renderBtActions(bt)}</td>
            </tr>`)
        .join("");

    renderBtKpis();
};

const populateBtTechnicienFilter = () => {
    const select = document.querySelector("[data-bt-filter-tech]");
    if (!select) {
        return;
    }

    const techs = Array.from(new Set([
        ...bonsDeTravail.map((bt) => bt.technicienPrincipal),
        ...ordresDeTravail.map((ot) => ot.technicien)
    ].filter(Boolean)));

    select.innerHTML = `<option value="">Tous techniciens</option>${techs.map((tech) => `<option value="${tech}">${tech}</option>`).join("")}`;
};

const buildOtDetailBody = (ot) => {
    const btAssocies = bonsDeTravail.filter((bt) => bt.otId === ot.id);
    const canGenerate = ot.statut === "VALIDÉ" && !btAssocies.some((bt) => bt.statut !== "VALIDE");
    const btRows = btAssocies.length
        ? btAssocies
            .map((bt) => `
                <tr>
                    <td>${bt.numero}</td>
                    <td>${renderBtStatusBadge(bt.statut)}</td>
                    <td>${bt.technicienPrincipal || "-"}</td>
                    <td>${bt.dateGeneration || "-"}</td>
                    <td>
                        <button class="btn btn-outline-secondary btn-sm" data-bt-action="detail" data-bt-id="${bt.id}"><i class="fa-solid fa-eye"></i></button>
                    </td>
                </tr>`)
            .join("")
        : `<tr><td colspan="5" class="text-center text-muted">Aucun bon de travail associé.</td></tr>`;

    const piecesRows = (ot.piecesAttendu ?? [])
        .map((piece) => `
            <tr>
                <td>${piece.nom}</td>
                <td>${piece.ref}</td>
                <td>${piece.qtePrevue}</td>
                <td>${piece.unite}</td>
            </tr>`)
        .join("") || `<tr><td colspan="4" class="text-center text-muted">Aucune pièce prévue.</td></tr>`;

    return `
        <div class="bt-detail-header">
            <div class="d-flex flex-wrap gap-2">
                <span class="badge bg-dark">${ot.numero}</span>
                ${renderDiUrgenceBadge(ot.priorite)}
                <span class="badge bg-primary">${ot.statut}</span>
            </div>
            <h4 class="fw-bold mt-2">${ot.titre}</h4>
        </div>
        <div class="row g-4">
            <div class="col-lg-6">
                <div class="fw-semibold mb-2">Informations OT</div>
                <div class="mb-2"><span class="text-muted">Équipement:</span> ${ot.equipementNom} (${ot.equipementCode})</div>
                <div class="mb-2"><span class="text-muted">Organe:</span> ${ot.organeNom || "-"}</div>
                <div class="mb-2"><span class="text-muted">Technicien:</span> ${ot.technicien || "-"}</div>
                <div class="mb-2"><span class="text-muted">Date prévue:</span> ${ot.dateDebutPrevue} → ${ot.dateFinPrevue}</div>
                <div class="mb-2"><span class="text-muted">Description:</span> ${ot.description || "-"}</div>
                <div class="mb-2"><span class="text-muted">Symptômes:</span> ${ot.symptomes || "-"}</div>
            </div>
            <div class="col-lg-6">
                <div class="fw-semibold mb-2">Pièces prévues</div>
                <div class="table-responsive">
                    <table class="table table-sm align-middle">
                        <thead>
                            <tr>
                                <th>Article</th>
                                <th>Référence</th>
                                <th>Qté</th>
                                <th>Unité</th>
                            </tr>
                        </thead>
                        <tbody>${piecesRows}</tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="mt-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="fw-semibold">Bons de Travail associés</div>
                ${canGenerate ? `<button class="btn btn-outline-primary btn-sm" data-bt-action="generate" data-ot-id="${ot.id}"><i class="fa-solid fa-file-alt me-2"></i>Générer un BT</button>` : ""}
            </div>
            <div class="table-responsive">
                <table class="table table-sm align-middle">
                    <thead>
                        <tr>
                            <th>N° BT</th>
                            <th>Statut</th>
                            <th>Technicien</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>${btRows}</tbody>
                </table>
            </div>
        </div>`;
};

const openOtDetailModal = (otId) => {
    const ot = ordresDeTravail.find((entry) => entry.id === otId);
    const body = document.getElementById("ot-detail-body");
    if (!ot || !body) {
        return;
    }

    body.innerHTML = buildOtDetailBody(ot);
    otDetailModal?.show();
};

const buildBtSummaryCard = (ot) => `
    <div class="d-flex flex-column gap-1">
        <div class="fw-semibold">${ot.numero} | ${ot.titre}</div>
        <div><span class="text-muted">Technicien:</span> ${ot.technicien || "-"}</div>
        <div><span class="text-muted">Priorité:</span> ${renderDiUrgenceBadge(ot.priorite)}</div>
        <div><span class="text-muted">Date prévue:</span> ${ot.dateDebutPrevue || "-"}</div>
    </div>`;

const openBtGenerateModal = (otId) => {
    const ot = ordresDeTravail.find((entry) => entry.id === otId);
    const form = document.getElementById("form-bt-generate");
    if (!ot || !form) {
        return;
    }

    form.reset();
    form.classList.remove("was-validated");
    const summary = document.querySelector("[data-bt-generate-summary]");
    if (summary) {
        summary.innerHTML = buildBtSummaryCard(ot);
    }

    form.querySelector("[data-bt-field='numero']").value = getNextSequence(bonsDeTravail, "BT");
    form.querySelector("[data-bt-field='datePrevue']").value = ot.dateDebutPrevue || "";
    btGenerateContext = { otId };
    btGenerateModal?.show();
};

const generateBT = () => {
    const form = document.getElementById("form-bt-generate");
    if (!form || !btGenerateContext?.otId) {
        return;
    }

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const ot = ordresDeTravail.find((entry) => entry.id === btGenerateContext.otId);
    if (!ot) {
        return;
    }

    const numero = form.querySelector("[data-bt-field='numero']").value;
    const datePrevue = form.querySelector("[data-bt-field='datePrevue']").value;
    const heurePrevue = form.querySelector("[data-bt-field='heurePrevue']").value;
    const instructions = form.querySelector("[data-bt-field='instructionsSpeciales']").value;
    const consignes = form.querySelector("[data-bt-field='consignesSecurite']").value;
    const epis = Array.from(form.querySelectorAll("[data-bt-epi]:checked")).map((input) => input.value);

    const piecesAttendu = ot.piecesAttendu ? [...ot.piecesAttendu] : [];
    const piecesConsommees = piecesAttendu.map((piece) => ({
        articleId: piece.articleId,
        nom: piece.nom,
        ref: piece.ref,
        qtePrevue: piece.qtePrevue,
        qteReelle: piece.qtePrevue,
        unite: piece.unite
    }));

    const bt = {
        id: createId(),
        numero,
        otId: ot.id,
        otNumero: ot.numero,
        diOrigineId: ot.diOrigineId,
        diOrigineNumero: ot.diOrigineNumero,
        statut: "GENERE",
        dateGeneration: new Date().toISOString().split("T")[0],
        datePrevue,
        heurePrevue,
        instructionsSpeciales: instructions,
        consignesSecurite: consignes,
        episRequis: epis,
        equipementId: ot.equipementId,
        equipementNom: ot.equipementNom,
        equipementCode: ot.equipementCode,
        organeId: ot.organeId,
        organeNom: ot.organeNom,
        localisation: ot.localisation,
        criticite: ot.criticite,
        technicienPrincipal: ot.technicien,
        techniciensSup: ot.techniciensSup ?? [],
        travailAFaire: ot.description,
        symptomes: ot.symptomes,
        piecesAttendu,
        piecesConsommees,
        historique: [
            { action: "BT généré", utilisateur: diUser.name, date: new Date().toISOString(), commentaire: "" }
        ],
        createdAt: new Date().toISOString()
    };

    bonsDeTravail.unshift(bt);
    ot.historique ??= [];
    ot.historique.push({ action: `BT ${bt.numero} généré`, utilisateur: diUser.name, date: new Date().toISOString(), commentaire: "" });

    renderBtTable();
    renderOtTable();
    populateBtTechnicienFilter();
    btGenerateModal?.hide();
    showToast(`📄 ${bt.numero} généré avec succès`, "success");
};

const markBTRemis = (btId) => {
    const bt = bonsDeTravail.find((entry) => entry.id === btId);
    if (!bt) {
        return;
    }
    bt.statut = "REMIS";
    bt.historique ??= [];
    bt.historique.push({ action: "Remis", utilisateur: diUser.name, date: new Date().toISOString(), commentaire: "" });
    renderBtTable();
};

const startBT = (btId) => {
    const bt = bonsDeTravail.find((entry) => entry.id === btId);
    if (!bt) {
        return;
    }
    bt.statut = "EN_COURS";
    bt.historique ??= [];
    bt.historique.push({ action: "Démarré", utilisateur: bt.technicienPrincipal ?? diUser.name, date: new Date().toISOString(), commentaire: "" });
    renderBtTable();
};

const updateBtDuration = () => {
    if (!btDetailModalElement || !btDetailContext?.btId) {
        return;
    }
    const bt = bonsDeTravail.find((entry) => entry.id === btDetailContext.btId);
    if (!bt) {
        return;
    }
    const startDate = btDetailModalElement.querySelector("[data-bt-report='dateDebut']")?.value;
    const startTime = btDetailModalElement.querySelector("[data-bt-report='heureDebut']")?.value;
    const endDate = btDetailModalElement.querySelector("[data-bt-report='dateFin']")?.value;
    const endTime = btDetailModalElement.querySelector("[data-bt-report='heureFin']")?.value;
    const durationField = btDetailModalElement.querySelector("[data-bt-report='duree']");
    if (!startDate || !startTime || !endDate || !endTime || !durationField) {
        if (durationField) {
            durationField.value = "-";
        }
        return;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const diffMinutes = Math.max(0, Math.round((end - start) / 60000));
    const hours = Math.floor(diffMinutes / 60).toString().padStart(2, "0");
    const minutes = (diffMinutes % 60).toString().padStart(2, "0");
    durationField.value = `${hours}:${minutes}`;
};

const submitBTRapport = (btId) => {
    const bt = bonsDeTravail.find((entry) => entry.id === btId);
    if (!bt || !btDetailModalElement) {
        return;
    }

    const dateDebut = btDetailModalElement.querySelector("[data-bt-report='dateDebut']")?.value;
    const heureDebut = btDetailModalElement.querySelector("[data-bt-report='heureDebut']")?.value;
    const dateFin = btDetailModalElement.querySelector("[data-bt-report='dateFin']")?.value;
    const heureFin = btDetailModalElement.querySelector("[data-bt-report='heureFin']")?.value;
    const travaux = btDetailModalElement.querySelector("[data-bt-report='travaux']")?.value;
    const resultat = btDetailModalElement.querySelector("[data-bt-result].active")?.dataset.btResult;
    const certification = btDetailModalElement.querySelector("[data-bt-report='certification']")?.checked;

    if (!dateDebut || !heureDebut || !dateFin || !heureFin || !travaux || !resultat || !certification) {
        showToast("Veuillez compléter le rapport requis.", "warning");
        return;
    }

    const piecesConsommees = Array.from(btDetailModalElement.querySelectorAll("[data-bt-piece-row]"))
        .map((row) => {
            const articleId = row.dataset.btPieceRow;
            const qteReelle = Number(row.querySelector("[data-bt-piece-reelle]")?.value) || 0;
            const piece = bt.piecesAttendu?.find((item) => item.articleId === articleId);
            return {
                articleId,
                nom: piece?.nom ?? "",
                ref: piece?.ref ?? "",
                qtePrevue: piece?.qtePrevue ?? 0,
                qteReelle,
                unite: piece?.unite ?? ""
            };
        });

    updateBtDuration();
    const duree = btDetailModalElement.querySelector("[data-bt-report='duree']")?.value ?? "";

    bt.dateReelleDebut = dateDebut;
    bt.heureReelleDebut = heureDebut;
    bt.dateReelleFin = dateFin;
    bt.heureReelleFin = heureFin;
    bt.dureeReelle = duree;
    bt.travauxEffectues = travaux;
    bt.resultat = resultat;
    bt.piecesConsommees = piecesConsommees;
    bt.observationsTech = btDetailModalElement.querySelector("[data-bt-report='observations']")?.value ?? "";
    bt.recommandationsTech = btDetailModalElement.querySelector("[data-bt-report='recommandations']")?.value ?? "";
    bt.signatureTech = bt.technicienPrincipal;
    bt.dateSignature = new Date().toISOString().split("T")[0];
    bt.statut = "COMPLETE";
    bt.historique ??= [];
    bt.historique.push({ action: "Rapport soumis", utilisateur: bt.technicienPrincipal ?? diUser.name, date: new Date().toISOString(), commentaire: "" });

    prefillOTCloseFromBT(bt);
    renderBtTable();
    btDetailModal?.hide();
    showToast("✅ Rapport soumis. En attente de validation.", "success");
};

const buildBtValidationBody = (bt) => {
    const piecesRows = (bt.piecesConsommees ?? [])
        .map((piece) => `
            <tr>
                <td>${piece.nom}</td>
                <td>${piece.ref}</td>
                <td>${piece.qteReelle}</td>
            </tr>`)
        .join("") || `<tr><td colspan="3" class="text-center text-muted">Aucune pièce.</td></tr>`;

    return `
        <div class="mb-3">
            <div class="fw-semibold">${bt.technicienPrincipal}</div>
            <div class="text-muted small">Durée réelle: ${bt.dureeReelle || "-"} | Résultat: ${bt.resultat || "-"}</div>
        </div>
        <div class="mb-3">
            <div class="fw-semibold">Travaux effectués</div>
            <div class="text-muted">${bt.travauxEffectues || "-"}</div>
        </div>
        <div class="mb-3">
            <div class="fw-semibold">Pièces consommées</div>
            <div class="table-responsive">
                <table class="table table-sm align-middle">
                    <thead>
                        <tr>
                            <th>Article</th>
                            <th>Référence</th>
                            <th>Qté réelle</th>
                        </tr>
                    </thead>
                    <tbody>${piecesRows}</tbody>
                </table>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label fw-semibold">Décision</label>
            <div class="d-grid gap-2" data-bt-validate-decision>
                <input class="btn-check" type="radio" name="btValidateDecision" id="bt-validate-yes" value="VALIDE">
                <label class="btn btn-outline-success" for="bt-validate-yes">✅ Valider le rapport</label>
                <input class="btn-check" type="radio" name="btValidateDecision" id="bt-validate-return" value="RETOUR">
                <label class="btn btn-outline-warning" for="bt-validate-return">↩️ Retourner pour complétion</label>
            </div>
        </div>
        <div class="mb-3 d-none" data-bt-validate-motif>
            <label class="form-label">Motif du retour</label>
            <textarea class="form-control" rows="2" data-bt-validate-field="motif"></textarea>
        </div>
        <div class="mb-3">
            <label class="form-label">Commentaire responsable</label>
            <textarea class="form-control" rows="2" data-bt-validate-field="commentaire"></textarea>
        </div>`;
};

const openBtValidateModal = (btId) => {
    const bt = bonsDeTravail.find((entry) => entry.id === btId);
    const body = document.getElementById("bt-validate-body");
    if (!bt || !body) {
        return;
    }

    body.innerHTML = buildBtValidationBody(bt);
    btValidateContext = { btId };
    btValidateModal?.show();
};

const validateBT = () => {
    if (!btValidateContext?.btId) {
        return;
    }
    const bt = bonsDeTravail.find((entry) => entry.id === btValidateContext.btId);
    if (!bt || !btValidateModalElement) {
        return;
    }

    const decision = btValidateModalElement.querySelector("[name='btValidateDecision']:checked")?.value;
    const motif = btValidateModalElement.querySelector("[data-bt-validate-field='motif']")?.value ?? "";
    const commentaire = btValidateModalElement.querySelector("[data-bt-validate-field='commentaire']")?.value ?? "";

    if (!decision) {
        showToast("Veuillez sélectionner une décision.", "warning");
        return;
    }

    if (decision === "RETOUR" && !motif.trim()) {
        showToast("Le motif du retour est requis.", "warning");
        return;
    }

    if (decision === "VALIDE") {
        bt.statut = "VALIDE";
        bt.validePar = diUser.name;
        bt.dateValidation = new Date().toISOString();
        bt.commentaireResponsable = commentaire;
        bt.historique ??= [];
        bt.historique.push({ action: "Validé", utilisateur: diUser.name, date: bt.dateValidation, commentaire });
        prefillOTCloseFromBT(bt);
        showToast("✅ BT validé. Clôture OT disponible.", "success");
    }

    if (decision === "RETOUR") {
        returnBT(bt.id, motif);
    }

    renderBtTable();
    btValidateModal?.hide();
};

const returnBT = (btId, motif) => {
    const bt = bonsDeTravail.find((entry) => entry.id === btId);
    if (!bt) {
        return;
    }
    bt.statut = "INCOMPLET";
    bt.motifRetour = motif;
    bt.historique ??= [];
    bt.historique.push({ action: "Retourné", utilisateur: diUser.name, date: new Date().toISOString(), commentaire: motif });
    showToast("BT retourné au technicien.", "warning");
};

const prefillOTCloseFromBT = (bt) => {
    const ot = ordresDeTravail.find((entry) => entry.id === bt.otId);
    if (!ot) {
        return;
    }
    ot.closePrefill = {
        dateReelleDebut: bt.dateReelleDebut,
        dateReelleFin: bt.dateReelleFin,
        dureeReelle: bt.dureeReelle,
        travauxEffectues: bt.travauxEffectues,
        piecesConsommees: bt.piecesConsommees,
        resultat: bt.resultat
    };
};

const buildBtDetailBody = (bt) => {
    const isEditable = bt.statut === "EN_COURS" || bt.statut === "INCOMPLET";
    const ot = ordresDeTravail.find((entry) => entry.id === bt.otId);
    const epiBadges = (bt.episRequis ?? []).map((epi) => `<span class="epi-badge">${epi}</span>`).join(" ") || "-";
    const piecesRows = (bt.piecesAttendu ?? [])
        .map((piece) => `
            <tr>
                <td>${piece.nom}</td>
                <td>${piece.ref}</td>
                <td>${piece.qtePrevue}</td>
                <td>${piece.unite}</td>
                <td>${piece.emplacement || "-"}</td>
                <td>${piece.stockDispo ?? "-"}</td>
            </tr>`)
        .join("") || `<tr><td colspan="6" class="text-center text-muted">Aucune pièce prévue.</td></tr>`;

    const reportPiecesRows = (bt.piecesAttendu ?? [])
        .map((piece) => {
            const consumed = bt.piecesConsommees?.find((item) => item.articleId === piece.articleId);
            const qteReelle = consumed?.qteReelle ?? piece.qtePrevue;
            return `
                <tr data-bt-piece-row="${piece.articleId}">
                    <td>${piece.nom}</td>
                    <td>${piece.ref}</td>
                    <td>${piece.qtePrevue}</td>
                    <td>${piece.unite}</td>
                    <td><input class="form-control form-control-sm" type="number" min="0" value="${qteReelle}" data-bt-piece-reelle ${isEditable ? "" : "disabled"}></td>
                </tr>`;
        })
        .join("") || `<tr><td colspan="5" class="text-center text-muted">Aucune pièce.</td></tr>`;

    const actions = `
        <div class="d-flex flex-wrap gap-2 mt-2">
            <button class="btn btn-outline-primary btn-sm" data-bt-action="print" data-bt-id="${bt.id}"><i class="fa-solid fa-print me-2"></i>Imprimer le BT</button>
            ${bt.statut === "GENERE" ? `<button class="btn btn-outline-warning btn-sm" data-bt-action="remis" data-bt-id="${bt.id}"><i class="fa-solid fa-hand-holding me-2"></i>Marquer comme Remis</button>` : ""}
            ${bt.statut === "REMIS" ? `<button class="btn btn-outline-success btn-sm" data-bt-action="start" data-bt-id="${bt.id}"><i class="fa-solid fa-play me-2"></i>Démarrer</button>` : ""}
            ${bt.statut === "EN_COURS" || bt.statut === "INCOMPLET" ? `<button class="btn btn-outline-success btn-sm" data-bt-action="submit-report" data-bt-id="${bt.id}"><i class="fa-solid fa-clipboard-check me-2"></i>Saisir rapport</button>` : ""}
            ${bt.statut === "COMPLETE" ? `<button class="btn btn-outline-success btn-sm" data-bt-action="validate" data-bt-id="${bt.id}"><i class="fa-solid fa-check-double me-2"></i>Valider</button>` : ""}
        </div>`;

    return `
        <div class="bt-detail-header">
            <div class="d-flex flex-wrap gap-2">
                <span class="badge bg-dark">${bt.numero}</span>
                <span class="badge bg-secondary">${bt.otNumero}</span>
                ${renderBtStatusBadge(bt.statut)}
                ${renderDiUrgenceBadge(ot?.priorite ?? "NORMALE")}
            </div>
            <h4 class="fw-bold mt-2">${ot?.titre ?? "Intervention"}</h4>
            ${actions}
        </div>
        <div class="row g-4">
            <div class="col-lg-6">
                <div class="fw-semibold mb-2">Informations générales</div>
                <div class="mb-2"><span class="text-muted">N° BT:</span> ${bt.numero}</div>
                <div class="mb-2"><span class="text-muted">N° OT lié:</span> ${bt.otNumero}</div>
                <div class="mb-2"><span class="text-muted">N° DI origine:</span> ${bt.diOrigineNumero || "-"}</div>
                <div class="mb-2"><span class="text-muted">Date génération:</span> ${bt.dateGeneration || "-"}</div>
                <div class="mb-2"><span class="text-muted">Date prévue:</span> ${bt.datePrevue || "-"}</div>
                <div class="mb-2"><span class="text-muted">Heure prévue:</span> ${bt.heurePrevue || "-"}</div>
                <div class="fw-semibold mt-3 mb-2">Équipement</div>
                <div class="mb-2"><span class="text-muted">Équipement:</span> ${bt.equipementNom} (${bt.equipementCode})</div>
                <div class="mb-2"><span class="text-muted">Organe:</span> ${bt.organeNom || "-"}</div>
                <div class="mb-2"><span class="text-muted">Localisation:</span> ${bt.localisation || "-"}</div>
                <div class="mb-2"><span class="text-muted">Criticité:</span> ${bt.criticite || "-"}</div>
                <div class="mb-2"><span class="text-muted">Statut équip.:</span> En service</div>
            </div>
            <div class="col-lg-6">
                <div class="fw-semibold mb-2">Technicien assigné</div>
                <div class="mb-2"><span class="text-muted">Principal:</span> ${bt.technicienPrincipal || "-"}</div>
                <div class="mb-2"><span class="text-muted">Suppléments:</span> ${(bt.techniciensSup ?? []).join(", ") || "-"}</div>
                <div class="fw-semibold mt-3 mb-2">Travaux à effectuer</div>
                <div class="mb-2">${bt.travailAFaire || "-"}</div>
                <div class="mb-2"><span class="text-muted">Symptômes:</span> ${bt.symptomes || "-"}</div>
                <div class="fw-semibold mt-3 mb-2">Consignes &amp; Sécurité</div>
                <div class="mb-2"><span class="text-muted">Instructions:</span> ${bt.instructionsSpeciales || "-"}</div>
                <div class="mb-2"><span class="text-muted">Sécurité:</span> ${bt.consignesSecurite || "-"}</div>
                <div class="mb-2"><span class="text-muted">EPI requis:</span> ${epiBadges}</div>
            </div>
        </div>
        <div class="mt-4">
            <div class="fw-semibold mb-2">Liste des pièces à utiliser</div>
            <div class="table-responsive">
                <table class="table table-sm align-middle">
                    <thead>
                        <tr>
                            <th>Article</th>
                            <th>Référence</th>
                            <th>Qté prévue</th>
                            <th>Unité</th>
                            <th>Emplacement stock</th>
                            <th>Stock dispo</th>
                        </tr>
                    </thead>
                    <tbody>${piecesRows}</tbody>
                </table>
            </div>
            <div class="text-muted small">ⓘ Le technicien doit retirer ces pièces au magasin avant de commencer l'intervention.</div>
        </div>
        <div class="mt-4 bt-report-section">
            <div class="fw-semibold mb-3">Rapport d'intervention</div>
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">Date réelle début</label>
                    <input class="form-control" type="date" data-bt-report="dateDebut" value="${bt.dateReelleDebut || ""}" ${isEditable ? "" : "disabled"}>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Heure réelle début</label>
                    <input class="form-control" type="time" data-bt-report="heureDebut" value="${bt.heureReelleDebut || ""}" ${isEditable ? "" : "disabled"}>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Date réelle fin</label>
                    <input class="form-control" type="date" data-bt-report="dateFin" value="${bt.dateReelleFin || ""}" ${isEditable ? "" : "disabled"}>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Heure réelle fin</label>
                    <input class="form-control" type="time" data-bt-report="heureFin" value="${bt.heureReelleFin || ""}" ${isEditable ? "" : "disabled"}>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Durée réelle</label>
                    <input class="form-control" type="text" data-bt-report="duree" value="${bt.dureeReelle || "-"}" readonly>
                </div>
                <div class="col-12">
                    <label class="form-label">Travaux effectués</label>
                    <textarea class="form-control" rows="3" data-bt-report="travaux" ${isEditable ? "" : "disabled"}>${bt.travauxEffectues || ""}</textarea>
                </div>
            </div>
            <div class="mt-3">
                <div class="fw-semibold mb-2">Pièces réellement utilisées</div>
                <div class="table-responsive">
                    <table class="table table-sm align-middle">
                        <thead>
                            <tr>
                                <th>Article</th>
                                <th>Référence</th>
                                <th>Qté prévue</th>
                                <th>Unité</th>
                                <th>Qté réelle</th>
                            </tr>
                        </thead>
                        <tbody>${reportPiecesRows}</tbody>
                    </table>
                </div>
            </div>
            <div class="mt-3">
                <div class="fw-semibold mb-2">Résultat de l'intervention</div>
                <div class="d-flex flex-wrap gap-2">
                    <button class="btn btn-outline-success ${bt.resultat === "RESOLU" ? "active" : ""}" type="button" data-bt-result="RESOLU" ${isEditable ? "" : "disabled"}>✅ Problème résolu</button>
                    <button class="btn btn-outline-warning ${bt.resultat === "PARTIEL" ? "active" : ""}" type="button" data-bt-result="PARTIEL" ${isEditable ? "" : "disabled"}>⚠️ Résolu partiellement</button>
                    <button class="btn btn-outline-secondary ${bt.resultat === "RECIDIVE" ? "active" : ""}" type="button" data-bt-result="RECIDIVE" ${isEditable ? "" : "disabled"}>🔄 Récidive probable</button>
                </div>
            </div>
            <div class="row g-3 mt-1">
                <div class="col-md-6">
                    <label class="form-label">Observations</label>
                    <textarea class="form-control" rows="2" data-bt-report="observations" ${isEditable ? "" : "disabled"}>${bt.observationsTech || ""}</textarea>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Recommandations</label>
                    <textarea class="form-control" rows="2" data-bt-report="recommandations" ${isEditable ? "" : "disabled"}>${bt.recommandationsTech || ""}</textarea>
                </div>
            </div>
            <div class="mt-3 bt-signature-block">
                <div class="row g-3 align-items-center">
                    <div class="col-md-6">
                        <label class="form-label">Nom complet technicien</label>
                        <input class="form-control" type="text" value="${bt.technicienPrincipal || "-"}" readonly>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Date de signature</label>
                        <input class="form-control" type="text" value="${bt.dateSignature || new Date().toLocaleDateString("fr-FR")}" readonly>
                    </div>
                    <div class="col-12">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" data-bt-report="certification" ${bt.statut !== "EN_COURS" ? "disabled" : ""}>
                            <label class="form-check-label">Je certifie avoir effectué les travaux décrits ci-dessus</label>
                        </div>
                    </div>
                </div>
            </div>
            ${bt.statut === "EN_COURS" || bt.statut === "INCOMPLET" ? `<div class="mt-3 text-end"><button class="btn btn-success" data-bt-action="submit-report" data-bt-id="${bt.id}">Soumettre le rapport</button></div>` : ""}
        </div>`;
};

const openBtDetailModal = (btId) => {
    const bt = bonsDeTravail.find((entry) => entry.id === btId);
    const body = document.getElementById("bt-detail-body");
    if (!bt || !body) {
        return;
    }

    body.innerHTML = buildBtDetailBody(bt);
    btDetailContext = { btId };
    updateBtDuration();
    btDetailModal?.show();
};

const printBT = (btId) => {
    const bt = bonsDeTravail.find((entry) => entry.id === btId);
    const printBody = document.getElementById("bt-print-body");
    if (!bt || !printBody || !btPrintable) {
        return;
    }

    const piecesRows = (bt.piecesAttendu ?? [])
        .map((piece) => `
            <tr>
                <td>${piece.nom}</td>
                <td>${piece.ref}</td>
                <td>${piece.qtePrevue}</td>
                <td>${piece.unite}</td>
            </tr>`)
        .join("") || `<tr><td colspan="4">Aucune pièce prévue.</td></tr>`;

    const html = `
        <div class="bt-print-header">
            <div class="fw-bold">GMAO PRO</div>
            <div class="text-center">
                <div class="fw-bold">BON DE TRAVAIL</div>
                <div>Entreprise: Mecatrax</div>
            </div>
            <div>
                <div><strong>N°:</strong> ${bt.numero}</div>
                <div><strong>Date:</strong> ${bt.datePrevue}</div>
            </div>
        </div>
        <hr />
        <div class="mb-2"><strong>OT:</strong> ${bt.otNumero} | <strong>Priorité:</strong> ${renderDiUrgenceBadge(ordresDeTravail.find((ot) => ot.id === bt.otId)?.priorite ?? "NORMALE")}</div>
        <div class="mb-2"><strong>Équipement:</strong> ${bt.equipementNom} (${bt.equipementCode})</div>
        <div class="mb-2"><strong>Localisation:</strong> ${bt.localisation || "-"}</div>
        <div class="mb-3"><strong>Technicien:</strong> ${bt.technicienPrincipal || "-"}</div>
        <div class="mb-3"><strong>TRAVAUX À EFFECTUER:</strong><br/>${bt.travailAFaire || "-"}</div>
        <div class="mb-2"><strong>INSTRUCTIONS SPÉCIALES:</strong><br/>${bt.instructionsSpeciales || "-"}</div>
        <div class="mb-3"><strong>CONSIGNES SÉCURITÉ:</strong><br/>${bt.consignesSecurite || "-"}<br/><strong>EPI:</strong> ${(bt.episRequis ?? []).join(", ") || "-"}</div>
        <div class="mb-3">
            <strong>PIÈCES À UTILISER:</strong>
            <table class="bt-print-table">
                <thead>
                    <tr>
                        <th>Article</th>
                        <th>Référence</th>
                        <th>Qté prévue</th>
                        <th>Unité</th>
                    </tr>
                </thead>
                <tbody>${piecesRows}</tbody>
            </table>
        </div>
        <div class="mb-3">
            <strong>RAPPORT (à remplir par le technicien):</strong>
            <div>Date début: ___________  Fin: ___________</div>
            <div>Durée réelle: ___________</div>
            <div class="mt-2">Travaux effectués:</div>
            <div style="border:1px solid #dee2e6; height:80px; margin-bottom:8px;"></div>
            <div>Résultat: □ Résolu  □ Partiel  □ Récidive</div>
            <div class="mt-2">Pièces utilisées: Article | Qté prévue | Qté réelle</div>
            <div style="border:1px solid #dee2e6; height:60px; margin-bottom:8px;"></div>
            <div>Signature technicien: ___________  Date: ________</div>
        </div>
        <div><strong>Validé par:</strong> ___________   <strong>Date:</strong> ___________</div>`;

    btPrintable.innerHTML = html;
    printBody.innerHTML = html;
    btPrintModal?.show();
};

const updateUrgencyCards = (group) => {
    if (!group) {
        return;
    }
    group.querySelectorAll(".di-urgency-card").forEach((card) => {
        const input = card.querySelector("input");
        card.classList.toggle("active", input?.checked);
    });
};

const buildDiSummaryCard = (di) => `
    <div class="d-flex flex-column gap-1">
        <h6 class="fw-bold mb-1">${di.numero} | ${di.titre}</h6>
        <div><span class="text-muted">Équipement:</span> ${di.equipementNom}</div>
        <div><span class="text-muted">Urgence:</span> ${renderDiUrgenceBadge(di.urgence)}</div>
        <div><span class="text-muted">Demandeur:</span> ${di.demandeur} | ${formatDiDate(di.dateSoumission)}</div>
        <div class="text-muted small mt-1">${di.description}</div>
    </div>`;

const updateDiEquipmentInfo = (equipementId) => {
    const infoCard = document.querySelector("[data-di-equipement-info]");
    const organeSelect = document.querySelector("[data-di-organe]");
    if (!infoCard) {
        return;
    }

    const equip = getEquipmentById(equipementId);
    if (!equip) {
        infoCard.innerHTML = `<div class="text-muted">Sélectionnez un équipement pour afficher les informations.</div>`;
        if (organeSelect) {
            organeSelect.innerHTML = "<option value=\"\">Sélectionner</option>";
        }
        return;
    }

    infoCard.innerHTML = `
        <div class="d-flex align-items-center gap-2 mb-2">
            <i class="fa-solid fa-cog text-primary"></i>
            <div class="fw-semibold">${equip.name} (${equip.tag})</div>
        </div>
        <div class="text-muted">Service: ${getEquipmentService(equip)}</div>
        <div class="text-muted">Criticité: ${getEquipmentCriticite(equip)}</div>`;

    if (organeSelect) {
        const organsForEquip = getOrgansForEquipment(equipementId);
        organeSelect.innerHTML = `<option value="">Sélectionner</option>${organsForEquip.map((org) => `<option value="${org.id}">${org.name}</option>`).join("")}`;
    }
};

const populateDiEquipementSelect = () => {
    const select = document.querySelector("[data-di-equipement]");
    if (!select) {
        return;
    }

    select.innerHTML = `<option value="">Sélectionner</option>${equipment.map((equip) => `<option value="${equip.id}">[${equip.tag}] ${equip.name}</option>`).join("")}`;
};

const openDiForm = (mode, diId) => {
    if (!diForm) {
        return;
    }

    diForm.reset();
    diForm.classList.remove("was-validated");
    populateDiEquipementSelect();
    updateUrgencyCards(diForm.querySelector("[data-di-urgence-group]"));
    const photoPreview = diForm.querySelector("[data-di-photo-preview]");
    if (photoPreview) {
        photoPreview.innerHTML = "";
    }
    const docList = diForm.querySelector("[data-di-doc-list]");
    if (docList) {
        docList.innerHTML = "";
    }

    const today = formatDiDate(new Date());
    const numeroInput = diForm.querySelector("[data-di-field='numero']");
    const demandeurInput = diForm.querySelector("[data-di-field='demandeur']");
    const dateInput = diForm.querySelector("[data-di-field='dateSoumission']");
    const titleElement = document.getElementById("modal-di-title");

    const existing = diId ? demandesIntervention.find((di) => di.id === diId) : null;
    if (numeroInput) {
        numeroInput.value = mode === "create" ? getNextSequence(demandesIntervention, "DI") : existing?.numero ?? "";
    }
    if (demandeurInput) {
        demandeurInput.value = existing?.demandeur ?? diUser.name;
    }
    if (dateInput) {
        dateInput.value = existing ? formatDiDate(existing.dateSoumission) : today;
    }

    diForm.querySelectorAll("[data-di-field]").forEach((input) => {
        const field = input.dataset.diField;
        if (!field || field === "numero" || field === "demandeur" || field === "dateSoumission") {
            return;
        }
        if (input.tagName === "SELECT" || input.tagName === "TEXTAREA" || input.tagName === "INPUT") {
            input.value = existing?.[field] ?? "";
        }
    });

    const urgenceInput = diForm.querySelector(`[name='diUrgence'][value='${existing?.urgence ?? ""}']`);
    if (urgenceInput) {
        urgenceInput.checked = true;
    }
    updateUrgencyCards(diForm.querySelector("[data-di-urgence-group]"));

    const disponibiliteInput = diForm.querySelector(`[name='diDisponibilite'][value='${existing?.disponibiliteEquipement ?? ""}']`);
    if (disponibiliteInput) {
        disponibiliteInput.checked = true;
    }

    const equipementSelect = diForm.querySelector("[data-di-equipement]");
    if (equipementSelect) {
        equipementSelect.value = existing?.equipementId ?? "";
        updateDiEquipmentInfo(equipementSelect.value);
    }

    const organeSelect = diForm.querySelector("[data-di-organe]");
    if (organeSelect && existing?.organeId) {
        organeSelect.value = existing.organeId;
    }

    diFormContext = { mode, diId };
    if (titleElement) {
        titleElement.textContent = mode === "create" ? "Nouvelle Demande d'Intervention" : `Modifier ${existing?.numero ?? "la demande"}`;
    }
    diFormModal?.show();
};

const readDiFormValues = () => {
    if (!diForm) {
        return null;
    }

    if (!diForm.checkValidity()) {
        diForm.classList.add("was-validated");
        return null;
    }

    const values = {};
    diForm.querySelectorAll("[data-di-field]").forEach((input) => {
        const field = input.dataset.diField;
        if (!field || field === "numero" || field === "demandeur" || field === "dateSoumission") {
            return;
        }
        values[field] = input.value;
    });

    values.urgence = diForm.querySelector("[name='diUrgence']:checked")?.value ?? "NORMALE";
    values.disponibiliteEquipement = diForm.querySelector("[name='diDisponibilite']:checked")?.value ?? "EN_SERVICE";

    const equipement = getEquipmentById(values.equipementId);
    values.equipementNom = equipement?.name ?? "";
    values.equipementCode = equipement?.tag ?? "";

    const organe = organs.find((entry) => entry.id === values.organeId);
    values.organeNom = organe?.name ?? "";

    const photoInput = diForm.querySelector("[data-di-photos]");
    values.photos = photoInput?.files?.length
        ? Array.from(photoInput.files).slice(0, 5).map((file) => URL.createObjectURL(file))
        : [];

    const documentInput = diForm.querySelector("[data-di-documents]");
    values.documents = documentInput?.files?.length
        ? Array.from(documentInput.files).map((file) => ({ nom: file.name, type: file.type }))
        : [];

    return values;
};

const saveDiForm = () => {
    const values = readDiFormValues();
    if (!values) {
        return;
    }

    const mode = diFormContext?.mode ?? "create";
    const numero = diForm.querySelector("[data-di-field='numero']")?.value ?? "";
    const demandeur = diForm.querySelector("[data-di-field='demandeur']")?.value ?? diUser.name;
    const dateSoumission = diForm.querySelector("[data-di-field='dateSoumission']")?.value ?? formatDiDate(new Date());

    if (mode === "edit" && diFormContext?.diId) {
        const index = demandesIntervention.findIndex((di) => di.id === diFormContext.diId);
        if (index >= 0) {
            const current = demandesIntervention[index];
            demandesIntervention[index] = {
                ...current,
                ...values,
                photos: values.photos.length ? values.photos : current.photos,
                documents: values.documents.length ? values.documents : current.documents,
                demandeur: current.demandeur,
                dateSoumission: current.dateSoumission
            };
        }
    } else {
        demandesIntervention.unshift({
            id: createId(),
            numero,
            demandeur,
            dateSoumission: new Date().toISOString(),
            statut: "SOUMISE",
            historique: [
                { action: "Soumise", utilisateur: demandeur, date: new Date().toISOString(), commentaire: "" }
            ],
            createdAt: new Date().toISOString(),
            ...values
        });
    }

    renderDiTable();
    diFormModal?.hide();
};

const openDiExamenModal = (diId, decisionPreset = "") => {
    const di = demandesIntervention.find((entry) => entry.id === diId);
    if (!di) {
        return;
    }

    if (di.statut === "SOUMISE") {
        di.statut = "EN_EXAMEN";
        di.historique = di.historique || [];
        di.historique.push({ action: "Mise en examen", utilisateur: diUser.name, date: new Date().toISOString(), commentaire: "" });
    }

    const summary = document.querySelector("[data-di-examen-summary]");
    if (summary) {
        summary.innerHTML = buildDiSummaryCard(di);
    }

    const examinateurInput = diExamenModalElement?.querySelector("[data-di-field='examinateur']");
    const dateInput = diExamenModalElement?.querySelector("[data-di-field='dateExamen']");
    if (examinateurInput) {
        examinateurInput.value = diUser.name;
    }
    if (dateInput) {
        dateInput.value = formatDiDate(new Date());
    }

    const decisionInputs = diExamenModalElement?.querySelectorAll("[name='diDecision']") ?? [];
    decisionInputs.forEach((input) => {
        input.checked = input.value === decisionPreset;
    });

    const prioriteSelect = diExamenModalElement?.querySelector("[data-di-field='prioriteOTSuggeree']");
    if (prioriteSelect) {
        prioriteSelect.value = di.prioriteOTSuggeree ?? di.urgence;
    }
    const typeSelect = diExamenModalElement?.querySelector("[data-di-field='typeMaintenanceSuggeree']");
    if (typeSelect) {
        typeSelect.value = di.typeMaintenanceSuggeree ?? "MC-Corrective";
    }

    const motifInput = diExamenModalElement?.querySelector("[data-di-field='motifRefus']");
    if (motifInput) {
        motifInput.value = "";
    }

    diExamenContext = { diId };
    toggleDecisionFields(decisionPreset);
    renderDiTable();
    diExamenModal?.show();
};

const toggleDecisionFields = (decision) => {
    const acceptSection = diExamenModalElement?.querySelector("[data-di-examen-accept]");
    const refusSection = diExamenModalElement?.querySelector("[data-di-examen-refus]");
    const motifInput = diExamenModalElement?.querySelector("[data-di-field='motifRefus']");

    if (acceptSection) {
        acceptSection.classList.toggle("d-none", decision !== "ACCEPTEE");
    }
    if (refusSection) {
        refusSection.classList.toggle("d-none", decision !== "REFUSEE");
    }
    if (motifInput) {
        motifInput.required = decision === "REFUSEE";
    }
};

const confirmDiDecision = () => {
    if (!diExamenContext?.diId) {
        return;
    }

    const di = demandesIntervention.find((entry) => entry.id === diExamenContext.diId);
    if (!di) {
        return;
    }

    di.historique ??= [];

    const decision = diExamenModalElement?.querySelector("[name='diDecision']:checked")?.value;
    if (!decision) {
        showToast("Veuillez sélectionner une décision.", "warning");
        return;
    }

    const commentaire = diExamenModalElement?.querySelector("[data-di-field='commentaireExaminateur']")?.value ?? "";
    const motifRefus = diExamenModalElement?.querySelector("[data-di-field='motifRefus']")?.value ?? "";
    const priorite = diExamenModalElement?.querySelector("[data-di-field='prioriteOTSuggeree']")?.value ?? di.urgence;
    const typeMaintenance = diExamenModalElement?.querySelector("[data-di-field='typeMaintenanceSuggeree']")?.value ?? "MC-Corrective";

    if (decision === "REFUSEE" && !motifRefus.trim()) {
        showToast("Le motif de refus est requis.", "warning");
        return;
    }

    di.examinateur = diUser.name;
    di.dateExamen = new Date().toISOString();
    di.commentaireExaminateur = commentaire;
    di.decision = decision;

    if (decision === "ACCEPTEE") {
        di.statut = "ACCEPTEE";
        di.prioriteOTSuggeree = priorite;
        di.typeMaintenanceSuggeree = typeMaintenance;
        di.motifRefus = "";
        di.historique.push({ action: "Acceptée", utilisateur: diUser.name, date: di.dateExamen, commentaire });
    }

    if (decision === "REFUSEE") {
        di.statut = "REFUSEE";
        di.motifRefus = motifRefus;
        di.historique.push({ action: "Refusée", utilisateur: diUser.name, date: di.dateExamen, commentaire: motifRefus });
    }

    renderDiTable();
    diExamenModal?.hide();
};

const openDiDetailModal = (diId) => {
    const di = demandesIntervention.find((entry) => entry.id === diId);
    const detailBody = document.getElementById("di-detail-body");
    if (!di || !detailBody) {
        return;
    }

    const currentIndex = diTimelineSteps.indexOf(di.statut);
    const effectiveIndex = currentIndex >= 0 ? currentIndex : diTimelineSteps.indexOf("EN_EXAMEN");
    const timeline = diTimelineSteps
        .map((step, index) => {
            const isActive = index <= effectiveIndex;
            return `<span class="di-timeline-step ${isActive ? "active" : ""}">${diStatusMeta[step].label}</span>`;
        })
        .join("");

    const photos = (di.photos ?? []).map((photo) => `<a href="${photo}" target="_blank"><img src="${photo}" alt="Photo" class="me-2 mb-2" style="width:70px;height:70px;border-radius:8px;object-fit:cover;border:1px solid #dee2e6;"></a>`).join("") || "<div class=\"text-muted\">Aucune photo</div>";
    const documents = (di.documents ?? []).map((doc) => `<li><i class="fa-solid fa-paperclip me-2"></i>${doc.nom}</li>`).join("") || "<li>Aucun document</li>";

    const otLink = di.otCreeeNumero
        ? `<a href="#" data-di-ot-link>→ ${di.otCreeeNumero}: ${ordresDeTravail.find((ot) => ot.id === di.otCreeeId)?.titre ?? "Ordre de travail"}</a>`
        : "-";

    const historyItems = (di.historique ?? []).map((item) => `
        <div class="di-history-item">
            <div class="fw-semibold">${item.action} par ${item.utilisateur}</div>
            <div class="small">${formatDiDateTime(item.date)} ${item.commentaire ? `— ${item.commentaire}` : ""}</div>
        </div>`).join("") || "";

    detailBody.innerHTML = `
        <div class="di-detail-header">
            <div class="d-flex flex-wrap gap-2">
                <span class="badge bg-dark">${di.numero}</span>
                ${renderDiUrgenceBadge(di.urgence)}
                ${renderDiStatusBadge(di.statut)}
                <span class="badge bg-light text-dark">${di.typeIntervention}</span>
            </div>
            <h4 class="fw-bold mt-2">${di.titre}</h4>
            <div class="di-timeline">${timeline}</div>
        </div>
        <div class="row g-4">
            <div class="col-lg-6">
                <div class="fw-semibold mb-2">Problème</div>
                <div class="mb-2"><span class="text-muted">Équipement:</span> ${di.equipementNom} (${di.equipementCode})</div>
                <div class="mb-2"><span class="text-muted">Organe:</span> ${di.organeNom || "-"}</div>
                <div class="mb-2"><span class="text-muted">Disponibilité:</span> ${diDisponibiliteLabels[di.disponibiliteEquipement] ?? "-"}</div>
                <div class="mb-2"><span class="text-muted">Description:</span> ${di.description}</div>
                <div class="mb-2"><span class="text-muted">Symptômes:</span> ${di.symptomes || "-"}</div>
                <div class="mt-3">${photos}</div>
            </div>
            <div class="col-lg-6">
                <div class="fw-semibold mb-2">Suivi</div>
                <div class="mb-2"><span class="text-muted">Demandeur:</span> ${di.demandeur}</div>
                <div class="mb-2"><span class="text-muted">Date soumission:</span> ${formatDiDateTime(di.dateSoumission)}</div>
                <div class="mb-2"><span class="text-muted">Téléphone:</span> ${di.telephoneDemandeur || "-"}</div>
                <div class="mb-2"><span class="text-muted">Examinateur:</span> ${di.examinateur || "-"}</div>
                <div class="mb-2"><span class="text-muted">Date examen:</span> ${di.dateExamen ? formatDiDateTime(di.dateExamen) : "-"}</div>
                <div class="mb-2"><span class="text-muted">Décision:</span> ${di.decision || "-"}</div>
                <div class="mb-2"><span class="text-muted">Motif refus:</span> ${di.motifRefus || "-"}</div>
                <div class="mb-2"><span class="text-muted">Priorité OT suggérée:</span> ${di.prioriteOTSuggeree || "-"}</div>
                <div class="mb-2"><span class="text-muted">Lien OT:</span> ${otLink}</div>
                <div class="mt-3">
                    <div class="fw-semibold">Documents joints</div>
                    <ul class="mb-0">${documents}</ul>
                </div>
            </div>
        </div>
        <div class="di-history">${historyItems}</div>`;

    diDetailModal?.show();
};

const openDiOtModal = (diId) => {
    const di = demandesIntervention.find((entry) => entry.id === diId);
    const form = document.getElementById("form-di-ot");
    if (!di || !form) {
        return;
    }

    form.reset();
    form.classList.remove("was-validated");
    diOtContext = { diId };

    const summary = document.querySelector("[data-di-ot-summary]");
    if (summary) {
        summary.innerHTML = buildDiSummaryCard(di);
    }

    form.querySelector("[data-di-ot-field='numero']").value = getNextSequence(ordresDeTravail, "OT");
    form.querySelector("[data-di-ot-field='titre']").value = di.titre;
    form.querySelector("[data-di-ot-field='typeMaintenance']").value = di.typeMaintenanceSuggeree ?? "";
    form.querySelector("[data-di-ot-field='priorite']").value = di.prioriteOTSuggeree ?? di.urgence;

    const technicienSelect = form.querySelector("[data-di-ot-field='technicien']");
    if (technicienSelect) {
        technicienSelect.innerHTML = `<option value="">Sélectionner</option>${diTechniciens.map((tech) => `<option value="${tech}">${tech}</option>`).join("")}`;
    }

    diOtModal?.show();
};

const confirmDiOtCreation = () => {
    if (!diOtContext?.diId) {
        return;
    }

    const form = document.getElementById("form-di-ot");
    if (!form) {
        return;
    }

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const di = demandesIntervention.find((entry) => entry.id === diOtContext.diId);
    if (!di) {
        return;
    }

    const numero = form.querySelector("[data-di-ot-field='numero']").value;
    const titre = form.querySelector("[data-di-ot-field='titre']").value;
    const typeMaintenance = form.querySelector("[data-di-ot-field='typeMaintenance']").value;
    const priorite = form.querySelector("[data-di-ot-field='priorite']").value;
    const dateDebut = form.querySelector("[data-di-ot-field='dateDebut']").value;
    const dateFin = form.querySelector("[data-di-ot-field='dateFin']").value;
    const technicien = form.querySelector("[data-di-ot-field='technicien']").value;

    const ot = {
        id: createId(),
        numero,
        titre,
        typeMaintenance,
        priorite,
        dateDebutPrevue: dateDebut,
        dateFinPrevue: dateFin,
        technicien,
        statut: "Planifié",
        equipementNom: di.equipementNom,
        diOrigineId: di.id
    };

    ordresDeTravail.unshift(ot);
    di.statut = "CONVERTIE_EN_OT";
    di.otCreeeId = ot.id;
    di.otCreeeNumero = ot.numero;
    di.historique.push({ action: "OT créé", utilisateur: diUser.name, date: new Date().toISOString(), commentaire: ot.numero });

    renderDiTable();
    renderOtTable();
    diOtModal?.hide();
    navigateTo("view-workorders");
    showToast(`✅ ${ot.numero} créé avec succès depuis ${di.numero}`, "success");
};

const archiveDi = (diId) => {
    const di = demandesIntervention.find((entry) => entry.id === diId);
    if (!di) {
        return;
    }
    di.statut = "ARCHIVEE";
    di.historique ??= [];
    di.historique.push({ action: "Archivée", utilisateur: diUser.name, date: new Date().toISOString(), commentaire: "" });
    renderDiTable();
};

const showToast = (message, type = "success") => {
    if (!toastContainer || !bootstrapAvailable) {
        return;
    }
    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>`;
    toastContainer.appendChild(toast);
    const toastInstance = new bootstrap.Toast(toast, { delay: 4000 });
    toastInstance.show();
    toast.addEventListener("hidden.bs.toast", () => toast.remove());
};

document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-di-action]");
    if (!target) {
        return;
    }

    const action = target.dataset.diAction;
    const diId = target.dataset.diId;

    if (action === "create") {
        openDiForm("create");
    }

    if (action === "edit" && diId) {
        openDiForm("edit", diId);
    }

    if (action === "detail" && diId) {
        openDiDetailModal(diId);
    }

    if (action === "examine" && diId) {
        openDiExamenModal(diId);
    }

    if (action === "accept" && diId) {
        openDiExamenModal(diId, "ACCEPTEE");
    }

    if (action === "refuse" && diId) {
        openDiExamenModal(diId, "REFUSEE");
    }

    if (action === "convert" && diId) {
        openDiOtModal(diId);
    }

    if (action === "archive" && diId) {
        archiveDi(diId);
    }

    if (action === "save") {
        saveDiForm();
    }

    if (action === "confirm-decision") {
        confirmDiDecision();
    }

    if (action === "create-ot") {
        confirmDiOtCreation();
    }
});

document.addEventListener("input", (event) => {
    if (event.target.matches("[data-di-search]")) {
        diFilters.search = event.target.value;
        renderDiTable();
    }
});

document.addEventListener("change", (event) => {
    if (event.target.matches("[data-di-filter-urgence]")) {
        diFilters.urgence = event.target.value;
        renderDiTable();
    }
    if (event.target.matches("[data-di-filter-statut]")) {
        diFilters.statut = event.target.value;
        renderDiTable();
    }
    if (event.target.matches("[data-di-equipement]")) {
        updateDiEquipmentInfo(event.target.value);
    }
    if (event.target.matches("[name='diDecision']")) {
        toggleDecisionFields(event.target.value);
    }
});

document.addEventListener("click", (event) => {
    const card = event.target.closest(".di-urgency-card");
    if (!card) {
        return;
    }
    const input = card.querySelector("input");
    if (input) {
        input.checked = true;
        updateUrgencyCards(card.closest("[data-di-urgence-group]"));
    }
});

document.addEventListener("change", (event) => {
    if (event.target.matches("[data-di-photos]")) {
        const preview = document.querySelector("[data-di-photo-preview]");
        if (!preview) {
            return;
        }
        preview.innerHTML = "";
        Array.from(event.target.files ?? []).slice(0, 5).forEach((file) => {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            preview.appendChild(img);
        });
    }
    if (event.target.matches("[data-di-documents]")) {
        const list = document.querySelector("[data-di-doc-list]");
        if (!list) {
            return;
        }
        list.innerHTML = "";
        Array.from(event.target.files ?? []).forEach((file) => {
            const item = document.createElement("div");
            item.className = "file-list-item";
            item.innerHTML = `<i class="fa-solid fa-file"></i><span>${file.name}</span>`;
            list.appendChild(item);
        });
    }
});

document.addEventListener("click", (event) => {
    if (event.target.matches("[data-di-ot-link]")) {
        event.preventDefault();
        navigateTo("view-workorders");
    }
});

document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-ot-action]");
    if (!target) {
        return;
    }

    const action = target.dataset.otAction;
    const otId = target.dataset.otId;
    if (action === "detail" && otId) {
        openOtDetailModal(otId);
    }
});

document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-bt-action]");
    if (!target) {
        return;
    }

    const action = target.dataset.btAction;
    const btId = target.dataset.btId;
    const otId = target.dataset.otId;

    if (action === "generate" && otId) {
        openBtGenerateModal(otId);
    }
    if (action === "generate-confirm") {
        generateBT();
    }
    if (action === "detail" && btId) {
        openBtDetailModal(btId);
    }
    if (action === "remis" && btId) {
        markBTRemis(btId);
        renderBtTable();
    }
    if (action === "start" && btId) {
        startBT(btId);
        renderBtTable();
    }
    if (action === "complete" && btId) {
        openBtDetailModal(btId);
    }
    if (action === "submit-report" && btId) {
        submitBTRapport(btId);
    }
    if (action === "validate" && btId) {
        openBtValidateModal(btId);
    }
    if (action === "validate-confirm") {
        validateBT();
    }
    if (action === "print" && btId) {
        printBT(btId);
    }
    if (action === "print-confirm") {
        window.print();
    }
});

document.addEventListener("change", (event) => {
    if (event.target.matches("[data-bt-filter-statut]")) {
        btFilters.statut = event.target.value;
        renderBtTable();
    }
    if (event.target.matches("[data-bt-filter-tech]")) {
        btFilters.technicien = event.target.value;
        renderBtTable();
    }
    if (event.target.matches("[name='btValidateDecision']")) {
        const wrapper = document.querySelector("[data-bt-validate-motif]");
        if (wrapper) {
            wrapper.classList.toggle("d-none", event.target.value !== "RETOUR");
        }
    }
});

document.addEventListener("input", (event) => {
    if (event.target.matches("[data-bt-search]")) {
        btFilters.search = event.target.value;
        renderBtTable();
    }
    if (event.target.matches("[data-bt-report='dateDebut'], [data-bt-report='heureDebut'], [data-bt-report='dateFin'], [data-bt-report='heureFin']")) {
        updateBtDuration();
    }
});

document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-bt-result]");
    if (!target || target.disabled) {
        return;
    }

    const group = target.closest(".bt-report-section");
    if (!group) {
        return;
    }

    group.querySelectorAll("[data-bt-result]").forEach((button) => button.classList.remove("active"));
    target.classList.add("active");
});

document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.matches("[data-field='photo']")) {
        const preview = target.closest("form")?.querySelector("[data-article-photo-preview]");
        if (!preview) {
            return;
        }

        preview.innerHTML = "";
        const file = target.files?.[0];
        if (file) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            preview.appendChild(img);
        }
    }

    if (target.matches("[data-field='documents']")) {
        const list = target.closest("form")?.querySelector("[data-article-file-list]");
        if (!list) {
            return;
        }

        list.innerHTML = "";
        Array.from(target.files ?? []).forEach((file) => {
            const item = document.createElement("div");
            item.className = "file-list-item";
            item.innerHTML = `<i class="fa-solid fa-file"></i><span>${file.name}</span>`;
            list.appendChild(item);
        });
    }
});

document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.matches("[data-field='photo']")) {
        const preview = target.closest("form")?.querySelector("[data-organe-photo-preview]");
        if (!preview) {
            return;
        }

        preview.innerHTML = "";
        const file = target.files?.[0];
        if (file) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            preview.appendChild(img);
        }
    }

    if (target.matches("[data-field='documents']")) {
        const list = target.closest("form")?.querySelector("[data-organe-file-list]");
        if (!list) {
            return;
        }

        list.innerHTML = "";
        Array.from(target.files ?? []).forEach((file) => {
            const item = document.createElement("div");
            item.className = "file-list-item";
            item.innerHTML = `<i class="fa-solid fa-file"></i><span>${file.name}</span>`;
            list.appendChild(item);
        });
    }
});

if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleSidebar);
}

if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener("click", closeOverlays);
}

renderTree();

document.querySelectorAll("[data-tree-action]").forEach((button) => {
    button.addEventListener("click", () => {
        if (!selectedTreeNode) {
            return;
        }

        const entityKey = selectedTreeNode.dataset.entity;
        const itemId = selectedTreeNode.dataset.id;
        const action = button.dataset.treeAction;

        if (!entityKey || !itemId) {
            return;
        }

        if (action === "edit") {
            const item = entityKey === "company" ? company : getEntityItems(entityKey).find((entry) => entry.id === itemId);
            openFormModal(entityKey, "edit", item);
        }

        if (action === "delete" && entityKey !== "company") {
            openDeleteModal(entityKey, itemId);
        }

        if (action === "add" && entityKey !== "company") {
            const childConfig = Object.values(entityConfigs).find((entry) => entry.parentEntity === entityKey);
            if (!childConfig) {
                return;
            }

            navigateTo(childConfig.viewId);
            openFormModal(childConfig.key, "create", null, itemId);
        }
    });
});

const initBootstrap = () => {
    if (!bootstrapAvailable) {
        return;
    }

    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
        new bootstrap.Tooltip(element);
    });

    document.querySelectorAll(".dropdown-toggle").forEach((element) => {
        new bootstrap.Dropdown(element);
    });
};

const initNavigation = () => {
    const hashView = window.location.hash.replace("#", "");
    if (hashView) {
        navigateTo(hashView);
    } else {
        navigateTo("view-dashboard");
    }
};

if (crudFormSubmit) {
    crudFormSubmit.addEventListener("click", saveForm);
}

if (crudDeleteConfirm) {
    crudDeleteConfirm.addEventListener("click", confirmDelete);
}

window.addEventListener("resize", updateSidebarState);

applyDate();
updateSidebarState();
initBootstrap();
initNavigation();
initOrgModals();
initEquipModals();
initOrganModals();
initArticleModals();
renderAllTables();
renderDiTable();
renderOtTable();
renderBtTable();
populateBtTechnicienFilter();
