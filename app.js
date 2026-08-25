// =====================================================
// GENTLEZ CLOTHING
// STORE + FIREBASE CUSTOMER AUTH
// =====================================================

import {
    auth,
    database,
    RecaptchaVerifier
} from "./firebaseConfig.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    ref,
    set,
    get
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// =====================================================
// PRODUCTS
// =====================================================

const products = [

    {
        id: 1,
        name: "Premium T-Shirt",
        category: "shirts",
        description: "Premium everyday cotton wear.",
        price: 120,
        icon: "👕",
        tag: "NEW"
    },

    {
        id: 2,
        name: "Classic Hoodie",
        category: "hoodies",
        description: "Soft modern everyday hoodie.",
        price: 220,
        icon: "🧥",
        tag: "POPULAR"
    },

    {
        id: 3,
        name: "Urban Sneakers",
        category: "shoes",
        description: "Clean modern street sneakers.",
        price: 350,
        icon: "👟",
        tag: "NEW"
    },

    {
        id: 4,
        name: "Premium Cap",
        category: "accessories",
        description: "Minimal premium finish.",
        price: 80,
        icon: "🧢",
        tag: "HOT"
    },

    {
        id: 5,
        name: "Classic Jeans",
        category: "shirts",
        description: "Comfortable modern fit.",
        price: 190,
        icon: "👖",
        tag: "NEW"
    },

    {
        id: 6,
        name: "Street Jacket",
        category: "hoodies",
        description: "Premium street-style jacket.",
        price: 280,
        icon: "🧥",
        tag: "HOT"
    }

];


// =====================================================
// STATE
// =====================================================

let cart = [];

let currentCategory = "all";

let authMode = "login";

let recaptchaVerifier = null;


// =====================================================
// ELEMENTS
// =====================================================

const productGrid =
    document.getElementById("productGrid");

const productCount =
    document.getElementById("productCount");

const searchInput =
    document.getElementById("searchInput");

const cartCount =
    document.getElementById("cartCount");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const toast =
    document.getElementById("toast");


// =====================================================
// DISPLAY PRODUCTS
// =====================================================

function displayProducts() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const filtered =
        products.filter(product => {

            const matchesCategory =
                currentCategory === "all" ||
                product.category === currentCategory;


            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search);


            return (
                matchesCategory &&
                matchesSearch
            );

        });


    productGrid.innerHTML = "";


    productCount.textContent =
        `${filtered.length} products`;


    filtered.forEach(product => {

        const card =
            document.createElement("article");


        card.className =
            "product-card";


        card.onclick = () =>
            openProduct(product.id);


        card.innerHTML = `

            <div class="product-image">

                <span class="product-tag">
                    ${product.tag}
                </span>

                ${product.icon}

            </div>

            <div class="product-info">

                <div class="product-name">
                    ${product.name}
                </div>

                <div class="product-description">
                    ${product.description}
                </div>

                <div class="product-bottom">

                    <span class="product-price">
                        GH₵${product.price}
                    </span>

                    <button
                        class="add-button"
                        onclick="
                            event.stopPropagation();
                            addToCart(${product.id});
                        ">

                        +

                    </button>

                </div>

            </div>

        `;


        productGrid.appendChild(card);

    });

}


// =====================================================
// SEARCH
// =====================================================

searchInput.addEventListener(
    "input",
    displayProducts
);


// =====================================================
// CATEGORY
// =====================================================

function filterCategory(category, button) {

    currentCategory =
        category;


    document
        .querySelectorAll(".category")
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });


    button.classList.add(
        "active"
    );


    displayProducts();

}


// =====================================================
// PRODUCT DETAILS
// =====================================================

function openProduct(id) {

    const product =
        products.find(
            item => item.id === id
        );


    if (!product) return;


    showToast(
        `${product.name} selected`
    );

}


// =====================================================
// CART
// =====================================================

function addToCart(id) {

    const product =
        products.find(
            item => item.id === id
        );


    if (!product) return;


    cart.push(product);


    updateCart();


    showToast(
        `${product.name} added 🛒`
    );

}


function removeFromCart(index) {

    cart.splice(
        index,
        1
    );


    updateCart();


    showToast(
        "Item removed"
    );

}


