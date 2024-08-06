document.addEventListener("DOMContentLoaded", () => {
  const addProductForm = document.getElementById("add-product-form");
  const vendaForm = document.getElementById("venda-form");
  const pagamentoFuncionariosForm = document.getElementById(
    "pagamento-funcionarios-form"
  );
  const fechamentoForm = document.getElementById("fechamento-form");
  const addAccountForm = document.getElementById("addaccount-form");

  const btnPagamentoSendForm = document.getElementById("pagamentoSendBtn");
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

  pagamentoFuncionariosForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const funcionariosGroups = document.querySelectorAll(".funcionario-group");
    const items = [];

    funcionariosGroups.forEach((group) => {
      const funcionarioSelector = group.querySelector(".funcionario-selector");
      const funcionarioID = funcionarioSelector.value;
      const funcionarioName =
        funcionarioSelector.options[funcionarioSelector.selectedIndex].dataset
          .name;
      const data = group.querySelector(".input-funcionario-data").value;
      const pagamento = group.querySelector(
        ".input-funcionario-pagamento"
      ).value;
      const descricao = group.querySelector(
        ".input-funcioario-descricao"
      ).value;
      const account = group.querySelector(
        ".funcionario-account-selector"
      ).value;

      if (funcionarioID && data && pagamento && account) {
        items.push({
          funcionarioID: funcionarioID,
          funcionarioName: funcionarioName,
          data: data,
          pagamento: pagamento,
          descricao: descricao,
          account: account,
        });
      }
    });

    const formData = { items };

    try {
      const response = await fetch("/add-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Erro ao enviar dados para o servidor.");
    }
  });

  fechamentoForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = {
      fechamentoDate: document.querySelector(".input-fechamento-date").value,
      initialValue:
        parseFloat(document.querySelector(".input-initial-valor").value) || 0,
      finalValue:
        parseFloat(document.querySelector(".input-final-valor").value) || 0,
      pix: parseFloat(document.querySelector(".input-pix").value) || 0,
      credit: parseFloat(document.querySelector(".input-credito").value) || 0,
      debit: parseFloat(document.querySelector(".input-debito").value) || 0,
      cash: parseFloat(document.querySelector(".input-dinheiro").value) || 0,
      outputValue: parseFloat(document.querySelector(".input-pix").value) || 0,
    };

    try {
      const response = await fetch("/fechamento-submit", {
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
      console.error("Erro ao enviar dados:", error);
      alert("Erro ao enviar dados para o servidor.");
    }
  });

  addAccountForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = {
      funcionarioId: document.querySelector(".addaccount-funcionario").value,
      funcionarioAccount: document.querySelector(
        ".addaccount-funcionario-account"
      ).value,
    };

    try {
      const response = await fetch("/addaccount-submit", {
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
      console.error("Erro ao enviar dados:", error);
      alert("Erro ao enviar dados para o servidor.");
    }
  });

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

export function getFuncionariosNames(selectClass) {
  fetch("/api/funcionarios")
    .then((response) => response.json())
    .then((data) => {
      const selects = document.querySelectorAll(`.${selectClass}`);
      selects.forEach((select) => {
        if (select.options.length === 0) {
          data.forEach((funcionario) => {
            const option = document.createElement("option");
            option.value = funcionario.funcionario_id;
            option.textContent = funcionario.funcionario_name;
            option.dataset.name = funcionario.funcionario_name;
            select.appendChild(option);
          });
        }
      });
    })
    .catch((error) => console.error("Erro ao buscar funcionários:", error));
}

function getFuncionariosAccounts() {
  fetch("/api/funcionarios_accounts")
    .then((response) => response.json())
    .then((data) => {
      const selects = document.querySelectorAll(
        ".funcionario-account-selector"
      );
      selects.forEach((select) => {
        if (select.options.length === 0) {
          data.forEach((funcionario) => {
            const option = document.createElement("option");
            option.value = funcionario.funcionario_account;
            option.textContent = funcionario.funcionario_account;
            option.dataset.name = funcionario.funcionario_account;
            select.appendChild(option);
          });
        }
      });
    })
    .catch((error) =>
      console.error("Erro ao buscar contas dos funcionários:", error)
    );
}

document.querySelector(".btn-fechamento").addEventListener("click", () => {
  getFuncionariosNames("funcionario-selector");
});

document.querySelector(".btn-addaccount").addEventListener("click", () => {
  getFuncionariosNames("addaccount-funcionario");
});

const addPaymentButton = document.querySelector(".pagamento-bottom-adicionar");
if (addPaymentButton) {
  addPaymentButton.addEventListener("click", getFuncionariosNames);
} else {
  console.log("Botão de adicionar pagamento não encontrado");
}

export function formatDateInput(event) {
  const input = event.target;
  let value = input.value.replace(/\D/g, "");

  if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
  if (value.length > 5) value = value.slice(0, 5) + "/" + value.slice(5);

  input.value = value;
}

export function formatDateString(dateString) {
  const date = new Date(dateString);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}
