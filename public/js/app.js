let cartId = localStorage.getItem("cartId");

if (!cartId) {
    fetch("/api/carts", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            cartId = data.cartId;
            localStorage.setItem("cartId", cartId);
        });
}

const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
        const productId = btn.dataset.id;
        if (!cartId) return alert("Carrito no disponible aún");

        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, { method: "POST" });

            if (response.ok) {
                const toast = document.getElementById("toast") || document.createElement("div");
                toast.textContent = "Producto agregado al carrito";
                toast.className = "toast show";
                document.body.appendChild(toast);

                setTimeout(() => {
                    toast.classList.remove("show");
                    toast.remove();
                }, 1500);
            } else {
                console.error("No se pudo agregar al carrito");
            }
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
        }
    });
});

const detailBtn = document.querySelector(".product-detail-container .add-to-cart");
if (detailBtn) {
    const toastDetail = document.querySelector("#toast-detail");
    detailBtn.addEventListener("click", () => {
        toastDetail.classList.add("show");
        setTimeout(() => toastDetail.classList.remove("show"), 1500);
    });
}