function updateCart() {

    cartCount.textContent =
        cart.length;


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div style="
                text-align:center;
                padding:35px 10px;
                color:#718096;
            ">

                <div style="
                    font-size:45px;
                    margin-bottom:10px;
                ">
                    🛒
                </div>

                <strong>
                    Your cart is empty
                </strong>

                <p style="
                    font-size:12px;
                    margin-top:5px;
                ">
                    Add something you love.
                </p>

            </div>

        `;


        cartTotal.textContent =
            "GH₵0";


        return;

    }


    let total = 0;


    cart.forEach(
        (product, index) => {

            total +=
                product.price;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "cart-item";


            item.innerHTML = `

                <div class="cart-item-icon">
                    ${product.icon}
                </div>

                <div class="cart-item-info">

                    <strong>
                        ${product.name}
                    </strong>

                    <span>
                        GH₵${product.price}
                    </span>

                </div>

                <button
                    onclick="
                        removeFromCart(${index})
                    "
                    style="
                        border:none;
                        background:none;
                        font-size:16px;
                        cursor:pointer;
                    ">

                    🗑️

                </button>

            `;


            cartItems.appendChild(
                item
            );

        }
    );


    cartTotal.textContent =
        `GH₵${total}`;

}


// =====================================================
// CART PANEL
// =====================================================

function openCart() {

    document
        .getElementById(
            "cartOverlay"
        )
        .classList.add("show");


    setBottomActive(
        "cartNav"
    );

}


function closeCart(event) {

    if (
        event &&
        event.target !==
        event.currentTarget
    ) {

        return;

    }


    document
        .getElementById(
            "cartOverlay"
        )
        .classList.remove(
            "show"
        );

}


// =====================================================
// ACCOUNT PANEL
// =====================================================

function openAccount() {

    document
        .getElementById(
            "accountOverlay"
        )
        .classList.add(
            "show"
        );


    setBottomActive(
        "accountNav"
    );

}


function closeAccount(event) {

    if (
        event &&
        event.target !==
        event.currentTarget
    ) {

        return;

    }


    document
        .getElementById(
            "accountOverlay"
        )
        .classList.remove(
            "show"
        );

}


// =====================================================
// SHOP
// =====================================================

function scrollToProducts() {

    setBottomActive(
        "shopNav"
    );


    document
        .getElementById(
            "productsSection"
        )
        .scrollIntoView({
            behavior: "smooth"
        });

}


// =====================================================
// BOTTOM NAV
// =====================================================

function setBottomActive(id) {

    document
        .querySelectorAll(
            ".bottom-item"
        )
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });


    const target =
        document.getElementById(id);


    if (target) {

        target.classList.add(
            "active"
        );

    }

}


// =====================================================
// CHECKOUT
// =====================================================

function checkout() {

    if (cart.length === 0) {

        showToast(
            "Your cart is empty"
        );

        return;

    }


    const user =
        auth.currentUser;


    if (!user) {

        showToast(
            "Please login before checkout"
        );


        openAccount();


        return;

    }


    showToast(
        "Checkout system coming next 💳"
    );

}


// =====================================================
// AUTH MODE
// =====================================================

function switchAuthMode() {

    const loginForm =
        document.getElementById(
            "loginForm"
        );

    const registerForm =
        document.getElementById(
            "registerForm"
        );

    const title =
        document.getElementById(
            "authTitle"
        );

    const subtitle =
        document.getElementById(
            "authSubtitle"
        );

    const switchText =
        document.getElementById(
            "authSwitchText"
        );

    const switchButton =
        document.getElementById(
            "authSwitchButton"
        );


    if (
        !loginForm ||
        !registerForm
    ) {

        return;

    }


    if (authMode === "login") {

        authMode =
            "register";


        loginForm.style.display =
            "none";

        registerForm.style.display =
            "flex";


        title.textContent =
            "Create Account";

        subtitle.textContent =
            "Join Gentlez Clothing today.";

        switchText.textContent =
            "Already have an account?";

        switchButton.textContent =
            "Login";

    } else {

        authMode =
            "login";


        loginForm.style.display =
            "flex";

        registerForm.style.display =
            "none";


        title.textContent =
            "Welcome Back";

        subtitle.textContent =
            "Login to your Gentlez Clothing account.";

        switchText.textContent =
            "Don't have an account?";

        switchButton.textContent =
            "Create Account";

    }

}


// =====================================================
// FIREBASE LOGIN
// =====================================================

const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "loginEmail"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;


            try {

                showToast(
                    "Logging in..."
                );


                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                loginForm.reset();


                showToast(
                    "Welcome back 👋"
                );


            } catch (error) {

                console.error(
                    error
                );


                showToast(
                    firebaseAuthError(
                        error
                    )
                );

            }

        }
    );

}


// =====================================================
// FIREBASE REGISTRATION
// =====================================================

const registerForm =
    document.getElementById(
        "registerForm"
    );


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "registerName"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "registerEmail"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "registerPhone"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "registerPassword"
                    )
                    .value;


            const password2 =
                document
                    .getElementById(
                        "registerPassword2"
                    )
                    .value;


            if (
                !name ||
                !email ||
                !phone ||
                !password
            ) {

                showToast(
                    "Please complete all fields"
                );

                return;

            }


            if (
                password !==
                password2
            ) {

                showToast(
                    "Passwords do not match"
                );

                return;

            }


            if (
                password.length < 6
            ) {

                showToast(
                    "Password must be at least 6 characters"
                );

                return;

            }


            try {

                showToast(
                    "Creating account..."
                );


                /*
                 * Firebase Authentication
                 * securely handles the password.
                 */

                const credential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    credential.user;


                await updateProfile(
                    user,
                    {
                        displayName:
                            name
                    }
                );


                /*
                 * Store profile information.
                 *
                 * NEVER store the password here.
                 */

                await set(
                    ref(
                        database,
                        `users/${user.uid}`
                    ),
                    {
                        name:
                            name,

                        phone:
                            phone,

                        email:
                            email,

                        role:
                            "customer",

                        createdAt:
                            Date.now()
                    }
                );


                registerForm.reset();


                showToast(
                    "Account created 🎉"
                );


            } catch (error) {

                console.error(
                    error
                );


                showToast(
                    firebaseAuthError(
                        error
                    )
                );

            }

        }
    );

}


// =====================================================
// AUTH STATE
// =====================================================

onAuthStateChanged(
    auth,
    async user => {

        if (user) {

            await updateCustomerUI(
                user
            );

        } else {

            showLoggedOutUI();

        }

    }
);


// =====================================================
// CUSTOMER UI
// =====================================================

async function updateCustomerUI(user) {

    const loginForm =
        document.getElementById(
            "loginForm"
        );

    const registerForm =
        document.getElementById(
            "registerForm"
        );

    const loggedInPanel =
        document.getElementById(
            "loggedInPanel"
        );

    const title =
        document.getElementById(
            "authTitle"
        );

    const subtitle =
        document.getElementById(
            "authSubtitle"
        );

    const switchText =
        document.getElementById(
            "authSwitchText"
        );

    const switchButton =
        document.getElementById(
            "authSwitchButton"
        );

    const customerName =
        document.getElementById(
            "customerName"
        );

    const customerPhone =
        document.getElementById(
            "customerPhone"
        );


    if (loginForm)
        loginForm.style.display =
            "none";


    if (registerForm)
        registerForm.style.display =
            "none";


    if (loggedInPanel)
        loggedInPanel.style.display =
            "block";


    if (title)
        title.textContent =
            "Your Account";


    if (subtitle)
        subtitle.textContent =
            "You are signed in.";


    if (switchText)
        switchText.style.display =
            "none";


    if (switchButton)
        switchButton.style.display =
            "none";


    if (customerName)
        customerName.textContent =
            user.displayName ||
            "Customer";


    try {

        const snapshot =
            await get(
                ref(
                    database,
                    `users/${user.uid}`
                )
            );


        if (
            snapshot.exists()
        ) {

            const data =
                snapshot.val();


            if (customerName) {

                customerName.textContent =
                    data.name ||
                    user.displayName ||
                    "Customer";

            }


            if (customerPhone) {

                customerPhone.textContent =
                    data.phone ||
                    "Phone not available";

            }

        }

    } catch (error) {

        console.error(
            "Profile error:",
            error
        );

    }

}


// =====================================================
// LOGGED OUT UI
// =====================================================

function showLoggedOutUI() {

    const loginForm =
        document.getElementById(
            "loginForm"
        );

    const registerForm =
        document.getElementById(
            "registerForm"
        );

    const loggedInPanel =
        document.getElementById(
            "loggedInPanel"
        );

    const title =
        document.getElementById(
            "authTitle"
        );

    const subtitle =
        document.getElementById(
            "authSubtitle"
        );

    const switchText =
        document.getElementById(
            "authSwitchText"
        );

    const switchButton =
        document.getElementById(
            "authSwitchButton"
        );


    if (loginForm)
        loginForm.style.display =
            "flex";


    if (registerForm)
        registerForm.style.display =
            "none";


    if (loggedInPanel)
        loggedInPanel.style.display =
            "none";


    if (title)
        title.textContent =
            "Welcome Back";


    if (subtitle)
        subtitle.textContent =
            "Login to your Gentlez Clothing account.";


    if (switchText) {

        switchText.style.display =
            "inline";

        switchText.textContent =
            "Don't have an account?";

    }


    if (switchButton) {

        switchButton.style.display =
            "inline";

        switchButton.textContent =
            "Create Account";

    }

}


// =====================================================
// LOGOUT
// =====================================================

async function logoutCustomer() {

    try {

        await signOut(
            auth
        );


        showToast(
            "Logged out successfully"
        );


    } catch (error) {

        console.error(
            error
        );


        showToast(
            "Could not log out"
        );

    }

}


// =====================================================
// FIREBASE ERROR MESSAGES
// =====================================================

function firebaseAuthError(error) {

    switch (error.code) {

        case "auth/email-already-in-use":

            return "This email is already registered.";

        case "auth/invalid-email":

            return "Please enter a valid email.";

        case "auth/weak-password":

            return "Password must be at least 6 characters.";

        case "auth/invalid-credential":

            return "Incorrect email or password.";

        case "auth/user-not-found":

            return "Account not found.";

        case "auth/wrong-password":

            return "Incorrect password.";

        case "auth/too-many-requests":

            return "Too many attempts. Try again later.";

        default:

            return "Authentication failed. Please try again.";

    }

}


// =====================================================
// TOAST
// =====================================================

let toastTimer;


function showToast(message) {

    if (!toast) return;


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


// =====================================================
// MAKE HTML onclick FUNCTIONS GLOBAL
// =====================================================

window.filterCategory =
    filterCategory;

window.addToCart =
    addToCart;

window.removeFromCart =
    removeFromCart;

window.openCart =
    openCart;

window.closeCart =
    closeCart;

window.openAccount =
    openAccount;

window.closeAccount =
    closeAccount;

window.scrollToProducts =
    scrollToProducts;

window.checkout =
    checkout;

window.switchAuthMode =
    switchAuthMode;

window.logoutCustomer =
    logoutCustomer;


// =====================================================
// START
// =====================================================

displayProducts();

updateCart();    document.getElementById("registerForm");

const authTitle =
    document.getElementById("authTitle");

const authSubtitle =
    document.getElementById("authSubtitle");

const authSwitchText =
    document.getElementById("authSwitchText");

const authSwitchButton =
    document.getElementById("authSwitchButton");

const loggedInPanel =
    document.getElementById("loggedInPanel");

const customerName =
    document.getElementById("customerName");

const customerPhone =
    document.getElementById("customerPhone");


/* ================= SWITCH LOGIN / REGISTER ================= */

function switchAuthMode() {

    if (authMode === "login") {

        authMode = "register";

        loginForm.style.display = "none";
        registerForm.style.display = "flex";

        authTitle.textContent =
            "Create Account";

        authSubtitle.textContent =
            "Join Gentlez Clothing today.";

        authSwitchText.textContent =
            "Already have an account?";

        authSwitchButton.textContent =
            "Login";

    } else {

        authMode = "login";

        loginForm.style.display = "flex";
        registerForm.style.display = "none";

        authTitle.textContent =
            "Welcome Back";

        authSubtitle.textContent =
            "Login to your Gentlez Clothing account.";

        authSwitchText.textContent =
            "Don't have an account?";

        authSwitchButton.textContent =
            "Create Account";

    }

}


/* ================= REGISTER ================= */

registerForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const name =
            document
                .getElementById("registerName")
                .value
                .trim();

        const email =
            document
                .getElementById("registerEmail")
                .value
                .trim();

        const phone =
            document
                .getElementById("registerPhone")
                .value
                .trim();

        const password =
            document
                .getElementById("registerPassword")
                .value;

        const password2 =
            document
                .getElementById("registerPassword2")
                .value;


        if (password !== password2) {

            showToast(
                "Passwords do not match"
            );

            return;

        }


        if (!phone) {

            showToast(
                "Phone number is required"
            );

            return;

        }


        try {

            showToast(
                "Creating account..."
            );


            /*
             * Firebase handles the password.
             * We NEVER save the password
             * inside Realtime Database.
             */

            const credential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                credential.user;


            /*
             * Set Firebase Auth display name.
             */

            await updateProfile(
                user,
                {
                    displayName: name
                }
            );


            /*
             * Save customer profile.
             */

            await set(
                ref(
                    database,
                    `users/${user.uid}`
                ),
                {
                    name: name,
                    phone: phone,
                    email: email,
                    role: "customer",
                    createdAt:
                        Date.now()
                }
            );


            showToast(
                "Account created successfully 🎉"
            );


            registerForm.reset();


            updateCustomerUI(user);


        } catch (error) {

            console.error(error);

            showToast(
                firebaseAuthError(error)
            );

        }

    }
);


/* ================= LOGIN ================= */

loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim();

        const password =
            document
                .getElementById("loginPassword")
                .value;


        try {

            showToast(
                "Logging in..."
            );


            const credential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            loginForm.reset();


            updateCustomerUI(
                credential.user
            );


            showToast(
                "Welcome back 👋"
            );


        } catch (error) {

            console.error(error);

            showToast(
                firebaseAuthError(error)
            );

        }

    }
);


/* ================= AUTH STATE ================= */

onAuthStateChanged(
    auth,
    async function(user) {

        if (user) {

            updateCustomerUI(user);

        } else {

            showLoggedOutUI();

        }

    }
);


/* ================= CUSTOMER UI ================= */

async function updateCustomerUI(user) {

    loginForm.style.display =
        "none";

    registerForm.style.display =
        "none";

    loggedInPanel.style.display =
        "block";

    authTitle.textContent =
        "Your Account";

    authSubtitle.textContent =
        "You are signed in.";

    authSwitchText.style.display =
        "none";

    authSwitchButton.style.display =
        "none";


    customerName.textContent =
        user.displayName ||
        "Customer";


    try {

        const snapshot =
            await get(
                ref(
                    database,
                    `users/${user.uid}`
                )
            );


        if (snapshot.exists()) {

            const data =
                snapshot.val();


            customerName.textContent =
                data.name ||
                user.displayName ||
                "Customer";


            customerPhone.textContent =
                data.phone ||
                "Phone not available";

        }

    } catch (error) {

        console.error(
            "Could not load customer profile:",
            error
        );

    }

}


/* ================= LOGGED OUT UI ================= */

function showLoggedOutUI() {

    authMode = "login";

    loginForm.style.display =
        "flex";

    registerForm.style.display =
        "none";

    loggedInPanel.style.display =
        "none";

    authTitle.textContent =
        "Welcome Back";

    authSubtitle.textContent =
        "Login to your Gentlez Clothing account.";

    authSwitchText.style.display =
        "inline";

    authSwitchButton.style.display =
        "inline";

    authSwitchText.textContent =
        "Don't have an account?";

    authSwitchButton.textContent =
        "Create Account";

}


/* ================= LOGOUT ================= */

async function logoutCustomer() {

    try {

        await signOut(auth);

        showToast(
            "Logged out successfully"
        );

    } catch (error) {

        console.error(error);

        showToast(
            "Could not log out"
        );

    }

}


/* ================= FIREBASE ERRORS ================= */

function firebaseAuthError(error) {

    switch (error.code) {

        case "auth/email-already-in-use":
            return "This email is already registered.";

        case "auth/invalid-email":
            return "Please enter a valid email.";

        case "auth/weak-password":
            return "Password must be at least 6 characters.";

        case "auth/invalid-credential":
            return "Incorrect email or password.";

        case "auth/user-not-found":
            return "Account not found.";

        case "auth/wrong-password":
            return "Incorrect password.";

        case "auth/too-many-requests":
            return "Too many attempts. Try again later.";

        default:
            return "Authentication failed. Please try again.";

    }
}
/* =====================================================
   PRODUCTS
   ===================================================== */

const products = [

    {
        id: 1,
        name: "Premium T-Shirt",
        category: "shirts",
        description: "Premium everyday cotton wear.",
        longDescription:
            "A comfortable premium T-shirt designed for everyday wear. Clean styling makes it easy to pair with different outfits.",
        price: 120,
        icon: "👕",
        tag: "NEW",
        rating: 5,
        sizes: ["S", "M", "L", "XL"]
    },

    {
        id: 2,
        name: "Classic Hoodie",
        category: "hoodies",
        description: "Soft modern everyday hoodie.",
        longDescription:
            "A soft and comfortable hoodie with a clean modern appearance. Perfect for casual everyday outfits.",
        price: 220,
        icon: "🧥",
        tag: "POPULAR",
        rating: 5,
        sizes: ["S", "M", "L", "XL"]
    },

    {
        id: 3,
        name: "Urban Sneakers",
        category: "shoes",
        description: "Clean modern street sneakers.",
        longDescription:
            "Modern street-style sneakers designed for a clean and versatile look.",
        price: 350,
        icon: "👟",
        tag: "NEW",
        rating: 5,
        sizes: ["39", "40", "41", "42", "43", "44"]
    },

    {
        id: 4,
        name: "Premium Cap",
        category: "accessories",
        description: "Minimal premium finish.",
        longDescription:
            "A simple premium cap with a clean finish that works with many different outfits.",
        price: 80,
        icon: "🧢",
        tag: "HOT",
        rating: 5,
        sizes: ["FREE"]
    },

    {
        id: 5,
        name: "Classic Jeans",
        category: "shirts",
        description: "Comfortable modern fit.",
        longDescription:
            "Classic jeans with a comfortable modern fit for everyday use.",
        price: 190,
        icon: "👖",
        tag: "NEW",
        rating: 5,
        sizes: ["28", "30", "32", "34", "36"]
    },

    {
        id: 6,
        name: "Street Jacket",
        category: "hoodies",
        description: "Premium street-style jacket.",
        longDescription:
            "A stylish street jacket with a modern silhouette and premium look.",
        price: 280,
        icon: "🧥",
        tag: "HOT",
        rating: 5,
        sizes: ["S", "M", "L", "XL"]
    }

];


/* =====================================================
   STATE
   ===================================================== */

let cart =
    JSON.parse(
        localStorage.getItem("gentlezCart")
    ) || [];

let favourites =
    JSON.parse(
        localStorage.getItem("gentlezFavourites")
    ) || [];

let currentCategory = "all";

let selectedProduct = null;

let selectedSize = null;

let selectedQuantity = 1;


/* =====================================================
   ELEMENTS
   ===================================================== */

const productGrid =
    document.getElementById("productGrid");

const productCount =
    document.getElementById("productCount");

const searchInput =
    document.getElementById("searchInput");

const cartCount =
    document.getElementById("cartCount");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const toast =
    document.getElementById("toast");


/* =====================================================
   SAVE STATE
   ===================================================== */

function saveCart() {

    localStorage.setItem(
        "gentlezCart",
        JSON.stringify(cart)
    );

}


function saveFavourites() {

    localStorage.setItem(
        "gentlezFavourites",
        JSON.stringify(favourites)
    );

}


/* =====================================================
   DISPLAY PRODUCTS
   ===================================================== */

function displayProducts() {

    if (!productGrid) return;


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const filtered =
        products.filter(product => {

            const matchesCategory =
                currentCategory === "all" ||
                product.category === currentCategory;


            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search);


            return (
                matchesCategory &&
                matchesSearch
            );

        });


    productGrid.innerHTML = "";


    productCount.textContent =
        `${filtered.length} products`;


    if (filtered.length === 0) {

        productGrid.innerHTML = `

            <div class="empty-products">

                <div class="empty-products-icon">
                    🔎
                </div>

                <strong>
                    No products found
                </strong>

                <span>
                    Try another search.
                </span>

            </div>

        `;

        return;
    }


    filtered.forEach(product => {

        const card =
            document.createElement("article");


        card.className =
            "product-card";


        card.innerHTML = `

            <div
                class="product-image"
                onclick="openProductDetails(${product.id})">

                <span class="product-tag">
                    ${product.tag}
                </span>

                ${product.icon}

            </div>


            <div class="product-info">

                <div
                    class="product-name"
                    onclick="openProductDetails(${product.id})">

                    ${product.name}

                </div>


                <div class="product-description">

                    ${product.description}

                </div>


                <div class="product-bottom">

                    <span class="product-price">

                        GH₵${product.price}

                    </span>


                    <button
                        class="add-button"
                        onclick="event.stopPropagation(); addToCart(${product.id})">

                        +

                    </button>

                </div>

            </div>

        `;


        card.addEventListener(
            "click",
            function(event) {

                if (
                    event.target.closest(".add-button")
                ) {
                    return;
                }

                openProductDetails(product.id);

            }
        );


        productGrid.appendChild(card);

    });

}


/* =====================================================
   SEARCH
   ===================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        displayProducts
    );

}


/* =====================================================
   CATEGORY
   ===================================================== */

function filterCategory(
    category,
    button
) {

    currentCategory =
        category;


    document
        .querySelectorAll(".category")
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });


    if (button) {

        button.classList.add(
            "active"
        );

    }


    displayProducts();

}


/* =====================================================
   PRODUCT DETAILS
   ===================================================== */

function openProductDetails(id) {

    const product =
        products.find(
            item => item.id === id
        );


    if (!product) return;


    selectedProduct =
        product;


    selectedQuantity =
        1;


    selectedSize =
        product.sizes
            ? product.sizes[0]
            : null;


    renderProductDetails();

}


function renderProductDetails() {

    if (!selectedProduct) return;


    const product =
        selectedProduct;


    let sizeButtons = "";


    if (product.sizes) {

        sizeButtons =
            product.sizes
                .map(size => `

                    <button
                        class="detail-size ${
                            size === selectedSize
                                ? "selected"
                                : ""
                        }"
                        onclick="selectProductSize('${size}')">

                        ${size}

                    </button>

                `)
                .join("");

    }


    const isFavourite =
        favourites.includes(
            product.id
        );


    const overlay =
        document.createElement("div");


    overlay.id =
        "productDetailsOverlay";


    overlay.className =
        "product-details-overlay";


    overlay.innerHTML = `

        <div
            class="product-details-screen">


            <div class="details-topbar">

                <button
                    class="details-back"
                    onclick="closeProductDetails()">

                    ←

                </button>


                <button
                    class="details-favourite ${
                        isFavourite
                            ? "active"
                            : ""
                    }"
                    onclick="toggleFavourite(${product.id})">

                    ${isFavourite ? "♥" : "♡"}

                </button>

            </div>


            <div class="details-image">

                <span class="details-tag">

                    ${product.tag}

                </span>


                <span class="details-product-icon">

                    ${product.icon}

                </span>

            </div>


            <div class="details-content">

                <h2>
                    ${product.name}
                </h2>


                <div class="details-rating">

                    <span>
                        ★★★★★
                    </span>

                    <small>
                        ${product.rating}.0
                    </small>

                </div>


                <div class="details-price">

                    GH₵${product.price}

                </div>


                <p class="details-description">

                    ${product.longDescription}

                </p>


                <div class="details-section">

                    <h3>
                        Select Size
                    </h3>


                    <div class="details-sizes">

                        ${sizeButtons}

                    </div>

                </div>


                <div class="details-section">

                    <h3>
                        Select Quantity
                    </h3>


                    <div class="quantity-control">

                        <button
                            onclick="changeProductQuantity(-1)">

                            −

                        </button>


                        <span
                            id="detailQuantity">

                            ${selectedQuantity}

                        </span>


                        <button
                            onclick="changeProductQuantity(1)">

                            +

                        </button>

                    </div>

                </div>


                <button
                    class="details-add-cart"
                    onclick="addSelectedProductToCart()">

                    🛒 Add to Cart

                </button>

            </div>

        </div>

    `;


    overlay.addEventListener(
        "click",
        function(event) {

            if (
                event.target === overlay
            ) {

                closeProductDetails();

            }

        }
    );


    document.body.appendChild(
        overlay
    );


    requestAnimationFrame(() => {

        overlay.classList.add(
            "show"
        );

    });


    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   CLOSE PRODUCT DETAILS
   ===================================================== */

function closeProductDetails() {

    const overlay =
        document.getElementById(
            "productDetailsOverlay"
        );


    if (!overlay) return;


    overlay.classList.remove(
        "show"
    );


    setTimeout(() => {

        overlay.remove();

        document.body.style.overflow =
            "";

    }, 220);

}


/* =====================================================
   SIZE
   ===================================================== */

function selectProductSize(size) {

    selectedSize =
        size;


    renderProductDetails();

}


/* =====================================================
   PRODUCT QUANTITY
   ===================================================== */

function changeProductQuantity(change) {

    selectedQuantity +=
        change;


    if (
        selectedQuantity < 1
    ) {

        selectedQuantity = 1;

    }


    if (
        selectedQuantity > 99
    ) {

        selectedQuantity = 99;

    }


    const quantity =
        document.getElementById(
            "detailQuantity"
        );


    if (quantity) {

        quantity.textContent =
            selectedQuantity;

    }

}


/* =====================================================
   ADD SELECTED PRODUCT
   ===================================================== */

function addSelectedProductToCart() {

    if (!selectedProduct) {
        return;
    }


    const product =
        selectedProduct;


    const existing =
        cart.find(item =>
            item.productId === product.id &&
            item.size === selectedSize
        );


    if (existing) {

        existing.quantity +=
            selectedQuantity;

    } else {

        cart.push({

            cartId:
                Date.now() +
                Math.random(),

            productId:
                product.id,

            name:
                product.name,

            price:
                product.price,

            icon:
                product.icon,

            size:
                selectedSize,

            quantity:
                selectedQuantity

        });

    }


    saveCart();

    updateCart();


    showToast(
        `${product.name} added 🛒`
    );


    closeProductDetails();

}


/* =====================================================
   ADD DIRECTLY TO CART
   ===================================================== */

function addToCart(id) {

    const product =
        products.find(
            item => item.id === id
        );


    if (!product) return;


    const defaultSize =
        product.sizes
            ? product.sizes[0]
            : null;


    const existing =
        cart.find(item =>
            item.productId === product.id &&
            item.size === defaultSize
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            cartId:
                Date.now() +
                Math.random(),

            productId:
                product.id,

            name:
                product.name,

            price:
                product.price,

            icon:
                product.icon,

            size:
                defaultSize,

            quantity:
                1

        });

    }


    saveCart();

    updateCart();


    showToast(
        `${product.name} added 🛒`
    );

}


/* =====================================================
   UPDATE CART
   ===================================================== */

function updateCart() {

    if (!cartCount) return;


    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    cartCount.textContent =
        count;


    if (!cartItems) return;


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div style="
                text-align:center;
                padding:35px 10px;
                color:#718096;
            ">

                <div style="
                    font-size:45px;
                    margin-bottom:10px;
                ">
                    🛒
                </div>

                <strong>
                    Your cart is empty
                </strong>

                <p style="
                    font-size:12px;
                    margin-top:5px;
                ">
                    Add something you love.
                </p>

            </div>

        `;


        cartTotal.textContent =
            "GH₵0";


        return;

    }


    let total = 0;


    cart.forEach(item => {

        const itemTotal =
            item.price *
            item.quantity;


        total +=
            itemTotal;


        const element =
            document.createElement(
                "div"
            );


        element.className =
            "cart-item";


        element.innerHTML = `

            <div class="cart-item-icon">

                ${item.icon}

            </div>


            <div class="cart-item-info">

                <strong>

                    ${item.name}

                </strong>


                <span>

                    GH₵${item.price}

                    ${
                        item.size
                            ? ` • Size ${item.size}`
                            : ""
                    }

                </span>


                <div style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                    margin-top:7px;
                ">

                    <button
                        onclick="changeCartQuantity('${item.cartId}', -1)"
                        style="
                            width:28px;
                            height:28px;
                            border:none;
                            border-radius:8px;
                            background:#eef5fa;
                            cursor:pointer;
                            font-size:16px;
                        ">

                        −

                    </button>


                    <strong
                        style="
                            min-width:18px;
                            text-align:center;
                        ">

                        ${item.quantity}

                    </strong>


                    <button
                        onclick="changeCartQuantity('${item.cartId}', 1)"
                        style="
                            width:28px;
                            height:28px;
                            border:none;
                            border-radius:8px;
                            background:#eef5fa;
                            cursor:pointer;
                            font-size:16px;
                        ">

                        +

                    </button>

                </div>

            </div>


            <div style="
                display:flex;
                flex-direction:column;
                align-items:flex-end;
                gap:8px;
            ">

                <strong style="
                    color:#087cff;
                    font-size:12px;
                ">

                    GH₵${itemTotal}

                </strong>


                <button
                    onclick="removeFromCart('${item.cartId}')"
                    style="
                        border:none;
                        background:none;
                        font-size:16px;
                        cursor:pointer;
                    ">

                    🗑️

                </button>

            </div>

        `;


        cartItems.appendChild(
            element
        );

    });


    cartTotal.textContent =
        `GH₵${total}`;

}


