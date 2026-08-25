// =====================================================
// GENTLEZ ADMIN DASHBOARD
// ADMIN FUNCTIONALITY
// =====================================================

// =====================================================
// STATE
// =====================================================

let adminUser = JSON.parse(
    localStorage.getItem("adminUser")
) || null;

let products = JSON.parse(
    localStorage.getItem("adminProducts")
) || [
    {
        id: 1,
        name: "Premium T-Shirt",
        category: "Shirts",
        price: 120,
        stock: 45,
        sku: "TSH-001",
        sales: 28
    },
    {
        id: 2,
        name: "Classic Hoodie",
        category: "Hoodies",
        price: 220,
        stock: 32,
        sku: "HOD-001",
        sales: 48
    },
    {
        id: 3,
        name: "Urban Sneakers",
        category: "Shoes",
        price: 350,
        stock: 8,
        sku: "SNK-001",
        sales: 32
    }
];

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    checkAdminAuth();
});

// =====================================================
// AUTHENTICATION
// =====================================================

function checkAdminAuth() {
    if (!adminUser) {
        window.location.href = "auth.html";
    }
}

function logoutAdmin() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("adminUser");
        window.location.href = "auth.html";
    }
}

// =====================================================
// PAGE NAVIGATION
// =====================================================

function showPage(pageName) {
    // Hide all pages
    document
        .querySelectorAll(".page-content")
        .forEach(page => {
            page.classList.remove("active");
        });

    // Remove active class from all nav items
    document
        .querySelectorAll(".nav-item")
        .forEach(item => {
            item.classList.remove("active");
        });

    // Show selected page
    const page = document.getElementById(pageName);
    if (page) {
        page.classList.add("active");
    }

    // Set active nav item
    event.target.classList.add("active");

    // Close sidebar on mobile
    const sidebar = document.getElementById("sidebar");
    if (sidebar.classList.contains("show")) {
        sidebar.classList.remove("show");
    }
}

// =====================================================
// SIDEBAR TOGGLE
// =====================================================

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("show");
}

// =====================================================
// PRODUCTS MANAGEMENT
// =====================================================

function openProductForm() {
    const modal = document.getElementById("productModal");
    modal.classList.add("show");
}

function closeProductForm() {
    const modal = document.getElementById("productModal");
    modal.classList.remove("show");
}

function saveProduct(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const newProduct = {
        id: Date.now(),
        name: formData.get("name") || form.querySelector("input[type='text']").value,
        category: formData.get("category") || form.querySelector("select").value,
        price: parseFloat(form.querySelectorAll("input[type='number']")[0].value),
        stock: parseInt(form.querySelectorAll("input[type='number']")[1].value),
        sku: form.querySelectorAll("input[type='text']")[1].value,
        sales: 0
    };

    products.push(newProduct);
    localStorage.setItem("adminProducts", JSON.stringify(products));

    showToast("✅ Product added successfully!");
    closeProductForm();
    form.reset();
}

function editProduct(id) {
    showToast("✏️ Edit feature coming soon!");
}

function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem("adminProducts", JSON.stringify(products));
        showToast("🗑️ Product deleted!");
    }
}

// =====================================================
// ORDERS MANAGEMENT
// =====================================================

function viewOrder(orderId) {
    showToast(`👀 Viewing order #${orderId}`);
}

// =====================================================
// CUSTOMERS MANAGEMENT
// =====================================================

function viewCustomer(customerId) {
    showToast(`👤 Viewing customer #${customerId}`);
}

// =====================================================
// NOTIFICATIONS
// =====================================================

function showNotifications() {
    showToast("🔔 You have 3 new notifications");
}

// =====================================================
// PROFILE MENU
// ===================================================== 

function toggleProfileMenu() {
    showToast(`👤 ${adminUser?.name || "Admin"} - Profile options coming soon!");
}

// =====================================================
// TOAST NOTIFICATIONS
// =====================================================

let toastTimer;

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// =====================================================
// MODAL CLOSE ON OUTSIDE CLICK
// =====================================================

window.addEventListener("click", (event) => {
    const modal = document.getElementById("productModal");
    if (event.target === modal) {
        closeProductForm();
    }
});

// =====================================================
// CLOSE SIDEBAR ON OUTSIDE CLICK (MOBILE)
// =====================================================

document.addEventListener("click", (event) => {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.querySelector(".menu-toggle");

    if (
        sidebar.classList.contains("show") &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {
        sidebar.classList.remove("show");
    }
});

console.log("✅ Admin Dashboard loaded successfully!");
