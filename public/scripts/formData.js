let salesData = [];

document.addEventListener("DOMContentLoaded", () => {
  const addProductForm = document.getElementById("add-product-form");
  const vendaForm = document.getElementById("venda-form");
  const pagamentoFuncionariosForm = document.getElementById(
    "pagamento-funcionarios-form"
  );
  const fechamentoForm = document.getElementById("fechamento-form");
  const addAccountForm = document.getElementById("addaccount-form");
  const vendasFiltrosForm = document.getElementById("filtros-form");

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
    } else if (orderTypeInput.value === "Balcão") {
      orderTypeInput.value = "Mesa";
      toggleOrderTypeBtn.innerText = "Mesa";

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
  const vendasDateInput = document.querySelector(".vendas-order-date");
  vendasDateInput.addEventListener("input", formatDateInput);

  if (vendaForm) {
    console.log("vendaForm found");

    vendaForm.addEventListener("submit", async function (event) {
      console.log("Form submit event captured");
      event.preventDefault();

      const formData = new FormData(event.target);
      const items = [];
      const meiaItems = [];
      const itemInputs = document.querySelectorAll(
        ".inputs-container-item input"
      );
      const quantityInputs = document.querySelectorAll(
        ".inputs-container-quantity input"
      );
      const categorySelectors = document.querySelectorAll(".category-selector");
      const meiaInput1s = document.querySelectorAll(".addMeiaInput1");
      const meiaInput2s = document.querySelectorAll(".addMeiaInput2");
      const meiaQuantityInputs = document.querySelectorAll(
        ".inputs-container-meia-quantity input"
      );

      console.log("Capturing items");

      itemInputs.forEach((itemInput, index) => {
        const quantityInput = quantityInputs[index];
        const categorySelect = categorySelectors[index];
        items.push({
          product_name: itemInput.value,
          quantity: parseInt(quantityInput.value, 10),
          category: categorySelect ? categorySelect.value : null,
        });
      });

      meiaInput1s.forEach((meiaInput1, index) => {
        const meiaInput2 = meiaInput2s[index];
        const meiaQuantityInput = meiaQuantityInputs[index];
        const categorySelect = categorySelectors[index];
        meiaItems.push({
          product_name_1: meiaInput1.value,
          product_name_2: meiaInput2.value,
          quantity: parseInt(meiaQuantityInput.value, 10),
          category: categorySelect ? categorySelect.value : null,
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
        meiaItems: meiaItems,
      };

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

  vendasFiltrosForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const orderDate = document.querySelector(".vendas-order-date").value;
    const formattedDate = formatDateToISO(orderDate);

    populateSalesCounters(formattedDate);

    fetch(`/api/vendas?orderDate=${formattedDate}`)
      .then((response) => response.json())
      .then((data) => {
        salesData = data;

        const tableBody = document.getElementById("vendas-table-body");
        tableBody.innerHTML = "";

        if (data.message) {
          const row = `<tr><td colspan="4" class="no-result-td">${data.message}<img class="bad-face-result-img" src="/assets/images/sad-face (1).png"></td></tr>`;
          tableBody.insertAdjacentHTML("beforeend", row);
        } else {
          renderTableRows(salesData, tableBody);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
      });
  });
});

function sortDataTable(data, column, order) {
  if (!Array.isArray(data)) {
    console.error("Os dados fornecidos para ordenação não são um array.");
    return;
  }

  data.sort((a, b) => {
    let comparison = 0;

    if (column === "hora") {
      const [hoursA, minutesA] = a.formatted_time.split(":").map(Number);
      const [hoursB, minutesB] = b.formatted_time.split(":").map(Number);

      const totalMinutesA = hoursA * 60 + minutesA;
      const totalMinutesB = hoursB * 60 + minutesB;

      comparison = totalMinutesA - totalMinutesB;
    } else if (column === "valor") {
      comparison = a.cost_payment - b.cost_payment;
    } else if (column === "id") {
      comparison = a.order_id - b.order_id;
    }

    return order === "asc" ? comparison : -comparison;
  });

  const tableBody = document.getElementById("vendas-table-body");
  renderTableRows(data, tableBody);
}

document.querySelectorAll(".sorting-header").forEach((header) => {
  header.addEventListener("click", () => {
    const column = header.getAttribute("data-column");
    let order = header.getAttribute("data-order");

    if (!column) {
      console.error("Coluna não definida.");
      return;
    }

    order = order === "asc" ? "desc" : "asc";
    header.setAttribute("data-order", order);

    const arrowImg = header.querySelector("img");
    if (order === "asc") {
      arrowImg.src =
        "/assets/icons/keyboard_arrow_up_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg";
    } else {
      arrowImg.src =
        "/assets/icons/keyboard_arrow_down_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg";
    }

    sortDataTable(salesData, column, order);
  });
});

function renderTableRows(data, tableBody) {
  tableBody.innerHTML = "";
  data.forEach((item) => {
    const row = `
      <tr data-order-id="${item.order_id}">
        <td>${item.order_id}</td>
        <td>${item.formatted_time}</td>
        <td>${item.cost_payment.toFixed(2)}</td>
        <td>${item.username}</td>
      </tr>`;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
}

async function populateSalesCounters(date) {
  try {
    const response = await fetch("/contar-vendas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderDate: date }),
    });
    const data = await response.json();

    const typeCounters = {};

    data.forEach((item) => {
      const { product_type, quantidade_vendida } = item;

      if (quantidade_vendida > 0) {
        if (!typeCounters[product_type]) {
          typeCounters[product_type] = 0;
        }

        typeCounters[product_type] += quantidade_vendida;
      }
    });

    const container = document.querySelector(".tabela-vendas-info");

    container.innerHTML = "";

    let hasValidData = false;

    for (const [type, quantity] of Object.entries(typeCounters)) {
      if (quantity > 0) {
        hasValidData = true;

        const counterHolder = document.createElement("div");
        counterHolder.className = "sales-counter-holder";

        const title = document.createElement("h5");
        title.textContent = type;
        counterHolder.appendChild(title);
        title.style.textWrap = "nowrap";

        const counterBox = document.createElement("div");
        counterBox.className = "counters-box";

        counterBox.textContent = quantity;

        counterHolder.appendChild(counterBox);

        container.appendChild(counterHolder);
      }
    }

    if (!hasValidData) {
      container.innerHTML = `<p class="full-width">Nenhum dado disponível para a data selecionada.</p>`;
    }
  } catch (error) {
    console.error("Erro ao preencher contadores de vendas:", error);
  }
}

export function initializeAutocomplete() {
  const productInputs = document.querySelectorAll(".product-comanda-input");

  fetch("/api/products")
    .then((response) => response.json())
    .then((products) => {
      const productNames = products.map((product) => product.product_name);
      productInputs.forEach((input) => {
        const awesomplete = new Awesomplete(input, { list: productNames });

        input.addEventListener("awesomplete-selectcomplete", () => {
          setTimeout(() => {
            awesomplete.close();
          }, 70);
        });
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar produtos:", error);
    });
}

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

export function getFuncionariosAccounts(
  funcionarioId,
  selectAccountFuncionario
) {
  if (!selectAccountFuncionario) {
    console.error("O seletor de contas do funcionário está indefinido.");
    return;
  }

  fetch(`/api/accounts?funcionario_id=${funcionarioId}`)
    .then((response) => response.json())
    .then((data) => {
      if (selectAccountFuncionario) {
        selectAccountFuncionario.innerHTML = "";

        data.forEach((account) => {
          const option = document.createElement("option");
          option.value = account.funcionario_account;
          option.textContent = account.funcionario_account;
          selectAccountFuncionario.appendChild(option);
        });
      } else {
        console.error(
          "O seletor de contas do funcionário não está mais no DOM."
        );
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar contas dos funcionários:", error);
    });
}

export function getPizzasCategories() {
  fetch("/api/categories")
    .then((response) => response.json())
    .then((data) => {
      const selects = document.querySelectorAll(".category-selector");
      selects.forEach((select) => {
        if (select.options.length === 0) {
          data.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.category;
            option.textContent = category.category;
            option.dataset.name = category.category;
            select.appendChild(option);
          });
        }
      });
    })
    .catch((error) => console.error("Erro ao buscar categorias:", error));
}

document.querySelector(".btn-fechamento").addEventListener("click", () => {
  getFuncionariosNames("funcionario-selector");
});

document.querySelector(".btn-addaccount").addEventListener("click", () => {
  getFuncionariosNames("addaccount-funcionario");
});

const addPaymentButton = document.querySelector(".pagamento-bottom-adicionar");
if (addPaymentButton) {
  addPaymentButton.addEventListener("click", () => {
    getFuncionariosNames("funcionario-selector");
  });
} else {
  console.log("Botão de adicionar pagamento não encontrado");
}

document.querySelectorAll(".funcionario-selector").forEach((select) => {
  select.addEventListener("change", (event) => {
    const funcionarioId = event.target.value;
    getFuncionariosAccounts(funcionarioId);
  });
});

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

export function formatDateToISO(dateStr) {
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
}