/* =====================================================
   CART QUANTITY
   ===================================================== */

function changeCartQuantity(
    cartId,
    change
) {

    const item =
        cart.find(
            product =>
                String(product.cartId) ===
                String(cartId)
        );


    if (!item) return;


    item.quantity +=
        change;


    if (
        item.quantity <= 0
    ) {

        cart =
            cart.filter(
                product =>
                    String(product.cartId) !==
                    String(cartId)
            );

    }


    saveCart();

    updateCart();

}


/* =====================================================
   REMOVE CART
   ===================================================== */

function removeFromCart(
    cartId
) {

    cart =
        cart.filter(
            item =>
                String(item.cartId) !==
                String(cartId)
        );


    saveCart();

    updateCart();


    showToast(
        "Item removed"
    );

}


/* =====================================================
   OPEN CART
   ===================================================== */

function openCart() {

    document
        .getElementById("cartOverlay")
        .classList.add("show");


    setBottomActive(
        "cartNav"
    );

}


/* =====================================================
   CLOSE CART
   ===================================================== */

function closeCart(event) {

    if (
        event &&
        event.target !== event.currentTarget
    ) {

        return;

    }


    document
        .getElementById("cartOverlay")
        .classList.remove("show");

}


/* =====================================================
   FAVOURITES
   ===================================================== */

