document.addEventListener("DOMContentLoaded", async () => {
  const addProductForm = document.getElementById("add-product-form");
  const vendaForm = document.getElementById("venda-form");

  addProductForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    console.log("Add Product Data:", data); // Debugging

    try {
      const response = await fetch("/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the form.");
    }
  });

  vendaForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    submitVendaForm();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    console.log("Venda Data:", data); // Debugging

    try {
      const response = await fetch("/venda-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the form.");
    }
  });

  async function submitVendaForm() {
    const formData = new FormData(vendaForm);
    const items = [];
    const itemInputs = document.querySelectorAll(
      ".inputs-container-item input"
    );
    const quantityInputs = document.querySelectorAll(
      ".inputs-container-quantity input"
    );

    itemInputs.forEach((itemInput, index) => {
      const quantityInput = quantityInputs[index];
      items.push({
        product_name: itemInput.value,
        quantity: parseInt(quantityInput.value, 10),
      });
    });

    const vendaData = {
      "order-time": formData.get("order-time"),
      "order-address": formData.get("order-address"),
      "order-address-number": formData.get("order-address-number"),
      "method-payment": formData.get("method-payment"),
      "cost-payment": formData.get("cost-payment"),
      items: items,
    };

    console.log("Venda Data:", vendaData);

    try {
      const response = await fetch("/venda-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vendaData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the form.");
    }
  }

  vendaForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    console.log("Form submitted");

    alert("Form submitted!");
  });
});
