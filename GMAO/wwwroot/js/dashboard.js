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
renderAllTables();