function toggleFavourite(id) {

    const index =
        favourites.indexOf(id);


    if (index === -1) {

        favourites.push(id);

        showToast(
            "Added to favourites ❤️"
        );

    } else {

        favourites.splice(
            index,
            1
        );

        showToast(
            "Removed from favourites"
        );

    }


    saveFavourites();


    if (
        selectedProduct &&
        selectedProduct.id === id
    ) {

        renderProductDetails();

    }

}


/* =====================================================
   ACCOUNT
   ===================================================== */

function openAccount() {

    document
        .getElementById("accountOverlay")
        .classList.add("show");


    setBottomActive(
        "accountNav"
    );

}


function closeAccount(event) {

    if (
        event &&
        event.target !== event.currentTarget
    ) {

        return;

    }


    document
        .getElementById("accountOverlay")
        .classList.remove("show");

}


/* =====================================================
   SHOP
   ===================================================== */

function scrollToProducts() {

    setBottomActive(
        "shopNav"
    );


    const section =
        document.getElementById(
            "productsSection"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =====================================================
   NAVIGATION
   ===================================================== */

function setBottomActive(id) {

    document
        .querySelectorAll(".bottom-item")
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });


    const active =
        document.getElementById(id);


    if (active) {

        active.classList.add(
            "active"
        );

    }

}


/* =====================================================
   CHECKOUT
   ===================================================== */

function checkout() {

    if (cart.length === 0) {

        showToast(
            "Your cart is empty"
        );

        return;

    }


    /*
       Firebase authentication and
       order creation will be connected here.

       For now we verify that the
       customer has something in the cart.
    */


    showToast(
        "Checkout is ready for Firebase 🔥"
    );

}


/* =====================================================
   TOAST
   ===================================================== */

let toastTimer;


function showToast(message) {

    if (!toast) return;


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2200);

}


/* =====================================================
   ESC KEY
   ===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeProductDetails();

            document
                .getElementById(
                    "cartOverlay"
                )
                ?.classList.remove(
                    "show"
                );

            document
                .getElementById(
                    "accountOverlay"
                )
                ?.classList.remove(
                    "show"
                );

        }

    }
);


/* =====================================================
   INITIALIZE
   ===================================================== */

displayProducts();

updateCart();

console.log(
    "Gentlez Clothing Store loaded successfully."
);
