document.addEventListener("DOMContentLoaded", () => {
  const addProductForm = document.getElementById("add-product-form");
  const vendaForm = document.getElementById("venda-form");
  const btnAddItem = document.querySelector(".btn-add-item");
  const toggleOrderTypeBtn = document.getElementById("toggle-order-type");
  const orderTypeInput = document.getElementById("order-type");
  const inputsAddress = document.querySelector(".comanda-address-container");
  const inputAddress = document.querySelector(".input-address");
  const inputAddressNumber = document.querySelector(".input-address-number");
  const inputNeighbourhood = document.querySelector(".input-neighbourhood");

  toggleOrderTypeBtn.addEventListener("click", function () {
    if (orderTypeInput.value === "Entrega") {
      orderTypeInput.value = "Balcão";
      toggleOrderTypeBtn.innerText = "Balcão";

      inputsAddress.style.display = "none";
      inputNeighbourhood.style.display = "none";

      const arrayInputs = [
        inputAddress,
        inputAddressNumber,
        inputNeighbourhood,
      ];
      arrayInputs.forEach((input) => {
        input.value = "";
      });
    } else {
      orderTypeInput.value = "Entrega";
      toggleOrderTypeBtn.innerText = "Entrega";

      inputsAddress.style.display = "block";
      inputNeighbourhood.style.display = "block";
    }
  });

  addProductForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    console.log("Add Product Data:", data);

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

  function formatDateInput(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, "");

    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + "/" + value.slice(5);

    input.value = value;
  }

  const dateInput = document.querySelector(".input-order-date");
  dateInput.addEventListener("input", formatDateInput);
  const dateFuncionarioInput = document.querySelectorAll(
    ".input-funcionario-data"
  );
  dateFuncionarioInput.forEach((input) => {
    input.addEventListener("input", formatDateInput);
  });
  const dateFechamentoInput = document.querySelector(".input-fechamento-date");
  dateFechamentoInput.addEventListener("input", formatDateInput);

  if (vendaForm) {
    console.log("vendaForm found");

    vendaForm.addEventListener("submit", async function (event) {
      console.log("Form submit event captured");
      event.preventDefault();

      const formData = new FormData(event.target);
      const items = [];
      const itemInputs = document.querySelectorAll(
        ".inputs-container-item input"
      );
      const quantityInputs = document.querySelectorAll(
        ".inputs-container-quantity input"
      );

      console.log("Capturing items");
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
        "order-date": formData.get("order-date"),
        "order-type": formData.get("order-type"),
        "order-neighbourhood": formData.get("order-neighbourhood"),
        items: items,
      };

      console.log(formData.get("order-date"));

      console.log("Venda Data:", vendaData);

      try {
        const responseVenda = await fetch("/venda-submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vendaData),
        });

        const resultVenda = await responseVenda.json();
        console.log("Response received:", resultVenda);
        if (responseVenda.ok) {
          alert(resultVenda.message);
        } else {
          alert(resultVenda.error);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting the form.");
      }
    });
  } else {
    console.log("vendaForm not found");
  }

  function initializeAutocomplete() {
    const productInputs = document.querySelectorAll(".product-comanda-input");

    fetch("/api/products")
      .then((response) => response.json())
      .then((products) => {
        const productNames = products.map((product) => product.product_name);
        productInputs.forEach((input) => {
          new Awesomplete(input, { list: productNames });
        });
      })
      .catch((error) => {
        console.error("Erro ao carregar produtos:", error);
      });
  }

  btnAddItem.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Adicionado");
    initializeAutocomplete();
  });
});

document.querySelector(".btn-fechamento").addEventListener("click", () => {
  fetch("/api/funcionarios")
    .then((response) => response.json())
    .then((data) => {
      const selects = document.querySelectorAll(".funcionario-selector");
      selects.forEach((select) => {
        data.forEach((funcionario) => {
          const option = document.createElement("option");
          option.value = funcionario.funcionario_id;
          option.textContent = funcionario.funcionario_name;
          select.appendChild(option);
        });
      });
    })
    .catch((error) => console.error("Erro ao buscar funcionários:", error));
});
